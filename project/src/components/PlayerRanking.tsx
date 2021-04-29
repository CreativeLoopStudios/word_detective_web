import React from 'react';

import PropTypes from 'prop-types';

import { Grid, makeStyles } from "@material-ui/core";

import PlayerRankingItem from './PlayerRankingItem';

import { Player } from '../types';

const useStyles = makeStyles(() => ({
    container: {
        height: '100%',
        overflow: 'auto'
    }
}));

export type Props = {
    players: Array<Player>;
}

function PlayerRanking({ players }: Props) {
    const classes = useStyles();
    
    return (
        <Grid container className={classes.container}>
            {
                players.map((player, index) => (
                    <PlayerRankingItem
                        key={index}
                        isWordMaster={player.role === 'word_master'}
                        playerName={player.name}
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