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

    const wordMaster = players.find(p => p.role === "word_master");
    const wordDetectives = players.filter(p => p.role === "word_detective");

    const sortedPlayers = wordMaster ? [ wordMaster ].concat(wordDetectives) : players;

    return (
        <>
            {
                sortedPlayers.map((player) => (
                    <PlayerRankingItem
                        key={player.id}
                        isWordMaster={player.role === 'word_master'}
                        isOnline={player.status === 'connected'}
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