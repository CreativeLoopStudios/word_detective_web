import React, { useState } from "react";

import { Grid } from "@material-ui/core";

import { Message, Question } from "../types";

import { Label, ChatBox, ChatBoxQuestionItem, ChatBoxFooter, Button } from "../components";

type Props = {
    isWordMaster: boolean;
    questions: Array<Question>;
    sendAnswer: (index: number, answer: string, playerId: string) => void;
};

function WordMasterChooseQuestions({ isWordMaster, questions, sendAnswer }: Props) {
    function convertQuestionsToMessages() {
        return [
            { text: 'Escolha APENAS uma pergunta', isMine: false },
            ...questions.map((q: Question) => (
                {
                    text: q.question,
                    isMine: false
                }
            ))
        ]
    }

    function handleConfirmQuestion() {
        sendAnswer(0, "SIM", "sss");
    }

    return (
        <>
            {isWordMaster && (
                <Grid container item xs={12} spacing={2}>
                    <Grid item>
                        <Label>Escolha APENAS uma pergunta para responder SIM ou NÃO para os detetives tentarem adivinhar a palavra que você selecionou.</Label>
                    </Grid>

                    <Grid item>
                        <ChatBox
                            messages={convertQuestionsToMessages()}
                            renderItem={(message: Message) => (
                                <ChatBoxQuestionItem text={message.text} blueRight={message.isMine} />
                            )}>
                            <ChatBoxFooter>
                                <Button
                                    variant="contained"
                                    color="white"
                                    onClick={handleConfirmQuestion}
                                    width="100%"
                                    label="Confirmar"
                                />
                            </ChatBoxFooter>
                        </ChatBox>
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
