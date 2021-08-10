import React from 'react';

import { Grid, GridJustification, makeStyles } from "@material-ui/core";

import PropTypes from 'prop-types';

import Label from './Label';

const useStyles = makeStyles(() => ({
    messageContainer: {
        marginTop: '1rem'
    },
    message: {
        padding: '0.5rem 0.8rem',
        borderRadius: 30,
        position: 'relative',
        minWidth: '5rem'
    },
    backgroundLeft: {
        backgroundColor: 'white'
    },
    backgroundRight: {
        backgroundColor: '#35C1FF'
    },
    arrowDown: {
        width: 0,
        height: 0,
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        position: 'absolute',
        bottom: '-0.5rem',
    },
    arrowLeft: {
        borderTop: '10px solid white',
        left: '1rem'
    },
    arrowRight: {
        borderTop: '10px solid #35C1FF',
        right: '1rem'
    },
}));

export type Props = {
    blueRight: boolean;
    text: string;
}

function ChatBoxItem({ blueRight, text }: Props) {
    const classes = useStyles();

    var customMessageClass: string = classes.backgroundLeft;
    var customArrowClass: string = classes.arrowLeft;
    var kind: 'primary' | 'secondary' = 'primary';
    var justify: GridJustification = 'flex-start';

    if (blueRight) {
        customMessageClass = classes.backgroundRight;
        customArrowClass = classes.arrowRight;
        kind = 'secondary';
        justify = 'flex-end';
    }

    return (
        <Grid container item justify={justify} className={classes.messageContainer}>
            <Grid item className={`${classes.message} ${customMessageClass}`}>
                <Label kind={kind} bold size="subtitle1">{text}</Label>

                <div className={`${classes.arrowDown} ${customArrowClass}`}></div>
            </Grid>
        </Grid>
    );
}

ChatBoxItem.propTypes = {
    blueRight: PropTypes.bool,
    text: PropTypes.string
};

ChatBoxItem.defaultProps = {
    blueRight: false,
    text: ''
};

export default ChatBoxItem;