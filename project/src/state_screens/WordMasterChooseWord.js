import React from "react";
import { makeStyles, Button, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    word: {
        margin: 16,
    },
}));

function WordMasterChooseWord({ isWordMaster, categories, words, onClickCategory, onClickWord }) {
    const classes = useStyles();

    return (
        <>
            {isWordMaster && (
                <Grid item xs={12}>
                    {
                        categories.length > 0 && words.length === 0 && (
                            <>
                                <h2>Escolha uma categoria:</h2>

                                <div>
                                    {categories.map((category) => (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            key={category.id}
                                            className={classes.word}
                                            onClick={() => onClickCategory(category)}
                                        >
                                            {category.name}
                                        </Button>
                                    ))}
                                </div>
                            </>
                        )
                    }

                    {
                        categories.length > 0 && words.length > 0 && (
                            <>
                                <h2>Escolha uma palavra para os detetives:</h2>

                                <div>
                                    {words.map((word, idx) => (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            key={idx}
                                            className={classes.word}
                                            onClick={() => onClickWord(word)}
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

            {!isWordMaster && (
                <Grid item xs={12}>
                    <h3>Aguarde o Word Master escolher a palavra da rodada</h3>
                </Grid>
            )}
        </>
    );
}

export default WordMasterChooseWord;
