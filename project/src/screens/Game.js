import React, { useState, useEffect, useContext, useRef } from "react";
import { makeStyles, Grid } from "@material-ui/core";
import { withFirebase } from "../firebase/context";
//import * as firebase from "firebase/app";
import { database, firestore } from "firebase/app";
import SessionContext from "../context/Session";
import {
    ROOMS_COLLECTION,
    CATEGORIES_COLLECTION,
} from "../firebase/collections";
import { Math } from "../utils";
import GameState from "../state_of_play";
import PlayerStatus from "../player_status";
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
    const { firebase } = props;

    const [isWordMaster, setIsWordMaster] = useState(false);

    const [categoriesToChoose, setCategoriesToChoose] = useState([]);
    const [categorySelected, setCategorySelected] = useState({});
    const [wordsToChoose, setWordsToChoose] = useState([]);

    const [currentGameState, setCurrentGameState] = useState("");

    const [wordMaster, setWordMaster] = useState({});
    const [wordDetectives, setWordDetectives] = useState([]);

    const [questions, setQuestions] = useState([]);
    const [questionAnswered, setQuestionAnswered] = useState({});
    const [clues, setClues] = useState([]);

    const [categoryOfRound, setCategoryOfRound] = useState({});
    const [wordOfRound, setWordOfRound] = useState("");

    const [players, setPlayers] = useState([]);
    const [orderedPlayers, setOrderedPlayers] = useState([]);

    const [turns, setTurns] = useState(0);

    const [loading, setLoading] = useState(true);

    const { countdown, doCountdown } = props;
    const { roomId } = useParams();

    const categoriesToChooseRef = useRef();
    categoriesToChooseRef.current = categoriesToChoose;

    useEffect(() => {
        const beginCountdown = (countdownTo, isHost, callback) => {
            const { readTime, writeTime } = sessionContext.state.heartbeatData;

            // discount the readTime (time that the server takes to get an information to this client)
            // add the writeTime if this is the host (time to write to firestore server) because the host
            // will publish here instantly.
            //const countFrom = countdownTo - readTime + (isHost ? writeTime : 0);
            const countFrom = countdownTo;
            console.log(`counting from ${countFrom}`);
            doCountdown(countFrom, callback);
        };

        const resetTurn = async (room) => {
            if (TURNS_BEFORE_ROUND_ENDS <= room.turns + 1) {
                endRound();
                return;
            }

            await firebase.updateRlById(
                ROOMS_COLLECTION,
                roomId,
                {
                    state: GameState.WORD_DETECTIVES_ASK_QUESTIONS,
                    question_answered: null,
                    questions: null,
                    turns: room.turns + 1,
                }
            );
        };

        const findNextConnectedPlayer = (indexToBegin, players) => {
            for(let i = indexToBegin; i < players.length; i++) {
                if (players[i].status === PlayerStatus.CONNECTED) {
                    return players[i];
                }
            }
            return null;
        };

        const newRound = async (rounds, players) => {
            const newRound = rounds + 1;

            // end game
            if (newRound >= players.length) {
                endGame();
                return;
            }

            const nextConnectedPlayer = findNextConnectedPlayer(newRound, players);
            if (nextConnectedPlayer) {
                const newWordMasterId = players[newRound].id;
                const newDetectiveId = players.filter(player => player.role === 'word_master')[0].id;

                await firebase.updateRlById(
                    ROOMS_COLLECTION,
                    roomId,
                    {
                        state: GameState.WORD_MASTER_CHOOSE_WORD,
                        question_answered: null,
                        questions: null,
                        clues: null,
                        word_of_the_round: "",
                        rounds: newRound,
                        [`/players/${newWordMasterId}/role`]: 'word_master',
                        [`/players/${newDetectiveId}/role`]: 'word_detective'
                    }
                );
            } else {
                endGame();
            }
        };

        const endGame = async () => {
            await firebase.updateRlById(
                ROOMS_COLLECTION,
                roomId,
                {
                    state: GameState.END_GAME,
                }
            );
        };

        const determineRandomWord = async () => {
            const randomCategoryIndex = Math.randomInt(0, categoriesToChooseRef.current.length);
            const randomCategory = categoriesToChooseRef.current[randomCategoryIndex];

            const categoryToChooseFrom = await firebase.getCollection(CATEGORIES_COLLECTION).doc(randomCategory.id).get();
            
            const randomWordIndex = Math.randomInt(
                0,
                categoryToChooseFrom.data().words.length
            );
            const wordOfTheRound = categoryToChooseFrom.data().words[randomWordIndex];

            await firebase.updateRlById(
                ROOMS_COLLECTION,
                roomId,
                {
                    state: GameState.WORD_DETECTIVES_ASK_QUESTIONS,
                    category_of_the_round: randomCategory,
                    word_of_the_round: wordOfTheRound
                }
            );
        };

        const returnCallbackIfHost = (isHost, callback) => {
            if (isHost) {
                return callback;
            }
            return () => null;
        }

        const collectionRef = firebase.getRlCollection(ROOMS_COLLECTION, roomId);
        collectionRef.on('value', (doc) => {
            const room = doc.val();
            const { playerId } = sessionContext.state;
            const isHost = room.host === playerId;

            const playersSorted = Object.values(room.players).sort((a, b) => a.creationDate - b.creationDate);
            setPlayers(playersSorted);
            setCurrentGameState(room.state);
            setTurns(room.turns);

            const playerWordMaster = playersSorted.find(player => player.role === 'word_master');
            setWordMaster(playerWordMaster);
            const isCurrentPlayerWordMaster = playerWordMaster.id === playerId;
            setIsWordMaster(isCurrentPlayerWordMaster);

            setWordDetectives(playersSorted.filter(player => player.role === 'word_detective'));

            const questionsAsked = Object.values(room.questions || {});
            const cluesDiscovered = Object.values(room.clues || {});

            console.log(`incoming state is: ${room.state}`)

            switch (room.state) {
                case GameState.WORD_MASTER_CHOOSE_WORD:
                    setCategoriesToChoose(room.categories);
                    beginCountdown(15, isHost, returnCallbackIfHost(isCurrentPlayerWordMaster, determineRandomWord));
                    break;
                case GameState.WORD_DETECTIVES_ASK_QUESTIONS:
                    setCategoryOfRound(room.category_of_the_round);
                    setWordOfRound(room.word_of_the_round);
                    if (questionsAsked.length === 0) {
                        beginCountdown(30, isHost, returnCallbackIfHost(isHost, async () => {
                            await firebase.updateRlById(
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
                    setQuestions(questionsAsked);
                    beginCountdown(20, isHost, returnCallbackIfHost(isHost, async () => {
                        console.log('triggering callback for choose question timeout');
                        await firebase.updateRlById(
                            ROOMS_COLLECTION,
                            roomId,
                            {
                                question_answered: null,
                                state: GameState.SHOW_QUESTION_CHOSE
                            }
                        );
                    }));
                    break;
                case GameState.SHOW_QUESTION_CHOSE:
                    setQuestionAnswered(room.question_answered);
                    setClues(cluesDiscovered);
                    beginCountdown(20, isHost, returnCallbackIfHost(isHost, () => resetTurn(room)));
                    break;
                case GameState.END_ROUND:
                    setWordOfRound(room.word_of_the_round);
                    setClues([]);
                    beginCountdown(10, isHost, returnCallbackIfHost(isHost, () => newRound(room.rounds, playersSorted)));
                    break;
                case GameState.END_GAME:
                    const orderedPlayersByScore = playersSorted.sort(
                        (a, b) => b.score - a.score
                    );
                    setOrderedPlayers(orderedPlayersByScore);
                    break;
                default:
                    break;
            }

            setLoading(false);
        });
        return () => {
            collectionRef.off();
        };
    }, [
        firebase,
        doCountdown,
        sessionContext.state,
        roomId
    ]);

    const dealWordsForWordMaster = async (category) => {
        const categoryToChooseFrom = await firebase.getCollection(CATEGORIES_COLLECTION).doc(category.id).get();

        let wordsToChooseFrom = [];
        for (let i = 0; i < WORDS_TO_CHOOSE; i++) {
            const randomWord = Math.randomInt(
                0,
                categoryToChooseFrom.data().words.length
            );
            const word = categoryToChooseFrom.data().words[randomWord];
            wordsToChooseFrom.push(word);
        }
        setWordsToChoose(wordsToChooseFrom);
    };

    const chooseCategory = async (category) => {
        dealWordsForWordMaster(category);
        setCategorySelected(category);
    };

    const chooseWord = async (word) => {
        await firebase.updateRlById(
            ROOMS_COLLECTION,
            roomId,
            {
                state: GameState.WORD_DETECTIVES_ASK_QUESTIONS,
                word_of_the_round: word,
                category_of_the_round: categorySelected
            }
        );
    };

    const sendQuestionToWordMaster = async (question) => {
        await firebase.pushToList(ROOMS_COLLECTION, roomId, 'questions', {
            question: question,
            player: sessionContext.state.playerId
        });
    };

    const sendHunchToDiscoverWord = async (hunch) => {
        if (hunch.toLowerCase() === wordOfRound.toLowerCase()) {
            const playerWhoGuessed = players.find(player => player.id === sessionContext.state.playerId)
            await endRound(playerWhoGuessed);
        }
    };

    const sendAnswerOfWordMaster = async (questionIndex, answer, playerId) => {
        const playerToScore = players.find(player => player.id === playerId);
        const newPlayers = giveScoreToPlayer(
            playerToScore,
            SCORE_TO_QUESTION_SELECTED
        );
        const futureClues = firebase.pushToList(ROOMS_COLLECTION, roomId, 'clues', {
            question: questions[questionIndex],
            answer,
        });

        await firebase.updateRlById(
            ROOMS_COLLECTION,
            roomId,
            {
                question_answered: {
                    index: questionIndex,
                    answer: answer,
                },
                ...newPlayers,
                state: GameState.SHOW_QUESTION_CHOSE,
            }
        );

        await futureClues;
    };

    const endRound = async (playerWhoGuessed) => {
        console.log(`ending round with ${playerWhoGuessed}`)
        const pointsForWordMaster = TURNS_BEFORE_ROUND_ENDS - turns;
        const wordMasterWithScore = giveScoreToPlayer(wordMaster, pointsForWordMaster);
        
        let playerWhoGuessedWithScore = {};
        if (playerWhoGuessed) {
            playerWhoGuessedWithScore = giveScoreToPlayer(
                playerWhoGuessed,
                SCORE_TO_PLAYER_WHO_GUESSED
            );
        }
        console.log(playerWhoGuessedWithScore);
        console.log(wordMasterWithScore);

        await firebase.updateRlById(
            ROOMS_COLLECTION,
            roomId,
            {
                state: GameState.END_ROUND,
                turns: 0,
                ...wordMasterWithScore,
                ...playerWhoGuessedWithScore
            }
        );
    };

    const giveScoreToPlayer = (player, score) => {
        return {
            [`/players/${player.id}/score`]: player.score + score
        };
    };

    if (loading) {
        return (
            <p>Loading...</p>
        );
    }

    return (
        <div className={classes.root}>
            <Grid container spacing={3} direction="row">
                <PlayerInfo
                    wordMaster={wordMaster}
                    wordDetectives={wordDetectives}
                    category={categoryOfRound}
                    word={isWordMaster ? wordOfRound : null}
                />

                <Grid item xs={12}>
                    <h1>Bom Jogo, {sessionContext.state.playerName}</h1>
                </Grid>

                {countdown > 0 && <h1>{countdown}</h1>}

                {currentGameState === GameState.WORD_MASTER_CHOOSE_WORD && (
                    <WordMasterChooseWord
                        isWordMaster={isWordMaster}
                        categories={categoriesToChoose}
                        onClickCategory={chooseCategory}
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

                {currentGameState === GameState.SHOW_QUESTION_CHOSE && questionAnswered && (
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
