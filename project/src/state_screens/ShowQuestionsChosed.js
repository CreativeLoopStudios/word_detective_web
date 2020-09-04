import React, { useState } from "react";
import { makeStyles, Grid, TextField, Button } from "@material-ui/core";
import Clues from '../components/Clues';

const useStyles = makeStyles((theme) => ({
    question: {
        fontSize: 24,
    },
}));

function ShowQuestionsChosed(props) {
    const classes = useStyles();

    const [hunchInput, setHunchInput] = useState("");

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            setHunchInput("");
            props.sendHunchToDiscoverWord(hunchInput);
        }
    };

    const onClickButton = () => {
        setHunchInput("");
        props.sendHunchToDiscoverWord(hunchInput)
    };

    return (
        <Grid item xs={12}>
            <h3>Pergunta escolhida do Word Master:</h3>

            {
                (props.question && props.answer) ? (
                <ul>
                    <li className={classes.question}>{props.question}</li>
                    <li className={classes.question}>
                        Resposta: <b>{props.answer}</b>
                    </li>
                </ul>
                ) : (
                    <ul>
                        <li className={classes.question}>Nenhum das perguntas foi selecionada.</li>
                    </ul>
                )
            }

            {props.clues && (
                <Clues clues={props.clues} />
            )}

            {props.isWordMaster && (
                <h3>Aguardando palpites dos Word Detectives</h3>
            )}

            {!props.isWordMaster && (
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
