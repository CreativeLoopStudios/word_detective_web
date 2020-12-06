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
                    {
                        props.categories.length > 0 && props.words.length === 0 && (
                            <>
                                <h2>Escolha uma categoria:</h2>

                                <div>
                                    {props.categories.map((category) => (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            key={category.id}
                                            className={classes.word}
                                            onClick={() => props.onClickCategory(category)}
                                        >
                                            {category.name}
                                        </Button>
                                    ))}
                                </div>
                            </>
                        )
                    }

                    {
                        props.categories.length > 0 && props.words.length > 0 && (
                            <>
                                <h2>Escolha uma palavra para os detetives:</h2>

                                <div>
                                    {props.words.map((word, idx) => (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            key={idx}
                                            className={classes.word}
                                            onClick={() => props.onClickWord(word)}
                                        >
                                            {word}
                                        </Button>
                                    ))}
                                </div>
                            </>
                        )
                    }
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
