import React, { useState } from "react";
import { makeStyles, Grid, TextField, Button } from "@material-ui/core";
import LocationSearchingIcon from "@material-ui/icons/LocationSearching";
import Clues from '../components/Clues';

const useStyles = makeStyles((theme) => ({
    question: {
        fontSize: 24,
    },
    icon: {
        fontSize: 80
    }
}));

function ShowQuestionsChosed({ question, answer, clues, isWordMaster, hunches, sendHunchToDiscoverWord }) {
    const classes = useStyles();

    const [hunchInput, setHunchInput] = useState("");
    const [error, setError] = useState(false);

    const handleKeyDown = async (event) => {
        if (event.key === "Enter") {
            setHunchInput("");
            const error = await sendHunchToDiscoverWord(hunchInput);
            setError(error);
        }
    };

    const onClickButton = async () => {
        setHunchInput("");
        const error = await sendHunchToDiscoverWord(hunchInput)
        setError(error);
    };

    return (
        <Grid item xs={12}>
            <h3>Pergunta escolhida do Word Master:</h3>

            {
                question && answer ? (
                <ul>
                    <li className={classes.question}>{question}</li>
                    <li className={classes.question}>
                        Resposta: <b>{answer}</b>
                    </li>
                </ul>
                ) : (
                    <ul>
                        <li className={classes.question}>Nenhum das perguntas foi selecionada.</li>
                    </ul>
                )
            }

            {clues && (
                <Clues clues={clues} />
            )}

            <Grid item xs={12}>
                <LocationSearchingIcon color="primary" className={classes.icon} />
            </Grid>

            {isWordMaster && hunches && hunches.length === 0 && (
                <h3>Aguardando palpites dos Word Detectives</h3>
            )}

            {isWordMaster && hunches && hunches.length > 0 && (
                <div>
                    <h3>Palpites</h3>
                    <ul>
                        {hunches.map((hunch, i) => (
                            <li key={i}>{hunch.text}</li>
                        ))}
                    </ul>
                </div>
            )}

            {!isWordMaster && (
                <>
                    <h3>Dê o seu palpite da palavra:</h3>

                    <Grid item xs={12}>
                        <TextField
                            id="standard-basic"
                            label="Escreva seu palpite"
                            fullWidth
                            value={hunchInput}
                            onChange={(event) =>
                                setHunchInput(event.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            error={error}
                            helperText={error ? 'Palpite incorreto' : ''}
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
        </Grid>
    );
}

export default ShowQuestionsChosed;
