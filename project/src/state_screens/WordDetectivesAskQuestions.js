import React, { useState } from "react";
import Clues from '../components/Clues';
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles, Button, Grid, TextField, InputAdornment } from "@material-ui/core";
import { useFocusOnRender } from "../hooks";

const useStyles = makeStyles((theme) => ({
    word: {
        margin: 16,
    },
    icon: {
        fontSize: 80
    }
}));

function WordDetectivesAskQuestions({ questions, sendQuestion, isWordMaster, clues }) {
    const classes = useStyles();

    const questionInputRef = useFocusOnRender(null)
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
            <Grid item xs={12}>
                <SearchIcon color="primary" className={classes.icon} />
            </Grid>

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
                        inputRef={questionInputRef}
                        label="Qual sua pergunta para o Word Master?"
                        placeholder="Escreva a pergunta de sim/não para o Word Master..."
                        InputProps={{
                            endAdornment: <InputAdornment position="start">?</InputAdornment>
                        }}
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
