import React from 'react';

import { Grid, IconButton, makeStyles } from "@material-ui/core";
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@material-ui/icons';

import PropTypes from 'prop-types';

import Button from './Button';
import Label from './Label';

const useStyles = makeStyles(() => ({
    messageContainer: {
        marginTop: '1rem'
    },
    message: {
        padding: '0.5rem 0.8rem',
        borderRadius: 30,
        position: 'relative',
        minWidth: '5rem',
        backgroundColor: 'white'
    },
    arrowDown: {
        width: 0,
        height: 0,
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        position: 'absolute',
        bottom: '-0.5rem',
        borderTop: '10px solid white',
        left: '1.5rem'
    },
    icon: {
        borderRadius: 100,
        backgroundColor: 'white',
        color: '#34C1FF'
    }
}));

export type Props = {
    text: string;
}

function ChatBoxQuestionItem({ text }: Props) {
    const classes = useStyles();

    return (
        <Grid container item justify="flex-start" className={classes.messageContainer}>
            <Grid item className={classes.message}>
                <Label kind="primary" bold size="subtitle1">{text}</Label>
                <div className={classes.arrowDown}></div>
            </Grid>

            <Grid item xs={1}>
                <IconButton>
                    <KeyboardArrowDownIcon className={classes.icon} />
                </IconButton>
            </Grid>

            {/* TODO: Colocar botões de sim ou não em um accordion */}
            {/* <Grid container item xs={12} spacing={2}>
                <Grid item>
                    <Button label="SIM" backgroundColor="#575475" size="small" onClick={(e: MouseEvent) => onClickAffirmative && onClickAffirmative(q, index)} />
                </Grid>
                <Grid item>
                    <Button label="NÃO" disabled={buttonsDisabled} backgroundColor="#FF0D0D" size="small" onClick={(e: MouseEvent) => onClickNegative && onClickNegative(q, index)} />
                </Grid>
            </Grid> */}
        </Grid>
    );
}

ChatBoxQuestionItem.propTypes = {
    blueRight: PropTypes.bool,
    text: PropTypes.string
};

ChatBoxQuestionItem.defaultProps = {
    blueRight: false,
    text: ''
};

export default ChatBoxQuestionItem;