import React from 'react';

import { Grid, makeStyles } from "@material-ui/core";

import openBook from '../assets/open-book.png';
import detective from '../assets/detective.png';

import { Label } from '.';

import { Math } from "../utils";

type StyleProps = {
    backgroundImage: string;
    backgroundColor: string;
    backgroundSize: string;
    backgroundPosition: string;
    border: string;
}

export const BackgroundColors = [
    '#0082D5',
    '#D5005F',
    '#73D500'
]

const useStyles = makeStyles({
    item: {
    },
    circle: ({ backgroundImage, backgroundColor, backgroundSize, backgroundPosition, border }: StyleProps) => ({
        backgroundColor: backgroundColor,
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: backgroundPosition,
        backgroundRepeat: 'no-repeat',
        backgroundSize: backgroundSize,
        borderRadius: 100,
        border: border,
        padding: '0.5rem',
        width: '1.8rem',
        height: '1.8rem'
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
        backgroundColor: (isWordMaster) ? 'red' : BackgroundColors[Math.randomInt(0, 3)],
        backgroundSize: (isWordMaster) ? '1.8rem' : '2.5rem',
        backgroundPosition: (isWordMaster) ? 'center' : 'bottom',
        border: (isWordMaster) ? '2px solid yellow' : 'none',
    });

    return (
        <Grid container item className={classes.item} alignItems="center">
            <Grid item xs={3}>
                <div className={classes.circle}></div>
            </Grid>

            <Grid container direction="column" item xs={9}>
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

PlayerRankingItem.propTypes = {};
PlayerRankingItem.defaultProps = {};

export default PlayerRankingItem;