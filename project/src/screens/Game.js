import React, { useState, useEffect, useContext } from "react";
import { makeStyles, Grid, Avatar } from "@material-ui/core";
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
} from "../state_screens";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flex: 1,
    },
    word: {
        margin: 16,
    },
    avatarContainer: {
        display: "flex",
        flexDirection: "row",
    },
    question: {
        fontSize: 24,
    },
}));

function Game(props) {
    const WORDS_TO_CHOOSE = 5;

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

        const resetTurn = async (isHost) => {
            if (!isHost) return;
            await props.firebase.updateById(
                ROOMS_COLLECTION,
                "Dy9vm3vNjlIWKc84Ug78",
                {
                    state: GameState.WORD_DETECTIVES_ASK_QUESTIONS,
                    question_answered: null,
                    questions: [],
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
    
            const newWordMaster = room.players[newRound];
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
                            beginCountdown(10, isHost, () => resetTurn(isHost));
                            break;
                        case GameState.END_ROUND:
                            setWordOfRound(room.word_of_the_round);
                            beginCountdown(10, isHost, () =>
                                newRound(isHost, room)
                            );
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

    const sendAnswerOfWordMaster = async (questionIndex, answer) => {
        await props.firebase.updateById(
            ROOMS_COLLECTION,
            "Dy9vm3vNjlIWKc84Ug78",
            {
                question_answered: {
                    index: questionIndex,
                    answer: answer,
                },
                state: GameState.SHOW_QUESTION_CHOSE,
            }
        );
    };

    const endRound = async () => {
        await props.firebase.updateById(
            ROOMS_COLLECTION,
            "Dy9vm3vNjlIWKc84Ug78",
            {
                state: GameState.END_ROUND,
            }
        );
    };

    const renderPlayersInfo = () => {
        return (
            <>
                <Grid item xs={2}>
                    <h2>Word Master</h2>
                    <Avatar style={{ backgroundColor: "green" }}>
                        {wordMaster.substring(0, 2)}
                    </Avatar>
                </Grid>
                <Grid item xs={10}>
                    <h2>Word Detectives</h2>
                    <div className={classes.avatarContainer}>
                        {wordDetectives.map((detective) => (
                            <Avatar key={detective}>
                                {detective.substring(0, 2)}
                            </Avatar>
                        ))}
                    </div>
                </Grid>
            </>
        );
    };

    const renderStateShowQuestionChose = () => {
        return (
            <Grid item xs={12}>
                <h3>Pergunta escolhida do Word Master:</h3>

                <ul>
                    <li className={classes.question}>
                        {questions[questionAnswered.index]
                            ? questions[questionAnswered.index].question
                            : "error"}
                    </li>
                    <li className={classes.question}>
                        Resposta: <b>{questionAnswered.answer}</b>
                    </li>
                </ul>
            </Grid>
        );
    };

    const renderStateEndRound = () => {
        return (
            <Grid item xs={12}>
                <h3>Palavra foi descoberta! Parabéns!</h3>

                <p>
                    A palavra é <b>{wordOfRound}</b>!
                </p>

                <p>Começando novo round...</p>
            </Grid>
        );
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={3} direction="row">
                {renderPlayersInfo()}

                <Grid item xs={12}>
                    <h1>Bom Jogo, {sessionContext.state.playerName}</h1>
                </Grid>

                {currentGameState === GameState.WORD_MASTER_CHOOSE_WORD && (
                    <WordMasterChooseWord
                        isWordMaster={isWordMaster}
                        words={wordsToChoose}
                        onClickWord={chooseWord}
                    />
                )}

                {countdown > 0 && <h1>{countdown}</h1>}

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
                        endRound={endRound}
                    />
                )}

                {currentGameState === GameState.SHOW_QUESTION_CHOSE &&
                    renderStateShowQuestionChose()}

                {currentGameState === GameState.END_ROUND &&
                    renderStateEndRound()}
            </Grid>
        </div>
    );
}

export default withCountdown(withFirebase(Game));
