import React, { useState, useEffect, useContext } from "react";
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
    EndGame
} from "../state_screens";
import { PlayerInfo } from "../components";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flex: 1,
    }
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

    const [wordOfRound, setWordOfRound] = useState("");

    const [players, setPlayers] = useState([]);
    const [orderedPlayers, setOrderedPlayers] = useState([]);

    const [turns, setTurns] = useState(0);

    const { countdown, doCountdown } = props;

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

        const resetTurn = async (isHost, room) => {
            if (!isHost) return;

            if (TURNS_BEFORE_ROUND_ENDS <= room.turns + 1) {
                endRound();
                return;
            }

            await props.firebase.updateById(
                ROOMS_COLLECTION,
                "Dy9vm3vNjlIWKc84Ug78",
                {
                    state: GameState.WORD_DETECTIVES_ASK_QUESTIONS,
                    question_answered: null,
                    questions: [],
                    turns: room.turns + 1
                }
            );
        };

        const newRound = async (isHost, room) => {
            if (!isHost) return;

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
                "Dy9vm3vNjlIWKc84Ug78",
                {
                    state: GameState.WORD_MASTER_CHOOSE_WORD,
                    question_answered: null,
                    questions: [],
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
                "Dy9vm3vNjlIWKc84Ug78",
                {
                    state: GameState.END_GAME,
                }
            );
        };

        const unsubscribe = props.firebase
            .getCollection(ROOMS_COLLECTION)
            .onSnapshot((snapshot) => {
                snapshot.forEach((doc) => {
                    const room = doc.data();
                    const isHost =
                        room.host === sessionContext.state.playerName;

                    setCurrentGameState(room.state);
                    setPlayers(room.players);
                    setTurns(room.turns);

                    setIsWordMaster(
                        room.word_master === sessionContext.state.playerName
                    );

                    switch (room.state) {
                        case GameState.WORD_MASTER_CHOOSE_WORD:
                            setWordMaster(room.word_master);
                            setWordDetectives(room.word_detectives);
                            dealWordsForWordMaster();
                            break;
                        case GameState.WORD_DETECTIVES_ASK_QUESTIONS:
                            setWordOfRound(room.word_of_the_round);
                            if (room.questions.length === 0) {
                                beginCountdown(30, isHost, async () => {
                                    await props.firebase.updateById(
                                        ROOMS_COLLECTION,
                                        "Dy9vm3vNjlIWKc84Ug78",
                                        {
                                            state:
                                                GameState.WORD_MASTER_CHOOSE_QUESTION,
                                        }
                                    );
                                });
                            }
                            break;
                        case GameState.WORD_MASTER_CHOOSE_QUESTION:
                            setQuestions(room.questions);
                            break;
                        case GameState.SHOW_QUESTION_CHOSE:
                            setQuestionAnswered(room.question_answered);
                            beginCountdown(10, isHost, () => resetTurn(isHost, room));
                            break;
                        case GameState.END_ROUND:
                            setWordOfRound(room.word_of_the_round);
                            beginCountdown(10, isHost, () =>
                                newRound(isHost, room)
                            );
                            break;
                        case GameState.END_GAME:
                            const orderedPlayersByScore = room.players.sort((a, b) => b.score - a.score);
                            setOrderedPlayers(orderedPlayersByScore);
                            break;
                        default:
                            break;
                    }
                });
            });
        return () => {
            unsubscribe();
        };
    }, [
        props.firebase,
        doCountdown,
        wordMaster,
        sessionContext.state.playerName,
        sessionContext.state.heartbeatData,
    ]);

    const chooseWord = async (word) => {
        await props.firebase.updateById(
            ROOMS_COLLECTION,
            "Dy9vm3vNjlIWKc84Ug78",
            {
                state: GameState.WORD_DETECTIVES_ASK_QUESTIONS,
                word_of_the_round: word,
            }
        );
    };

    const sendQuestionToWordMaster = async (question) => {
        if (question.toLowerCase() === wordOfRound.toLowerCase()) {
            endRound(sessionContext.state.playerName);
            return;
        }

        await props.firebase.updateById(
            ROOMS_COLLECTION,
            "Dy9vm3vNjlIWKc84Ug78",
            {
                questions: firebase.firestore.FieldValue.arrayUnion({
                    question: question,
                    player: sessionContext.state.playerName,
                }),
            }
        );
    };

    const sendAnswerOfWordMaster = async (questionIndex, answer, player) => {
        const newPlayers = giveScoreToPlayer(player, SCORE_TO_QUESTION_SELECTED);
        await props.firebase.updateById(
            ROOMS_COLLECTION,
            "Dy9vm3vNjlIWKc84Ug78",
            {
                question_answered: {
                    index: questionIndex,
                    answer: answer,
                },
                players: newPlayers,
                state: GameState.SHOW_QUESTION_CHOSE,
            }
        );
    };

    const endRound = async (playerWhoGuessed) => {
        const pointsForWordMaster = TURNS_BEFORE_ROUND_ENDS - turns;
        let newPlayers = giveScoreToPlayer(wordMaster, pointsForWordMaster);
        if (playerWhoGuessed) {
            newPlayers = giveScoreToPlayer(playerWhoGuessed, SCORE_TO_PLAYER_WHO_GUESSED);
        }

        await props.firebase.updateById(
            ROOMS_COLLECTION,
            "Dy9vm3vNjlIWKc84Ug78",
            {
                state: GameState.END_ROUND,
                players: newPlayers,
                turns: 0
            }
        );
    };

    const giveScoreToPlayer = (player, score) => {
        players.forEach(p => {
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
                        question={
                            questions[questionAnswered.index]
                                ? questions[questionAnswered.index].question
                                : "error"
                        }
                        answer={questionAnswered.answer}
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
