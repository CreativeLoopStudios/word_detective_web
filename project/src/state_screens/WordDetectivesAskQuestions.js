import React, { useState } from "react";
import Clues from '../components/Clues';
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles, Button, Grid, TextField, InputAdornment } from "@material-ui/core";
import { useFocusOnRender } from "../hooks";
import { Input, Label } from "../components";

const useStyles = makeStyles((theme) => ({
    word: {
        margin: 16,
    },
    icon: {
        fontSize: 80
    },
    input: {
        '& input[type=text]': {
            textAlign: 'left',
            paddingLeft: '1rem'
        },
        '& label': {
            fontSize: '1.7rem',
            fontWeight: 'bold'
        },
        '& #label__div': {
            textAlign: 'left'
        }
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

    const handleKeyDown = (key) => {
        if (key === "Enter") {
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
                <Grid item container spacing={2}>
                    <Grid item>
                        <Label>Faça abaixo perguntas para tentar descobrir qual é a palavra escolhida pelo Word master. Depois de escolhida a melhor pergunta, você pode dar quantos paplites quiser.</Label>
                    </Grid>

                    <Grid item>
                        <Label inline kind="secondary" size="h5" bold>Pistas:</Label>
                    </Grid>

                    {clues && (
                        <Grid item xs={12}>
                            <Clues clues={clues} />
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <Input
                            className={classes.input}
                            inputRef={questionInputRef}
                            label="Faça as perguntas"
                            placeholder="Escreva a sua pergunta para o Word Master"
                            type="text"
                            value={questionInput}
                            onChange={(text) => setQuestionInput(text)}
                            onKeyDown={(key) => handleKeyDown(key)}
                            helperText={isQuestionAlreadyAsked && "Pergunta já feita!"}
                            error={isQuestionAlreadyAsked}
                        />
                    </Grid>
                </Grid>
            )}
        </>
    );
}

export default WordDetectivesAskQuestions;
