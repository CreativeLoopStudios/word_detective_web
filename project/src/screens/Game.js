import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { makeStyles, Grid } from "@material-ui/core";
import { withFirebase } from "../firebase/context";
//import * as firebase from "firebase/app";
//import { database, firestore } from "firebase/app";
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
import FirebaseEvents from "../firebase_events";

const WORDS_TO_CHOOSE = 5;
const TURNS_BEFORE_ROUND_ENDS = 5;
const SCORE_TO_PLAYER_WHO_GUESSED = 2;
const SCORE_TO_QUESTION_SELECTED = 1;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flex: 1,
    },
}));

const giveScoreToPlayer = (player, score) => {
    return {
        [`/players/${player.id}/score`]: player.score + score
    };
};

const Game = (props) => {
    const classes = useStyles();

    const { playerId, playerName } = useContext(SessionContext).state;
    const { firebase } = props;

    const [categoriesToChoose, setCategoriesToChoose] = useState([]);
    const [categorySelected, setCategorySelected] = useState({});
    const [wordsToChoose, setWordsToChoose] = useState([]);

    const [currentGameState, setCurrentGameState] = useState("");
    const [currentCountdownState, setCurrentCountdownState] = useState("");

    const [wordMaster, setWordMaster] = useState({});
    const [wordDetectives, setWordDetectives] = useState([]);
    const [host, setHost] = useState(null);

    const [questions, setQuestions] = useState([]);
    const [questionAnswered, setQuestionAnswered] = useState({});
    const [clues, setClues] = useState([]);
    const [hunches, setHunches] = useState([]);

    const [categoryOfRound, setCategoryOfRound] = useState({});
    const [wordOfRound, setWordOfRound] = useState("");

    const [playersByScore, setPlayersByScore] = useState([]);

    const [rounds, setRounds] = useState(0);
    const [turns, setTurns] = useState(0);

    const { countdown, doCountdown } = props;
    const { roomId } = useParams();

    const categoriesToChooseRef = useRef();
    categoriesToChooseRef.current = categoriesToChoose;

    // computed variables
    const isWordMaster = wordMaster && wordMaster.id === playerId;
    const isHost = host && host.id === playerId;
    const loading = !(playersByScore.length > 0 && wordDetectives.length > 0 && wordMaster && host);
    const currentPlayer = (playersByScore && playersByScore.find(p => p.id === playerId)) || null;

    const updateRoom = useCallback((data) => {
        return firebase.updateRlById(ROOMS_COLLECTION, roomId, data);
    }, [firebase, roomId]);

    const roomPushToList = useCallback((attr, data) => {
        return firebase.pushToList(ROOMS_COLLECTION, roomId, attr, data);
    }, [firebase, roomId]);

    const sendHunchToDiscoverWord = (hunch) => {
        if (hunch.toLowerCase() === wordOfRound.toLowerCase()) {
            return endRound(currentPlayer);
        }
        else {
            firebase.logEvent(FirebaseEvents.EVENTS.TYPED_HUNCH, {
                [FirebaseEvents.PROP.ROOM_ID]: roomId,
                [FirebaseEvents.PROP.PLAYER_ID]: playerId,
                [FirebaseEvents.PROP.HUNCH]: hunch
            });
            return roomPushToList('hunches', {
                text: hunch
            });
        }
    };

    const sendAnswerOfWordMaster = async (questionIndex, answer, playerId) => {
        const playerToScore = playersByScore.find(player => player.id === playerId);
        const newPlayers = giveScoreToPlayer(
            playerToScore,
            SCORE_TO_QUESTION_SELECTED
        );
        const futureClues = roomPushToList('clues', {
            question: questions[questionIndex],
            answer,
        });

        firebase.logEvent(FirebaseEvents.EVENTS.CHOSEN_QUESTION, {
            [FirebaseEvents.PROP.ROOM_ID]: roomId,
            [FirebaseEvents.PROP.PLAYER_ID]: playerToScore.id,
            [FirebaseEvents.PROP.QUESTION]: questions[questionIndex]
        });

        await updateRoom({
            question_answered: {
                index: questionIndex,
                answer: answer,
            },
            ...newPlayers,
            state: GameState.SHOW_QUESTION_CHOSE,
        });
        await futureClues;
    };

    const sendQuestionToWordMaster = (question) => {
        firebase.logEvent(FirebaseEvents.EVENTS.ASKED_QUESTION, {
            [FirebaseEvents.PROP.ROOM_ID]: roomId,
            [FirebaseEvents.PROP.PLAYER_ID]: playerId,
            [FirebaseEvents.PROP.QUESTION]: question
        });
        return roomPushToList('questions', {
            question: question,
            player: playerId
        });
    };

    const chooseWord = (word) => {
        firebase.logEvent(FirebaseEvents.EVENTS.CHOSEN_WORD, {
            [FirebaseEvents.PROP.ROOM_ID]: roomId,
            [FirebaseEvents.PROP.ROUND]: rounds,
            [FirebaseEvents.PROP.WORD]: word
        });
        return updateRoom({
            state: GameState.WORD_DETECTIVES_ASK_QUESTIONS,
            word_of_the_round: word,
            category_of_the_round: categorySelected
        });
    };

    const chooseCategory = async (category) => {
        const words = (await firebase.getCollection(CATEGORIES_COLLECTION).doc(category.id).get()).data().words;

        // takes a random sample without replacement
        // how it works:
        // 1. make an array with the length of all the words
        // 2. map a random number (with very low prob of repetition) to each index
        // 3. sort by those random numbers (this will shuffle all the indexes)
        // 4. slice the array to get the sample
        // 5. get the corresponding word for each index
        const wordsToChooseFrom = [...Array(words.length)]
            .map((_, idx) => [idx, Math.random()])
            .sort((a, b) => a[1] - b[1])
            .slice(0, WORDS_TO_CHOOSE)
            .map(([idx, r]) => words[idx]);

        setWordsToChoose(wordsToChooseFrom);
        setCategorySelected(category);
    };

    const endRound = useCallback(async (playerWhoGuessed) => {
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

        await updateRoom({
            state: GameState.END_ROUND,
            turns: 0,
            ...wordMasterWithScore,
            ...playerWhoGuessedWithScore
        });
    }, [wordMaster, updateRoom, turns]);

    const endRoundWithoutPoints = useCallback(() => {
        return updateRoom({
            state: GameState.END_ROUND,
            turns: 0
        });
    }, [updateRoom]);

    const resetTurn = useCallback(async () => {
        if (TURNS_BEFORE_ROUND_ENDS <= turns + 1) {
            await endRound();
            return;
        }

        await updateRoom({
            state: GameState.WORD_DETECTIVES_ASK_QUESTIONS,
            question_answered: null,
            questions: null,
            turns: turns + 1,
            hunches: null
        });
    }, [updateRoom, endRound, turns]);

    const determineRandomWord = useCallback(async () => {
        const randomCategoryIndex = Math.randomInt(0, categoriesToChooseRef.current.length);
        const randomCategory = categoriesToChooseRef.current[randomCategoryIndex];

        const categoryToChooseFrom = await firebase.getCollection(CATEGORIES_COLLECTION).doc(randomCategory.id).get();
        
        const randomWordIndex = Math.randomInt(0, categoryToChooseFrom.data().words.length);
        const wordOfTheRound = categoryToChooseFrom.data().words[randomWordIndex];

        await updateRoom({
            state: GameState.WORD_DETECTIVES_ASK_QUESTIONS,
            category_of_the_round: randomCategory,
            word_of_the_round: wordOfTheRound
        });
    }, [updateRoom, firebase]);

    const endGame = useCallback(() => {
        firebase.logEvent(FirebaseEvents.EVENTS.FINAL_SCORE, {
            [FirebaseEvents.PROP.ROOM_ID]: roomId,
            [FirebaseEvents.PROP.PLAYERS]: playersByScore.map(p => ({ playerId: p.id, score: p.score }))
        });
        return updateRoom({
            state: GameState.END_GAME,
        });
    }, [updateRoom, firebase, roomId, playersByScore]);

    const newRound = useCallback(() => {
        const availablePlayers = playersByScore.filter(p => p.status === PlayerStatus.CONNECTED);
        if (availablePlayers.length < 2) {
            // not enough players to continue
            console.log('impossible to advance to new round; ending game')
            return endGame();
        }

        const availableToBeWm = availablePlayers.filter(p => !p.playedAsWordMaster && p.id !== wordMaster.id);
        if (availableToBeWm.length === 0) {
            // everybody was already the WM once
            console.log('no available WMs; ending game')
            return endGame();
        }

        const newRound = rounds + 1;
        const newWordMasterId = availableToBeWm[0].id;
        const prevWordMasterId = playersByScore.filter(player => player.role === 'word_master')[0].id;
        console.log(`selecting ${newWordMasterId} as the new word master`)

        const data = {
            state: GameState.WORD_MASTER_CHOOSE_WORD,
            question_answered: null,
            questions: null,
            clues: null,
            word_of_the_round: "",
            rounds: newRound
        };
        data[`/players/${prevWordMasterId}/role`] = 'word_detective';
        data[`/players/${prevWordMasterId}/playedAsWordMaster`] = true;
        data[`/players/${newWordMasterId}/role`] = 'word_master';

        return updateRoom(data);
    }, [updateRoom, endGame, rounds, playersByScore, wordMaster]);

    // room setup
    useEffect(() => {
        const collectionRef = firebase.getRlCollection(ROOMS_COLLECTION, roomId);
        collectionRef.on('value', doc => {
            const room = doc.val();
            if (!room || !room.players || room.players.length === 0) {
                return;
            }

            console.log("new room setup");
            const playersByCreation = Object.values(room.players).sort((a, b) => a.creationDate - b.creationDate);
            setPlayersByScore(playersByCreation.sort((a, b) => b.score - a.score));

            // host will always be the first player to join that is not disconnected
            const connectedPlayers = playersByCreation.filter(p => p.status === PlayerStatus.CONNECTED);
            if (connectedPlayers.length > 0) {
                setHost(connectedPlayers[0]);
            }

            setWordMaster(playersByCreation.find(player => player.role === 'word_master'));
            setWordDetectives(playersByCreation.filter(player => player.role === 'word_detective'));

            setQuestions(Object.values(room.questions || {}));
            setQuestionAnswered(room.question_answered || {});
            setClues(Object.values(room.clues || {}));
            setHunches(Object.values(room.hunches || {}));

            setCategoriesToChoose(room.categories || []);
            setCategoryOfRound(room.category_of_the_round || {});

            setWordOfRound(room.word_of_the_round);

            setTurns(room.turns);
            setRounds(room.rounds);
            setCurrentGameState(room.state);
        });

        return () => collectionRef.off();
    }, [setCurrentGameState, setTurns, setHost, setWordMaster, setWordDetectives, setQuestions, setClues, setHunches,
        setCategoriesToChoose, setCategoryOfRound, setWordOfRound, setPlayersByScore, firebase, playerId, roomId, currentGameState]);

    // set myself as connected
    useEffect(() => {
        if (!currentPlayer) {
            return;
        }

        if (currentPlayer.status !== PlayerStatus.CONNECTED) {
            console.log(`setting ${currentPlayer.name} as connected`)
            updateRoom({
                [`/players/${currentPlayer.id}/status`]: PlayerStatus.CONNECTED
            });
            firebase.onDisconnect(roomId, currentPlayer.id);
        } 
    }, [playersByScore, roomId, currentPlayer, firebase, updateRoom]);

    // host watch if WM is disconnected
    useEffect(() => {
        if (!currentGameState || loading) {
            return;
        }

        if (isHost && wordMaster.status === PlayerStatus.DISCONNECTED && currentGameState !== GameState.END_ROUND 
            && currentGameState !== GameState.WM_DISCONNECTED && currentGameState !== GameState.END_GAME) {
            console.log('host has detected that the word master has disconnected')
            updateRoom({
                state: GameState.WM_DISCONNECTED
            })
        }
    }, [currentGameState, wordMaster, loading, isHost, updateRoom]);

    // game state machine
    useEffect(() => {
        if (currentCountdownState === currentGameState || loading) {
            return;
        }
        console.log(`game state machine: ${currentGameState}`);

        let timer = 0;
        let callback = null;

        switch (currentGameState) {
            case GameState.WORD_MASTER_CHOOSE_WORD:
                // at this state, the word master is choosing the challenge word
                timer = 15;
                callback = isWordMaster && determineRandomWord;
                break;
            case GameState.WORD_DETECTIVES_ASK_QUESTIONS:
                // WDs are writing questions
                timer = 30
                callback = isHost && (async () => {
                    await updateRoom({
                        state: GameState.WORD_MASTER_CHOOSE_QUESTION,
                    });
                });
                break;
            case GameState.WORD_MASTER_CHOOSE_QUESTION:
                timer = 20;
                callback = isHost && (() => {
                    console.log('triggering callback for choose question timeout');
                    return updateRoom({
                        question_answered: null,
                        state: GameState.SHOW_QUESTION_CHOSE
                    });
                });
                break;
            case GameState.SHOW_QUESTION_CHOSE:
                timer = 20;
                callback = isHost && resetTurn;
                break;
            case GameState.END_ROUND:
                timer = 10;
                callback = isHost && newRound;
                break;
            case GameState.WM_DISCONNECTED:
                timer = 5;
                callback = isHost && endRoundWithoutPoints;
                break;
            default:
                break;
        }

        if (timer > 0) {
            console.log(`counting from ${timer}`)
            doCountdown(timer, callback || null);
        }

        setCurrentCountdownState(currentGameState);
    }, [endRound, updateRoom, endRoundWithoutPoints, doCountdown, determineRandomWord, newRound, resetTurn, 
        setCurrentCountdownState, currentGameState, isWordMaster, isHost, loading, 
        currentCountdownState]);

    // render loading
    if (loading) {
        return (
            <p>Loading...</p>
        );
    }

    // render layout
    return (
        <div className={classes.root}>
            <Grid container spacing={3} direction="row">
                <PlayerInfo
                    wordMaster={wordMaster}
                    wordDetectives={wordDetectives}
                    category={categoryOfRound}
                    word={isWordMaster ? wordOfRound : null}
                    host={host}
                />

                <Grid item xs={12}>
                    <h1>Bom Jogo, {playerName}</h1>
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
                        questions={questions}
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
                        hunches={hunches}
                    />
                )}

                {currentGameState === GameState.WM_DISCONNECTED && (
                    <span>O WordMaster desconectou! Iniciando nova rodada...</span>
                )}

                {currentGameState === GameState.END_ROUND && (
                    <EndRound word={wordOfRound} />
                )}

                {currentGameState === GameState.END_GAME && (
                    <EndGame players={playersByScore} />
                )}
            </Grid>
        </div>
    );
}

export default withCountdown(withFirebase(Game));
