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

    const { playerId, playerName, heartbeatData } = useContext(SessionContext).state;
    const { firebase } = props;

    const [categoriesToChoose, setCategoriesToChoose] = useState([]);
    const [categorySelected, setCategorySelected] = useState({});
    const [wordsToChoose, setWordsToChoose] = useState([]);

    const [currentGameState, setCurrentGameState] = useState("");

    const [wordMaster, setWordMaster] = useState({});
    const [wordDetectives, setWordDetectives] = useState([]);
    const [isHost, setIsHost] = useState(false);

    const [questions, setQuestions] = useState([]);
    const [questionAnswered, setQuestionAnswered] = useState({});
    const [clues, setClues] = useState([]);

    const [categoryOfRound, setCategoryOfRound] = useState({});
    const [wordOfRound, setWordOfRound] = useState("");

    const [playersByScore, setPlayersByScore] = useState([]);

    const [rounds, setRounds] = useState(0);
    const [turns, setTurns] = useState(0);

    const { countdown, doCountdown } = props;
    const { roomId } = useParams();

    const categoriesToChooseRef = useRef();
    categoriesToChooseRef.current = categoriesToChoose;

    const updateRoom = useCallback((data) => {
        return firebase.updateRlById(ROOMS_COLLECTION, roomId, data);
    }, [firebase, roomId]);

    // lightweight computed variable ;)
    const loading = !(playersByScore.length > 0 && wordDetectives.length > 0);

    const sendHunchToDiscoverWord = (hunch) => {
        if (hunch.toLowerCase() === wordOfRound.toLowerCase()) {
            endRound(playersByScore.find(p => p.id === playerId));
        }
    };

    const sendAnswerOfWordMaster = async (questionIndex, answer, playerId) => {
        const playerToScore = playersByScore.find(player => player.id === playerId);
        const newPlayers = giveScoreToPlayer(
            playerToScore,
            SCORE_TO_QUESTION_SELECTED
        );
        const futureClues = firebase.pushToList(ROOMS_COLLECTION, roomId, 'clues', {
            question: questions[questionIndex],
            answer,
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
        return firebase.pushToList(ROOMS_COLLECTION, roomId, 'questions', {
            question: question,
            player: playerId
        });
    };

    const chooseWord = (word) => {
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

    const findNextConnectedPlayer = (indexToBegin, players) => {
        for (let i = indexToBegin; i < players.length; i++) {
            if (players[i].status === PlayerStatus.CONNECTED) {
                return players[i];
            }
        }
        return null;
    };

    // room setup
    useEffect(() => {
        const collectionRef = firebase.getRlCollection(ROOMS_COLLECTION, roomId);
        collectionRef.on('value', doc => {
            const room = doc.val();
            if (!room || !room.players || room.players.length === 0) {
                return;
            }
            console.log("new room snapshot");

            const playersByCreation = Object.values(room.players).sort((a, b) => a.creationDate - b.creationDate);
            setPlayersByScore(playersByCreation.sort((a, b) => b.score - a.score));

            setCurrentGameState(room.state);
            setTurns(room.turns);
            setRounds(room.rounds);

            // host will always be the first player to join that is not disconnected
            const connectedPlayers = playersByCreation.filter(p => p.status === PlayerStatus.CONNECTED);
            setIsHost(connectedPlayers.length > 0 && connectedPlayers[0].id === playerId);

            setWordMaster(playersByCreation.find(player => player.role === 'word_master'));
            setWordDetectives(playersByCreation.filter(player => player.role === 'word_detective'));

            setQuestions(Object.values(room.questions || {}));
            setQuestionAnswered(room.question_answered || {});
            setClues(Object.values(room.clues || {}));

            setCategoriesToChoose(room.categories || []);
            setCategoryOfRound(room.category_of_the_round || {});

            setWordOfRound(room.word_of_the_round);
        });

        return () => collectionRef.off();
    }, [setCurrentGameState, setTurns, setIsHost, setWordMaster, setWordDetectives, setQuestions, setClues, 
        setCategoriesToChoose, setCategoryOfRound, setWordOfRound, setPlayersByScore, firebase, playerId, roomId]);

    // set myself as connected
    useEffect(() => {
        if (loading) return;

        const player = playersByScore.find(p => p.id === playerId);
        if (player.status !== PlayerStatus.CONNECTED) {
            console.log(`setting myself as connected: ${playerId}`);
            updateRoom({
                [`/players/${playerId}/status`]: PlayerStatus.CONNECTED
            });
        } 
    }, [playersByScore, playerId, updateRoom, loading]);

    // game state machine
    useEffect(() => {
        if (!currentGameState || loading) {
            return;
        }
        console.log(`state is: ${currentGameState}`);

        const endRoundWithoutPoints = () => {
            return updateRoom({
                state: GameState.END_ROUND,
                turns: 0
            });
        };

        const resetTurn = async (turns) => {
            if (TURNS_BEFORE_ROUND_ENDS <= turns + 1) {
                await endRound();
                return;
            }

            await updateRoom({
                state: GameState.WORD_DETECTIVES_ASK_QUESTIONS,
                question_answered: null,
                questions: null,
                turns: turns + 1,
            });
        };

        const beginCountdown = (countFrom, callback) => {
            console.log(`counting from ${countFrom}`);
            doCountdown(countFrom, callback);
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

            await updateRoom({
                state: GameState.WORD_DETECTIVES_ASK_QUESTIONS,
                category_of_the_round: randomCategory,
                word_of_the_round: wordOfTheRound
            });
        };

        const endGame = () => {
            return updateRoom({
                state: GameState.END_GAME,
            });
        };

        const newRound = async (rounds, players) => {
            const newRound = rounds + 1;

            // end game
            if (newRound >= players.length) {
                await endGame();
                return;
            }

            // TODO: this implementation has one limitation: 
            // if the player that would be the next word master is disconnected, the game ends.
            const nextConnectedPlayer = findNextConnectedPlayer(newRound, players);
            if (nextConnectedPlayer) {
                const newWordMasterId = players[newRound].id;
                const newDetectiveId = players.filter(player => player.role === 'word_master')[0].id;

                await updateRoom({
                    state: GameState.WORD_MASTER_CHOOSE_WORD,
                    question_answered: null,
                    questions: null,
                    clues: null,
                    word_of_the_round: "",
                    rounds: newRound,
                    [`/players/${newWordMasterId}/role`]: 'word_master',
                    [`/players/${newDetectiveId}/role`]: 'word_detective'
                });
            } else {
                await endGame();
            }
        };

        (async() => {
            if (wordMaster.status === PlayerStatus.DISCONNECTED && currentGameState !== GameState.END_ROUND) {
                await endRoundWithoutPoints();
                return;
            }

            let timer = 0;
            let callback = null;

            switch (currentGameState) {
                case GameState.WORD_MASTER_CHOOSE_WORD:
                    // at this state, the word master is choosing the challenge word
                    timer = 15;
                    callback = wordMaster.id === playerId && determineRandomWord;
                    break;
                case GameState.WORD_DETECTIVES_ASK_QUESTIONS:
                    // WDs are writing questions
                    // we have transitions to this exact state, so we need to protect this
                    timer = questions.length === 0 ? 30 : -1;
                    callback = isHost && (async () => {
                        await updateRoom({
                            state: GameState.WORD_MASTER_CHOOSE_QUESTION,
                        });
                    });
                    break;
                case GameState.WORD_MASTER_CHOOSE_QUESTION:
                    timer = 20;
                    callback = isHost && (async () => {
                        console.log('triggering callback for choose question timeout');
                        await updateRoom({
                            question_answered: null,
                            state: GameState.SHOW_QUESTION_CHOSE
                        });
                    });
                    break;
                case GameState.SHOW_QUESTION_CHOSE:
                    timer = 20;
                    callback = isHost && (() => resetTurn(turns));
                    break;
                case GameState.END_ROUND:
                    timer = 10;
                    callback = isHost && (() => newRound(rounds, playersByScore));
                    break;
                default:
                    break;
            }

            if (timer > 0) {
                beginCountdown(timer, callback || null);
            }
        })();
    }, [endRound, updateRoom, turns, currentGameState, questions, wordMaster, firebase, doCountdown, 
        playerId, roomId, isHost, playersByScore, rounds, loading]);

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
                    word={wordMaster && playerId === wordMaster.id ? wordOfRound : null}
                />

                <Grid item xs={12}>
                    <h1>Bom Jogo, {playerName}</h1>
                </Grid>

                {countdown > 0 && <h1>{countdown}</h1>}

                {currentGameState === GameState.WORD_MASTER_CHOOSE_WORD && (
                    <WordMasterChooseWord
                        isWordMaster={playerId === wordMaster.id}
                        categories={categoriesToChoose}
                        onClickCategory={chooseCategory}
                        words={wordsToChoose}
                        onClickWord={chooseWord}
                    />
                )}

                {currentGameState ===
                    GameState.WORD_DETECTIVES_ASK_QUESTIONS && (
                    <WordDetectivesAskQuestions
                        isWordMaster={playerId === wordMaster.id}
                        sendQuestion={sendQuestionToWordMaster}
                        clues={clues}
                    />
                )}

                {currentGameState === GameState.WORD_MASTER_CHOOSE_QUESTION && (
                    <WordMasterChooseQuestions
                        isWordMaster={playerId === wordMaster.id}
                        questions={questions}
                        sendAnswer={sendAnswerOfWordMaster}
                    />
                )}

                {currentGameState === GameState.SHOW_QUESTION_CHOSE && questionAnswered && (
                    <ShowQuestionsChosed
                        isWordMaster={playerId === wordMaster.id}
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
                    <EndGame players={playersByScore} />
                )}
            </Grid>
        </div>
    );
}

export default withCountdown(withFirebase(Game));
