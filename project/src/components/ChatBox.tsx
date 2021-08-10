import React from 'react';

import { Grid, makeStyles } from "@material-ui/core";

import PropTypes from 'prop-types';

import ChatBoxItem from './ChatBoxItem';

const useStyles = makeStyles(() => ({
    chatbox: {
        backgroundColor: '#5C5C5C',
        borderRadius: 30
    },
    scrollbox: {
        overflowY: 'auto',
        padding: '2rem 1rem'
    }
}));

export type Message = {
    text: string,
    isMine: boolean
}

export type Props = {
    messages: Array<Message>;
    children: React.ReactNode;
}

function ChatBox({ messages, children }: Props) {
    const classes = useStyles();
    
    return (
        <Grid container item className={classes.chatbox}>
            <Grid container item xs={12} className={classes.scrollbox} direction="column">
                {messages.map((message) => (
                    <ChatBoxItem text={message.text} blueRight={message.isMine} />
                ))}
            </Grid>

            {children}
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