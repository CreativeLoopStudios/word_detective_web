import React, { useState, useEffect, useContext } from "react";
import { makeStyles, Button, Grid } from "@material-ui/core";
import { withFirebase } from "../firebase/context";
import SessionContext from "../context/Session";
import {
    ROOMS_COLLECTION,
    CATEGORIES_COLLECTION,
} from "../firebase/collections";
import { Math } from "../utils";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flex: 1,
    },
    word: {
        margin: 16
    }
}));

function Game(props) {
    const WORDS_TO_CHOOSE = 5;

    const classes = useStyles();

    const sessionContext = useContext(SessionContext);

    const [isWordMaster, setIsWordMaster] = useState(false);

    const [wordsToChoose, setWordsToChoose] = useState([]);

    useEffect(() => {
        const chooseWordsForWordMaster = async () => {
            const categories = await props.firebase
                .getCollection(CATEGORIES_COLLECTION)
                .get();
    
            let wordsToChooseProto = [];
            for (let i = 0; i < WORDS_TO_CHOOSE; i++) {
                const randomCategory = Math.randomInt(0, categories.size);
                const categoryToChooseWord = categories.docs[randomCategory].data();
    
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
                    
                    if (room.word_master === sessionContext.state.playerName) {
                        setIsWordMaster(true);
                        chooseWordsForWordMaster();
                    } else {
                        setIsWordMaster(false);
                    }
                });
            });
        return () => {
            unsubscribe();
        };
    }, [props.firebase, sessionContext.state.playerName]);

    return (
        <div className={classes.root}>
            <Grid container spacing={3} direction="row">
                <Grid item xs={12}>
                    <h1>Bom Jogo, {sessionContext.state.playerName}</h1>
                </Grid>

                <Grid item xs={12}>
                    <h2>Escolha uma palavra para os detetives:</h2>
                </Grid>

                <Grid item xs={12}>
                    {isWordMaster &&
                        wordsToChoose.map((word) => (
                            <Button
                                variant="contained"
                                color="primary"
                                key={word}
                                className={classes.word}
                            >
                                {word}
                            </Button>
                        ))}

                    {!isWordMaster && (
                        <h3>Aguardando Word Master escolher a palavra</h3>
                    )}
                </Grid>
            </Grid>
        </div>
    );
}

export default withFirebase(Game);
