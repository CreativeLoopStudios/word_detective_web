import React from 'react';

import PropTypes from 'prop-types';

import { Grid, makeStyles } from "@material-ui/core";

import PlayerRankingItem from './PlayerRankingItem';

const useStyles = makeStyles(() => ({
    container: {
        height: '100%',
        overflow: 'auto'
    }
}));

export type Props = {
    players: Array<{
        isWordMaster: boolean;
        playerName: string;
        score: number;
    }>;
}

function PlayerRanking({ players }: Props) {
    const classes = useStyles();
    
    return (
        <Grid container className={classes.container} spacing={2}>
            {
                players.map((player, index) => (
                    <PlayerRankingItem
                        key={index}
                        isWordMaster={player.isWordMaster}
                        playerName={player.playerName}
                        score={player.score}
                    />
                ))
            }
        </Grid>
    );
}

PlayerRanking.propTypes = {
    players: PropTypes.array
};
PlayerRanking.defaultProps = {
    players: []
};

export default PlayerRanking;