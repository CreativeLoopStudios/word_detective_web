import React from 'react';

import PropTypes from 'prop-types';

import { makeStyles, Grid } from "@material-ui/core";

import PlayerIcon from './PlayerIcon'
import Label from './Label';

const useStyles = makeStyles(() => ({
    icon: {
        position: 'relative'
    },
    circleStatus: {
        width: '1rem',
        height: '1rem',
        borderRadius: '10rem',
        position: 'absolute',
        bottom: '0rem',
        right: '1rem',
        border: '2px solid white'
    },
    circleOnline: {
        backgroundColor: 'green'
    },
    circleOffline: {
        backgroundColor: 'red'
    }
}));

export type Props = {
    isWordMaster: boolean;
    isOnline: boolean;
    playerName: string;
    score: number;
    className: string;
}

function PlayerRankingItem({ isWordMaster, isOnline, playerName, score, className }: Props) {
    const classes = useStyles();

    return (
        <Grid container item alignItems="center" xs={12} className={className}>
            <Grid item xs={4} className={classes.icon}>
                <PlayerIcon isWordMaster={isWordMaster} />

                <div className={`${classes.circleStatus} ${isOnline ? classes.circleOnline : classes.circleOffline}`}></div>
            </Grid>

            <Grid container item direction="column" xs={8}>
                <Grid item>
                    <Label kind="secondary">{playerName}</Label>
                </Grid>

                <Grid item>
                    <Label inline bold>Pontos:</Label>&nbsp;
                    <Label kind="secondary" inline bold>{score}</Label>
                </Grid>
            </Grid>
        </Grid>
    );
}

PlayerRankingItem.propTypes = {
    isWordMaster: PropTypes.bool,
    isOnline: PropTypes.bool,
    playerName: PropTypes.string,
    score: PropTypes.number,
    className: PropTypes.string
};

PlayerRankingItem.defaultProps = {
    isWordMaster: false,
    isOnline: false,
    playerName: undefined,
    score: 0,
    className: undefined
};

export default PlayerRankingItem;