import React from "react";
import { makeStyles, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    question: {
        fontSize: 24,
    },
}));

function ShowQuestionsChosed(props) {
    const classes = useStyles();

    return (
        <Grid item xs={12}>
            <h3>Pergunta escolhida do Word Master:</h3>

            <ul>
                <li className={classes.question}>
                    {props.question}
                </li>
                <li className={classes.question}>
                    Resposta: <b>{props.answer}</b>
                </li>
            </ul>
        </Grid>
    );
}

export default ShowQuestionsChosed;
