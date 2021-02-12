import React, { useState } from "react";
import Clues from '../components/Clues';
import { makeStyles, Button, Grid, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    word: {
        margin: 16,
    },
}));

function WordDetectivesAskQuestions({ questions, sendQuestion, isWordMaster, clues }) {
    const classes = useStyles();

    const [questionInput, setQuestionInput] = useState("");
    const [isQuestionAlreadyAsked, setQuestionAlreadyAsked] = useState(false);

    const normalizeText = (text) => {
        return text.toLowerCase()
                   .normalize("NFD") // remove accents
                   .replace(/[^\w]+/g, ""); // remove everything that is not alphanumeric, like punctuation.
    };

    const handleQuestionSend = (text) => {
        const normalizedQuestions = questions.map(q => normalizeText(q.question));
        const normalizedText = normalizeText(text);
        const isAlreadyAsked = normalizedQuestions.includes(normalizedText);

        if (!isAlreadyAsked) {
            setQuestionInput("");
            sendQuestion(text);
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
            {isWordMaster && (
                <Grid item xs={12}>
                    <h3>Perguntas sendo feitas pelos Word Detectives, confira abaixo assim que forem feitas:</h3>
                    <ul>
                        {questions.map((q, index) => (
                            <div key={index}>
                                <li className={classes.question}>
                                    {q.question}
                                </li>
                            </div>
                        ))}
                    </ul>
                </Grid>
            )}

            {!isWordMaster && (
                <>
                {clues && (
                    <Grid item xs={12}>
                        <Clues clues={clues} />
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
