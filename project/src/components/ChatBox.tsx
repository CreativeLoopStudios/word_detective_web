import React, { useRef, useEffect } from 'react';

import { Grid, makeStyles } from "@material-ui/core";

import PropTypes from 'prop-types';

import ChatBoxItem from './ChatBoxItem';

import { Message } from '../types';

const useStyles = makeStyles(() => ({
    chatbox: {
        backgroundColor: '#5C5C5C',
        borderRadius: 30,
        minHeight: '20rem'
    },
    scrollbox: {
        overflowY: 'auto',
        height: '30rem',
        padding: '1rem 1rem'
    },
    content: {
        alignSelf: 'flex-end'
    }
}));

export type Props = {
    messages: Array<Message>;
    children: React.ReactNode;
}

function ChatBox({ messages, children }: Props) {
    const classes = useStyles();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages])

    return (
        <Grid container item className={classes.chatbox}>
            <Grid item xs={12} className={classes.scrollbox}>
                {messages.map((message) => (
                    <ChatBoxItem text={message.text} blueRight={message.isMine} />
                ))}
                <div ref={messagesEndRef}></div>
            </Grid>

            <Grid item xs={12} className={classes.content}>
                {children}
            </Grid>
        </Grid>
    );
}

ChatBox.propTypes = {
    messages: PropTypes.array
};

ChatBox.defaultProps = {
    messages: []
};

export default ChatBox;