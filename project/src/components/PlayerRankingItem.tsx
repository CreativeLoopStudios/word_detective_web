import React from 'react';

import { Grid } from "@material-ui/core";

import PlayerIcon from './PlayerIcon'
import Label from './Label';

export type Props = {
    isWordMaster: boolean;
    playerName: string;
    score: number;
}

function PlayerRankingItem({ isWordMaster, playerName, score }: Props) {
    return (
        <Grid container alignItems="center" xs={12}>
            <Grid item xs={4}>
                <PlayerIcon isWordMaster={isWordMaster} />
            </Grid>

            <Grid container direction="column" item xs={8}>
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