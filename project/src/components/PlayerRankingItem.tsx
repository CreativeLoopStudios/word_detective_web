import React from 'react';

import { Grid, makeStyles } from "@material-ui/core";

import openBook from '../assets/open-book.png';
import detective from '../assets/detective.png';

import { Label } from '.';

import { Math } from "../utils";

type StyleProps = {
    backgroundImage: string;
    backgroundColor: string;
}

export const BackgroundColors = [
    '#0082D5',
    '#D5005F',
    '#73D500'
]

const useStyles = makeStyles({
    item: {
    },
    circle: ({ backgroundImage, backgroundColor }: StyleProps) => ({
        backgroundColor: backgroundColor,
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '2rem',
        borderRadius: 100,
        border: '2px solid yellow',
        padding: '0.5rem',
        width: '1.5rem',
        height: '1.5rem'
    })
});

export type Props = {
    isWordMaster: boolean;
    playerName: string;
    score: number;
}

function PlayerRankingItem({ isWordMaster, playerName, score }: Props) {
    const classes = useStyles({
        backgroundImage: (isWordMaster) ? openBook : detective,
        backgroundColor: (isWordMaster) ? 'red' : BackgroundColors[Math.randomInt(0, 3)]
    });

    return (
        <Grid container direction="row" item className={classes.item}>
            <div className={classes.circle}></div>

            <Grid container item>
                <Grid item>
                    <Label>{playerName}</Label>
                </Grid>

                <Grid item>
                    <Label>{score}</Label>
                </Grid>
            </Grid>
        </Grid>
    );
}

PlayerRankingItem.propTypes = {};
PlayerRankingItem.defaultProps = {};

export default PlayerRankingItem;