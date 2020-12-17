import React, { useState } from "react";
import Clues from '../components/Clues';
import { makeStyles, Button, Grid, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    word: {
        margin: 16,
    },
}));

function WordDetectivesAskQuestions(props) {
    const classes = useStyles();

    const [questionInput, setQuestionInput] = useState("");

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            setQuestionInput("");
            props.sendQuestion(questionInput);
        }
    };

    const onClickButton = () => {
        setQuestionInput("");
        props.sendQuestion(questionInput)
    };

    return (
        <>
            {props.isWordMaster && (
                <Grid item xs={12}>
                    <h3>Perguntas sendo feitas pelos Word Detectives, confira abaixo assim que forem feitas:</h3>
                    <ul>
                        {props.questions.map((q, index) => (
                            <div key={index}>
                                <li className={classes.question}>
                                    {q.question}
                                </li>
                            </div>
                        ))}
                    </ul>
                </Grid>
            )}

            {!props.isWordMaster && (
                <>
                {props.clues && (
                    <Grid item xs={12}>
                        <Clues clues={props.clues} />
                    </Grid>
                )}
                <Grid item xs={12}>
                    <TextField
                        id="standard-basic"
                        label="Qual sua pergunta para o Word Master?"
                        fullWidth
                        value={questionInput}
                        onChange={(event) =>
                            setQuestionInput(event.target.value)
                        }
                        onKeyDown={handleKeyDown}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.word}
                        onClick={onClickButton}
                    >
                        Enviar
                    </Button>
                </Grid>
                </>
            )}
        </>
    );
}

export default WordDetectivesAskQuestions;
