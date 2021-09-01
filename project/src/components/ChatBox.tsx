import React, { useRef, useEffect } from 'react';

import { Grid, makeStyles } from "@material-ui/core";

import PropTypes from 'prop-types';

import { Message } from '../types';

const useStyles = makeStyles(() => ({
    chatbox: {
        backgroundColor: '#5C5C5C',
        borderRadius: 30,
        minHeight: '15rem'
    },
    scrollbox: {
        overflowY: 'auto',
        height: '20rem',
        padding: '2rem 2rem'
    },
    content: {
        alignSelf: 'flex-end'
    }
}));

export type Props = {
    messages: Array<Message>;
    renderItem: (message: Message) => React.ReactNode;
    children: React.ReactNode;
}

function ChatBox({ messages, renderItem, children }: Props) {
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
                {messages.map((message) => renderItem(message))}
                <div ref={messagesEndRef}></div>
            </Grid>

            <Grid item xs={12} className={classes.content}>
                {children}
            </Grid>
        </Grid>
    );
}

ChatBox.propTypes = {
    messages: PropTypes.array,
    renderItem: PropTypes.func
};

ChatBox.defaultProps = {
    messages: [],
    renderItem: undefined
};

export default ChatBox;