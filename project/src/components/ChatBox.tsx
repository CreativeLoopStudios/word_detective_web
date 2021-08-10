import React from 'react';

import { Grid, GridItemsAlignment, GridJustification, makeStyles } from "@material-ui/core";

import PropTypes from 'prop-types';

import Label from './Label';

const useStyles = makeStyles(() => ({
    chatbox: {
        backgroundColor: '#5C5C5C',
        borderRadius: 30
    },
    scrollbox: {
        overflowY: 'auto',
        padding: '2rem 1rem'
    },
    messageContainer: {
        marginTop: '1rem'
    },
    message: {
        padding: '0.5rem 0.8rem',
        borderRadius: 30,
        position: 'relative'
    },
    messageIsMine: {
        backgroundColor: '#35C1FF'
    },
    messageNotMine: {
        backgroundColor: 'white'
    },
    arrowDown: {
        width: 0,
        height: 0,
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        position: 'absolute',
        bottom: '-0.5rem',
    },
    arrowIsMine: {
        borderTop: '10px solid #35C1FF',
        right: '1.5rem'
    },
    arrowNotMine: {
        borderTop: '10px solid white',
        left: '1.5rem'
    }
}));

export type Message = {
    text: string,
    isMine: boolean
}

export type Props = {
    messages: Array<Message>;
    onKeyDown?: (key: string) => void;
}

function ChatBox({ messages, onKeyDown }: Props) {
    const classes = useStyles();
    
    return (
        <Grid container item className={classes.chatbox}>
            <Grid container item xs={12} className={classes.scrollbox} direction="column">
                {messages.map((message) => {
                    var customMessageClass: string = classes.messageNotMine;
                    var customArrowClass: string = classes.arrowNotMine;
                    var kind: 'primary' | 'secondary' = 'primary';
                    var justify: GridJustification = 'flex-start';

                    if (message.isMine) {
                        customMessageClass = classes.messageIsMine;
                        customArrowClass = classes.arrowIsMine;
                        kind = 'secondary';
                        justify = 'flex-end';
                    }

                    return (
                        <Grid container item justify={justify} className={classes.messageContainer}>
                            <Grid item className={`${classes.message} ${customMessageClass}`}>
                                <Label kind={kind} bold size="subtitle1">{message.text}</Label>

                                <div className={`${classes.arrowDown} ${customArrowClass}`}></div>
                            </Grid>
                        </Grid>
                    );
                })}
            </Grid>

            <Grid item xs={12}>
                
            </Grid>
        </Grid>
    );
}

ChatBox.propTypes = {
    messages: PropTypes.array,
    onKeyDown: PropTypes.func
};

ChatBox.defaultProps = {
    messages: [],
    onKeyDown: undefined
};

export default ChatBox;