import React from 'react';

import { Grid, makeStyles } from "@material-ui/core";
import PlayerIcon from './PlayerIcon'
import { Label } from '.';


const useStyles = makeStyles({
    item: {},
});

export type Props = {
    isWordMaster: boolean;
    playerName: string;
    score: number;
}

function PlayerRankingItem({ isWordMaster, playerName, score }: Props) {
    const classes = useStyles();

    return (
        <Grid container item className={classes.item} alignItems="center">
            <PlayerIcon isWordMaster={isWordMaster} />

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