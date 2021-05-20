import React from "react";

import { Grid } from "@material-ui/core";

import { Question } from "../types";

import { Label, QuestionsBox } from "../components";

type Props = {
    isWordMaster: boolean;
    questions: Array<Question>;
    sendAnswer: (index: number, answer: string, playerId: string) => void;
};

function WordMasterChooseQuestions({ isWordMaster, questions, sendAnswer }: Props) {
    return (
        <>
            {isWordMaster && (
                <Grid container item xs={12} spacing={2}>
                    <Grid item>
                        <Label>Aguarde os detetives terminarem de fazer as perguntas, depois escolha uma delas e responda sim ou não para eles tentarem adivinhar a palavra que você selecionou.</Label>
                    </Grid>

                    <Grid item>
                        <Label kind="secondary" size="h5" bold>Escolha uma pergunta</Label>
                    </Grid>

                    <Grid item>
                        <QuestionsBox
                            questions={questions}
                            onClickAffirmative={(question: Question, index: number) => sendAnswer(index, "SIM", question.player)}
                            onClickNegative={(question: Question, index: number) => sendAnswer(index, "NÃO", question.player)}
                        />
                    </Grid>
                </Grid>
            )}

            {!isWordMaster && (
                <Grid container item xs={12} spacing={2}>
                    <Grid item>
                        <Label kind="secondary">Abaixo, estão as perguntas enviadas ao Word Master</Label>
                    </Grid>

                    <Grid item>
                        {questions.map((q, index) => (
                            <Label key={index} size="h5">{q.question}</Label>
                        ))}
                    </Grid>
                </Grid>
            )}
        </>
    );
}

export default WordMasterChooseQuestions;
