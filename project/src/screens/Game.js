import React, { useState, useEffect, useContext } from "react";
import { makeStyles, Button, Grid, Avatar, TextField } from "@material-ui/core";
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

    const [questionInput, setQuestionInput] = useState("");

    const { countdown, doCountdown } = props;

    useEffect(() => {
        let isCountdownStarted = false;

        const dealWordsForWordMaster = async () => {
            const categories = await props.firebase
                .getCollection(CATEGORIES_COLLECTION)
                .get();

            let wordsToChooseProto = [];
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
                wordsToChooseProto.push(word);
            }

            setWordsToChoose(wordsToChooseProto);
        };

        const unsubscribe = props.firebase
            .getCollection(ROOMS_COLLECTION)
            .onSnapshot((snapshot) => {
                snapshot.forEach((doc) => {
                    const room = doc.data();
                    const isHost =
                        room.host === sessionContext.state.playerName;

                    setCurrentGameState(room.state);
                    setWordMaster(room.word_master);
                    setWordDetectives(room.word_detectives);

                    if (room.word_master === sessionContext.state.playerName) {
                        setIsWordMaster(true);
                        if (room.state === GameState.WORD_MASTER_CHOOSE_WORD) {
                            dealWordsForWordMaster();
                        }
                    } else {
                        setIsWordMaster(false);
                    }

                    if (
                        room.state ===
                            GameState.WORD_DETECTIVES_ASK_QUESTIONS &&
                        !isCountdownStarted
                    ) {
                        const {
                            readTime,
                            writeTime,
                        } = sessionContext.state.heartbeatData;

                        // discount the readTime (time that the server takes to get an information to this client)
                        // add the writeTime if this is the host (time to write to firestore server) because the host
                        // will publish here instantly.
                        const countFrom =
                            20 - readTime + (isHost ? writeTime : 0);
                        console.log(`counting from ${countFrom}`);
                        doCountdown(countFrom, async () => {
                            await props.firebase.updateById(
                                ROOMS_COLLECTION,
                                "Dy9vm3vNjlIWKc84Ug78",
                                {
                                    state:
                                        GameState.WORD_MASTER_CHOOSE_QUESTION,
                                }
                            );

                            isCountdownStarted = false;
                        });

                        isCountdownStarted = true;
                    }
                });
            });
        return () => {
            unsubscribe();
        };
    }, [
        props.firebase,
        doCountdown,
        sessionContext.state.playerName,
        sessionContext.state.heartbeatData
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
        setQuestionInput("");
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

    const renderStateWordMasterChooseWord = () => {
        if (isWordMaster) {
            return (
                <Grid item xs={12}>
                    <h2>Escolha uma palavra para os detetives:</h2>

                    {wordsToChoose.map((word) => (
                        <Button
                            variant="contained"
                            color="primary"
                            key={word}
                            className={classes.word}
                            onClick={() => chooseWord(word)}
                        >
                            {word}
                        </Button>
                    ))}
                </Grid>
            );
        } else {
            return (
                <Grid item xs={12}>
                    <h3>Aguarde o Word Master escolher a palavra da rodada</h3>
                </Grid>
            );
        }
    };

    const renderStateWordDetectivesAskQuestions = () => {
        if (isWordMaster) {
            return (
                <Grid item xs={12}>
                    <h3>Aguarde os Word Detectives fazerem suas perguntas!</h3>
                </Grid>
            );
        } else {
            return (
                <Grid item xs={12}>
                    <TextField
                        id="standard-basic"
                        label="Qual sua pergunta para o Word Master?"
                        fullWidth
                        value={questionInput}
                        onChange={(event) =>
                            setQuestionInput(event.target.value)
                        }
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.word}
                        onClick={() => sendQuestionToWordMaster(questionInput)}
                    >
                        Enviar
                    </Button>
                </Grid>
            );
        }
    };

    const renderStateWordMasterChooseQuestion = () => {
        if (isWordMaster) {
            return (
                <Grid item xs={12}>
                    <h3>Escolha a pergunta e a sua resposta:</h3>
                </Grid>
            );
        } else {
            return (
                <Grid item xs={12}>
                    <h3>Perguntas enviadas ao Word Master:</h3>
                </Grid>
            );
        }
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={3} direction="row">
                {renderPlayersInfo()}

                <Grid item xs={12}>
                    <h1>Bom Jogo, {sessionContext.state.playerName}</h1>
                </Grid>

                {currentGameState === GameState.WORD_MASTER_CHOOSE_WORD &&
                    renderStateWordMasterChooseWord()}

                {currentGameState === GameState.WORD_DETECTIVES_ASK_QUESTIONS &&
                    countdown > 0 && <h1>{countdown}</h1>}

                {currentGameState === GameState.WORD_DETECTIVES_ASK_QUESTIONS &&
                    renderStateWordDetectivesAskQuestions()}

                {currentGameState === GameState.WORD_MASTER_CHOOSE_QUESTION &&
                    renderStateWordMasterChooseQuestion()}
            </Grid>
        </div>
    );
}

export default withCountdown(withFirebase(Game));
