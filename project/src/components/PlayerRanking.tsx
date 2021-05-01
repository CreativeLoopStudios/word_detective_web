import React from 'react';

import PropTypes from 'prop-types';

import { makeStyles } from "@material-ui/core";

import PlayerRankingItem from './PlayerRankingItem';

import { Player } from '../types';

const useStyles = makeStyles(() => ({
    playerRankingItem: {
        marginTop: '0.5rem'
    }
}));

export type Props = {
    players: Array<Player>;
}

function PlayerRanking({ players }: Props) {
    const classes = useStyles();
    
    return (
        <>
            {
                players.sort((a: Player, b: Player) => a.role > b.role ? 0 : 1).map((player, index) => (
                    <PlayerRankingItem
                        key={index}
                        isWordMaster={player.role === 'word_master'}
                        playerName={player.name}
                        score={player.score}
                        className={classes.playerRankingItem}
                    />
                ))
            }
        </>
    );
}

PlayerRanking.propTypes = {
    players: PropTypes.array
};
PlayerRanking.defaultProps = {
    players: []
};

export default PlayerRanking;