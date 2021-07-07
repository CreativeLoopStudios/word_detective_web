import React, { useState } from "react";

import { makeStyles, Grid } from "@material-ui/core";

import { useFocusOnRender, useInactivity } from "../hooks";

import { AlertBox, Button, Clues, Input, Label } from '../components';

import { Clue, Hunch } from "../types";

const useStyles = makeStyles((theme) => ({
    question: {
        fontSize: 24,
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

type Props = {
    question: string;
    answer: string;
    clues: Array<Clue>;
    isWordMaster: boolean;
    hunches: Array<Hunch>;
    sendHunchToDiscoverWord: (hunch: string) => boolean;
};

function ShowQuestionsChosed({ question, answer, clues, isWordMaster, hunches, sendHunchToDiscoverWord }: Props) {
    const classes = useStyles();

    const hunchInputRef = useFocusOnRender(null)
    const [hunchInput, setHunchInput] = useState("");
    const [error, setError] = useState(false);
    const { stop: cancelInactivity, inactive: isUserInactive } = useInactivity({ timeout: 5000 });

    function handleKeyDown(key: string) {
        if (key === "Enter") {
            setHunchInput("");
            const error = sendHunchToDiscoverWord(hunchInput);
            setError(error);
        }
    };

    return (
        <Grid container item xs={12} spacing={2}>
            <Grid item xs={12}>
                {
                    isWordMaster ? (
                        <Label>Pergunta respondida por você</Label>
                    ) : (
                        <Label>Pergunta respondida pelo Word Master</Label>
                    )
                }
            </Grid>
            <Grid item xs={12}>
                {
                    question && answer ? (
                    <>
                        <Label kind="secondary" size="h5" inline>{question}</Label>
                        <Button label={answer} backgroundColor={answer === 'SIM' ? '#575475' : '#FF0D0D'} size="small" onClick={() => null} />
                    </>
                    ) : (
                        <Label kind="secondary" size="h5">Nenhuma das perguntas foi selecionada... :(</Label>
                    )
                }
            </Grid>

            {
                clues &&
                <Grid item xs={12}>
                    <Label>Pistas de outros turnos</Label>
                    <Clues clues={clues} />
                </Grid>
            }

            {
                isWordMaster && hunches && hunches.length === 0 &&
                <Grid item xs={12}>
                    <Label kind="secondary" size="h5">Aguardando palpites dos Word Detectives</Label>
                </Grid>
            }

            {
                isWordMaster && hunches && hunches.length > 0 &&
                <Grid item xs={12}>
                    <Label kind="secondary" size="h5">Palpites dos Word Detectives</Label>
                    
                    {hunches.map((hunch, i) => (
                        <Label key={i}>- {hunch.text}</Label>
                    ))}
                </Grid>
            }

            {!isWordMaster && (
                <>
                    {isUserInactive && (
                        <Grid item xs={12}>
                            <AlertBox label="Não deixe de fazer palpites e tentar acertar a palavra!" />
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Input
                            className={classes.input}
                            inputRef={hunchInputRef}
                            label="Faça quantos palpites quiser da palavra"
                            placeholder="Escreva seu palpite"
                            type="text"
                            value={hunchInput}
                            onChange={text => {
                                cancelInactivity(); 
                                setHunchInput(text)
                            }}
                            onKeyDown={key => {
                                cancelInactivity();
                                handleKeyDown(key);
                            }}
                            helperText={error ? 'Palpite incorreto' : ''}
                            error={error}
                        />
                    </Grid>
                </>
            )}
        </Grid>
    );
}

export default ShowQuestionsChosed;
