import React, { useState } from "react";

import { makeStyles, Grid } from "@material-ui/core";

import { useFocusOnRender, useInactivity } from "../hooks";

import { Input, Label, Clues, QuestionsBox, AlertBox, ChatBox, ChatBoxFooter } from "../components";

import { Clue, Message, Question } from '../types';

const useStyles = makeStyles((theme) => ({
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
    questions: Array<Question>;
    sendQuestion: (text: string) => void;
    isWordMaster: boolean;
    clues: Array<Clue>;
};

function WordDetectivesAskQuestions({ questions, sendQuestion, isWordMaster, clues }: Props) {
    const classes = useStyles();

    const questionInputRef = useFocusOnRender(null)
    const [questionInput, setQuestionInput] = useState("");
    const [messages, setMessages] = useState<Array<Message>>([
        { text: 'Me faça as suas perguntas', isMine: false }
    ]);
    const [isQuestionAlreadyAsked, setQuestionAlreadyAsked] = useState(false);
    const { stop: cancelInactivity, inactive: isUserInactive } = useInactivity({ timeout: 5000 });

    function normalizeText(text: string) {
        return text.toLowerCase()
                   .normalize("NFD") // remove accents
                   .replace(/[^\w]+/g, ""); // remove everything that is not alphanumeric, like punctuation.
    }

    function handleQuestionSend(text: string) {
        const normalizedQuestions = questions.map(q => normalizeText(q.question));
        const normalizedText = normalizeText(text);
        const isAlreadyAsked = normalizedQuestions.includes(normalizedText);

        if (!isAlreadyAsked) {
            appendMessages(questionInput);
            sendQuestion(text);
        }
        setQuestionAlreadyAsked(isAlreadyAsked);
        setQuestionInput("");
    }

    function handleKeyDown(key: string) {
        if (key === "Enter") {
            handleQuestionSend(questionInput);
        }
    }

    function appendMessages(messageText: string) {
        let message: Message = {
            text: messageText,
            isMine: true
        };
        setMessages(oldMessages => [ ...oldMessages, message ]);
    }

    return (
        <>
            {isWordMaster && (
                <Grid container item spacing={2}>
                    <Grid item>
                        <Label>Aproveite para ler as perguntas na medida que forem sendo enviadas, a próxima fase você irá respondê-las!</Label>
                    </Grid>

                    <Grid item>
                        <QuestionsBox
                            questions={questions}
                            buttonsDisabled
                        />
                    </Grid>
                </Grid>
            )}

            {!isWordMaster && (
                <Grid item container spacing={2}>
                    <Grid item>
                        <Label inline kind="secondary" size="h5" bold>Pistas de outros turnos</Label>
                    </Grid>

                    {clues && (
                        <Grid item xs={12}>
                            <Clues clues={clues} />
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <ChatBox messages={messages}>
                            <ChatBoxFooter>
                                <Input
                                    className={classes.input}
                                    inputRef={questionInputRef}
                                    placeholder="Escreva a sua pergunta para o Word Master"
                                    type="text"
                                    value={questionInput}
                                    onChange={text => {
                                        cancelInactivity();
                                        setQuestionInput(text);
                                    }}
                                    onKeyDown={key => {
                                        cancelInactivity();
                                        handleKeyDown(key);
                                    }}
                                    helperText={isQuestionAlreadyAsked ? "Pergunta já feita!" : ""}
                                    error={isQuestionAlreadyAsked}
                                />
                            </ChatBoxFooter>
                        </ChatBox>
                    </Grid>

                    {isUserInactive && (
                        <Grid item xs={12}>
                            <AlertBox label="Não pare de fazer perguntas! Você pode fazer quantas quiser!" />
                        </Grid>
                    )}
                </Grid>
            )}
        </>
    );
}

export default WordDetectivesAskQuestions;
