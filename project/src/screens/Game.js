import React, { useState, useEffect, useContext } from "react";
import { makeStyles, Button, Grid, Avatar } from "@material-ui/core";
import { withFirebase } from "../firebase/context";
import SessionContext from "../context/Session";
import {
    ROOMS_COLLECTION,
    CATEGORIES_COLLECTION,
} from "../firebase/collections";
import { Math } from "../utils";
import GameState from "../state_of_play";

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
        flexDirection: 'row'
    }
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

    useEffect(() => {
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
                });
            });
        return () => {
            unsubscribe();
        };
    }, [props.firebase, sessionContext.state.playerName]);

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
                        <Avatar>{detective.substring(0, 2)}</Avatar>
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
                    <h3>Aguardando Word Master escolher a palavra</h3>
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
            </Grid>
        </div>
    );
}

export default withFirebase(Game);
