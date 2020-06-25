import React, { useState, useEffect, useContext } from "react";
import { makeStyles, Button, Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { withFirebase } from "../firebase/context";
import SessionContext from "../context/Session";
import { ROOMS_COLLECTION, CATEGORIES_COLLECTION } from "../firebase/collections";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flex: 1,
    },
}));

function Game(props) {
    const classes = useStyles();

    const sessionContext = useContext(SessionContext);

    const [isWordMaster, setIsWordMaster] = useState(false);

    const [wordsToChoose, setWordsToChoose] = useState([]);

    const chooseWordsForWordMaster = async () => {
        const categories = await props.firebase.getCollection(CATEGORIES_COLLECTION);
        console.log(categories);
    };

    useEffect(() => {
        const unsubscribe = props.firebase
            .getCollection(ROOMS_COLLECTION)
            .onSnapshot((snapshot) => {
                snapshot.forEach((doc) => {
                    const room = doc.data();
                    if (room.word_master === sessionContext.state.playerName) {
                        setIsWordMaster(true);
                    } else {
                        setIsWordMaster(false);
                    }
                    
                    if (isWordMaster) {
                        chooseWordsForWordMaster();
                    }
                });
            });
        return () => {
            unsubscribe();
        };
    }, [props.firebase]);

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
                        {isWordMaster && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                            >
                                Começar!
                            </Button>
                        )}

                        {!isWordMaster && <h3>Aguardando Word Master escolher a palavra</h3>}
                    </Grid>
            </Grid>
        </div>
    );
}

export default withFirebase(Game);
