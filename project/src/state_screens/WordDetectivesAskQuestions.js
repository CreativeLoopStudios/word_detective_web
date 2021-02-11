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
    const [isQuestionAlreadyAsked, setQuestionAlreadyAsked] = useState(false);

    const normalizeText = (text) => {
        return text.toLowerCase()
                   .normalize("NFD") // remove accents
                   .replace(/[^\w]+/g, ""); // remove everything that is not alphanumeric, like punctuation.
    };

    const handleQuestionSend = (text) => {
        const normalizedQuestions = props.questions.map(q => normalizeText(q.question));
        const normalizedText = normalizeText(text);
        const isAlreadyAsked = normalizedQuestions.includes(normalizedText);

        if (!isAlreadyAsked) {
            setQuestionInput("");
            props.sendQuestion(text);
        }
        setQuestionAlreadyAsked(isAlreadyAsked);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleQuestionSend(questionInput);
        }
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
                        helperText={isQuestionAlreadyAsked && "Pergunta já feita!"}
                        error={isQuestionAlreadyAsked}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.word}
                        onClick={() => handleQuestionSend(questionInput)}
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
