import React from "react";
import { makeStyles, Button, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    word: {
        margin: 16,
    },
}));

function WordMasterChooseWord(props) {
    const classes = useStyles();

    return (
        <>
            {props.isWordMaster && (
                <Grid item xs={12}>
                    <h2>Escolha uma palavra para os detetives:</h2>

                    {props.words.map((word) => (
                        <Button
                            variant="contained"
                            color="primary"
                            key={word}
                            className={classes.word}
                            onClick={() => props.onClickWord(word)}
                        >
                            {word}
                        </Button>
                    ))}
                </Grid>
            )}

            {!props.isWordMaster && (
                <Grid item xs={12}>
                    <h3>Aguarde o Word Master escolher a palavra da rodada</h3>
                </Grid>
            )}
        </>
    );
}

export default WordMasterChooseWord;
