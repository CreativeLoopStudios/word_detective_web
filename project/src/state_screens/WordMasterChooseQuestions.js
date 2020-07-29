import React from "react";
import { makeStyles, Button, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    successButton: {
        backgroundColor: "green",
        color: "white",
    },
    question: {
        fontSize: 24,
    },
}));

function WordMasterChooseQuestions(props) {
    const classes = useStyles();

    return (
        <>
            {props.isWordMaster && (
                <Grid item xs={12}>
                    <h3>Escolha a pergunta e a sua resposta:</h3>

                    <ul>
                        {props.questions.map((q, index) => (
                            <div key={index}>
                                <li className={classes.question}>
                                    {q.question}
                                </li>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() =>
                                        props.sendAnswer(index, "SIM")
                                    }
                                >
                                    SIM
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() =>
                                        props.sendAnswer(index, "NÃO")
                                    }
                                >
                                    NÃO
                                </Button>
                            </div>
                        ))}
                    </ul>
                </Grid>
            )}

            {!props.isWordMaster && (
                <Grid item xs={12}>
                    <h3>Perguntas enviadas ao Word Master:</h3>

                    <ul>
                        {props.questions.map((q, index) => (
                            <li key={index} className={classes.question}>
                                {q.question}
                            </li>
                        ))}
                    </ul>
                </Grid>
            )}
        </>
    );
}

export default WordMasterChooseQuestions;
