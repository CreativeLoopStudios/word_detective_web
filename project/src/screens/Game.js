import React, { useState, useEffect, useContext, useRef } from "react";
import { makeStyles, Grid } from "@material-ui/core";
import { withFirebase } from "../firebase/context";
import * as firebase from "firebase/app";
import SessionContext from "../context/Session";
import {
    ROOMS_COLLECTION,
    CATEGORIES_COLLECTION,
} from "../firebase/collections";
import { Math } from "../utils";
import GameState from "../state_of_play";
import { withCountdown } from "../hocs";
import {
    WordMasterChooseWord,
    WordDetectivesAskQuestions,
    WordMasterChooseQuestions,
    ShowQuestionsChosed,
    EndRound,
    EndGame,
} from "../state_screens";
import { PlayerInfo } from "../components";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flex: 1,
    },
}));

function Game(props) {
    const WORDS_TO_CHOOSE = 5;
    const TURNS_BEFORE_ROUND_ENDS = 5;
    const SCORE_TO_PLAYER_WHO_GUESSED = 2;
    const SCORE_TO_QUESTION_SELECTED = 1;

    const classes = useStyles();

    const sessionContext = useContext(SessionContext);

    const [isWordMaster, setIsWordMaster] = useState(false);

    const [wordsToChoose, setWordsToChoose] = useState([]);

    const [currentGameState, setCurrentGameState] = useState("");

    const [wordMaster, setWordMaster] = useState("");
    const [wordDetectives, setWordDetectives] = useState([]);

    const [questions, setQuestions] = useState([]);
    const [questionAnswered, setQuestionAnswered] = useState({});
    const [clues, setClues] = useState([]);

    const [wordOfRound, setWordOfRound] = useState("");

    const [players, setPlayers] = useState([]);
    const [orderedPlayers, setOrderedPlayers] = useState([]);

    const [turns, setTurns] = useState(0);

    const { countdown, doCountdown } = props;
    const { roomId } = useParams();

    const wordsToChooseRef = useRef();
    wordsToChooseRef.current = wordsToChoose;

    useEffect(() => {
        const dealWordsForWordMaster = async () => {
            const categories = await props.firebase
                .getCollection(CATEGORIES_COLLECTION)
                .get();

            let wordsToChooseFrom = [];
            for (let i = 0; i < WORDS_TO_CHOOSE; i++) {
                const randomCategory = Math.randomInt(0, categories.size);
                const categoryToChooseWord = categories.docs[
                    randomCategory
                ].data();

                const randomWord = Math.randomInt(
                    0,
                    categoryToChooseWord.words.length
                );
                const word = categoryToChooseWord.words[randomWord];
                wordsToChooseFrom.push(word);
            }
            setWordsToChoose(wordsToChooseFrom);
        };

        const beginCountdown = (countdownTo, isHost, callback) => {
            const { readTime, writeTime } = sessionContext.state.heartbeatData;

            // discount the readTime (time that the server takes to get an information to this client)
            // add the writeTime if this is the host (time to write to firestore server) because the host
            // will publish here instantly.
            const countFrom = countdownTo - readTime + (isHost ? writeTime : 0);
            console.log(`counting from ${countFrom}`);
            doCountdown(countFrom, callback);
        };

        const resetTurn = async (room) => {
            if (TURNS_BEFORE_ROUND_ENDS <= room.turns + 1) {
                endRound();
                return;
            }

            await props.firebase.updateById(
                ROOMS_COLLECTION,
                roomId,
                {
                    state: GameState.WORD_DETECTIVES_ASK_QUESTIONS,
                    question_answered: null,
                    questions: [],
                    turns: room.turns + 1,
                }
            );
        };

        const newRound = async (room) => {
            const newRound = room.rounds + 1;

            // end game
            if (newRound === room.players.length) {
                endGame();
                return;
            }

            const newWordMaster = room.players[newRound].name;
            const newDetective = room.word_master;

            let detectiveToRemove = null;
            for (let index in room.word_detectives) {
                if (room.word_detectives[index] === newWordMaster) {
                    detectiveToRemove = index;
                }
            }

            if (detectiveToRemove != null) {
                room.word_detectives.splice(detectiveToRemove, 1);
            }

            await props.firebase.updateById(
                ROOMS_COLLECTION,
                roomId,
                {
                    state: GameState.WORD_MASTER_CHOOSE_WORD,
                    question_answered: null,
                    questions: [],
                    clues: [],
                    word_of_the_round: "",
                    rounds: newRound,
                    word_master: newWordMaster,
                    word_detectives: [...room.word_detectives, newDetective],
                }
            );
        };

        const endGame = async () => {
            await props.firebase.updateById(
                ROOMS_COLLECTION,
                roomId,
                {
                    state: GameState.END_GAME,
                }
            );
        };

        const determineRandomWord = async () => {
            const randomWordIndex = Math.randomInt(
                0,
                wordsToChooseRef.current.length
            );
            await props.firebase.updateById(
                ROOMS_COLLECTION,
                roomId,
                {
                    state: GameState.WORD_DETECTIVES_ASK_QUESTIONS,
                    word_of_the_round:
                        wordsToChooseRef.current[randomWordIndex],
                }
            );
        };

        const returnCallbackIfHost = (isHost, callback) => {
            if (isHost) {
                return callback;
            }
            return () => null;
        }

        const unsubscribe = props.firebase
            .getCollection(ROOMS_COLLECTION, roomId)
            .onSnapshot((doc) => {
                const room = doc.data();
                const isHost =
                    room.host === sessionContext.state.playerName;
                const isCurrentPlayerIsWordMaster =
                    room.word_master === sessionContext.state.playerName;

                setCurrentGameState(room.state);
                setPlayers(room.players);
                setTurns(room.turns);

                setIsWordMaster(isCurrentPlayerIsWordMaster);

                switch (room.state) {
                    case GameState.WORD_MASTER_CHOOSE_WORD:
                        setWordMaster(room.word_master);
                        setWordDetectives(room.word_detectives);
                        if (isCurrentPlayerIsWordMaster) {
                            dealWordsForWordMaster();
                        }
                        beginCountdown(15, isHost, returnCallbackIfHost(isCurrentPlayerIsWordMaster, determineRandomWord));
                        break;
                    case GameState.WORD_DETECTIVES_ASK_QUESTIONS:
                        setWordOfRound(room.word_of_the_round);
                        if (room.questions.length === 0) {
                            beginCountdown(30, isHost, returnCallbackIfHost(isHost, async () => {
                                await props.firebase.updateById(
                                    ROOMS_COLLECTION,
                                    roomId,
                                    {
                                        state:
                                            GameState.WORD_MASTER_CHOOSE_QUESTION,
                                    }
                                );
                            }));
                        }
                        break;
                    case GameState.WORD_MASTER_CHOOSE_QUESTION:
                        setQuestions(room.questions);
                        beginCountdown(20, isHost, returnCallbackIfHost(isHost, async () => {
                            await props.firebase.updateById(
                                ROOMS_COLLECTION,
                                roomId,
                                {
                                    question_answered: {},
                                    state: GameState.SHOW_QUESTION_CHOSE
                                }
                            );
                        }));
                        break;
                    case GameState.SHOW_QUESTION_CHOSE:
                        setQuestionAnswered(room.question_answered);
                        setClues(room.clues);
                        beginCountdown(20, isHost, returnCallbackIfHost(isHost, () => resetTurn(room)));
                        break;
                    case GameState.END_ROUND:
                        setWordOfRound(room.word_of_the_round);
                        beginCountdown(10, isHost, returnCallbackIfHost(isHost, () => newRound(room)));
                        break;
                    case GameState.END_GAME:
                        const orderedPlayersByScore = room.players.sort(
                            (a, b) => b.score - a.score
                        );
                        setOrderedPlayers(orderedPlayersByScore);
                        break;
                    default:
                        break;
                }
                });
        return () => {
            unsubscribe();
        };
    }, [
        props.firebase,
        doCountdown,
        sessionContext.state.playerName,
        sessionContext.state.heartbeatData,
        roomId
    ]);

    const chooseWord = async (word) => {
        await props.firebase.updateById(
            ROOMS_COLLECTION,
            roomId,
            {
                state: GameState.WORD_DETECTIVES_ASK_QUESTIONS,
                word_of_the_round: word,
            }
        );
    };

    const sendQuestionToWordMaster = async (question) => {
        await props.firebase.updateById(
            ROOMS_COLLECTION,
            roomId,
            {
                questions: firebase.firestore.FieldValue.arrayUnion({
                    question: question,
                    player: sessionContext.state.playerName,
                }),
            }
        );
    };

    const sendHunchToDiscoverWord = async (hunch) => {
        if (hunch.toLowerCase() === wordOfRound.toLowerCase()) {
            endRound(sessionContext.state.playerName);
        }
    };

    const sendAnswerOfWordMaster = async (questionIndex, answer, player) => {
        const newPlayers = giveScoreToPlayer(
            player,
            SCORE_TO_QUESTION_SELECTED
        );
        await props.firebase.updateById(
            ROOMS_COLLECTION,
            roomId,
            {
                question_answered: {
                    index: questionIndex,
                    answer: answer,
                },
                clues: firebase.firestore.FieldValue.arrayUnion({
                    question: questions[questionIndex],
                    answer,
                }),
                players: newPlayers,
                state: GameState.SHOW_QUESTION_CHOSE,
            }
        );
    };

    const endRound = async (playerWhoGuessed) => {
        const pointsForWordMaster = TURNS_BEFORE_ROUND_ENDS - turns;
        let newPlayers = giveScoreToPlayer(wordMaster, pointsForWordMaster);
        if (playerWhoGuessed) {
            newPlayers = giveScoreToPlayer(
                playerWhoGuessed,
                SCORE_TO_PLAYER_WHO_GUESSED
            );
        }

        await props.firebase.updateById(
            ROOMS_COLLECTION,
            roomId,
            {
                state: GameState.END_ROUND,
                players: newPlayers,
                turns: 0,
            }
        );
    };

    const giveScoreToPlayer = (player, score) => {
        players.forEach((p) => {
            if (p.name === player) {
                p.score += score;
            }
        });
        return players;
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={3} direction="row">
                <PlayerInfo
                    wordMaster={wordMaster}
                    wordDetectives={wordDetectives}
                    players={players}
                    word={isWordMaster ? wordOfRound : null}
                />

                <Grid item xs={12}>
                    <h1>Bom Jogo, {sessionContext.state.playerName}</h1>
                </Grid>

                {countdown > 0 && <h1>{countdown}</h1>}

                {currentGameState === GameState.WORD_MASTER_CHOOSE_WORD && (
                    <WordMasterChooseWord
                        isWordMaster={isWordMaster}
                        words={wordsToChoose}
                        onClickWord={chooseWord}
                    />
                )}

                {currentGameState ===
                    GameState.WORD_DETECTIVES_ASK_QUESTIONS && (
                    <WordDetectivesAskQuestions
                        isWordMaster={isWordMaster}
                        sendQuestion={sendQuestionToWordMaster}
                        clues={clues}
                    />
                )}

                {currentGameState === GameState.WORD_MASTER_CHOOSE_QUESTION && (
                    <WordMasterChooseQuestions
                        isWordMaster={isWordMaster}
                        questions={questions}
                        sendAnswer={sendAnswerOfWordMaster}
                    />
                )}

                {currentGameState === GameState.SHOW_QUESTION_CHOSE && (
                    <ShowQuestionsChosed
                        isWordMaster={isWordMaster}
                        question={
                            questions[questionAnswered.index]
                                ? questions[questionAnswered.index].question
                                : "error"
                        }
                        answer={questionAnswered.answer}
                        sendHunchToDiscoverWord={sendHunchToDiscoverWord}
                        clues={clues}
                    />
                )}

                {currentGameState === GameState.END_ROUND && (
                    <EndRound word={wordOfRound} />
                )}

                {currentGameState === GameState.END_GAME && (
                    <EndGame players={orderedPlayers} />
                )}
            </Grid>
        </div>
    );
}

export default withCountdown(withFirebase(Game));
