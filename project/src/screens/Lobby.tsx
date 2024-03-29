import React, { useState, useEffect, useContext, useCallback, MouseEvent } from "react";

import { useHistory, useParams } from "react-router-dom";

import { Box, Grid, IconButton, Snackbar } from "@material-ui/core";
import { Alert } from '@material-ui/lab';
import { FileCopyOutlined as FileCopyIcon } from '@material-ui/icons';

import firebase from "firebase/compat/app";
import { withFirebase } from "../firebase/context";
import { ROOMS_COLLECTION } from "../firebase/collections";
import Firebase from "../firebase";

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { SET_PLAYER_NAME, SET_HEARTBEAT_DATA } from '../actions';
import SessionContext from "../context/Session";

import GameState from "../state_of_play";
import PlayerStatus from "../player_status";
import { HeartbeatData, Player } from "../types";

import { CreateRoom } from "../screens";
import { Button, EditInput, Label, MainContainer, PlayerRanking, ScrollableContainer } from "../components";

type Props = {
    firebase: Firebase
}

function Lobby({ firebase }: Props) {
    const { roomId } = useParams<{ roomId: string }>();
    const history = useHistory();

    const sessionContext = useContext(SessionContext);

    const { playerId } = sessionContext.state;

    const lobbyUrl = window.location.href;

    const [players, setPlayers] = useState<Array<Player>>([]);
    const [copied, setCopied] = useState<boolean>(false);
    const [isHost, setIsHost] = useState<boolean>(false);
    const [playerName, setPlayerName] = useState<string>(sessionContext.state.playerName);
    const [heartbeatData, setHeartbeatData] = useState<HeartbeatData | null>(null);
    const [localClockStart, setLocalClockStart] = useState<firebase.firestore.Timestamp | null>(null);
    const [gameState, setGameState] = useState(null);
    const [heartbeats, setHeartbeats] = useState<any>({});
    const [isRoomConfigured, setIsRoomConfigured] = useState<boolean>(false);
    const [isPlayerAdded, setIsPlayerAdded] = useState<boolean>(false);

    const updateRoom = useCallback((data) => {
        return firebase.updateRlById(ROOMS_COLLECTION, roomId!, data);
    }, [firebase, roomId]);

    // sign up user
    useEffect(() => {
        if (!playerId) {
            firebase.signIn(sessionContext);
        }
    }, [firebase, playerId, sessionContext]);

    // update host status
    useEffect(() => {
        const connectedPlayers: Array<Player> = players.filter(p => p.status === "connected");
        if (connectedPlayers && playerId) {
            // as a convention, the host is always the player that was created first
            const sortedPlayerIds: Array<string> = connectedPlayers.sort((a, b) => a.creationDate - b.creationDate).map(p => p.id);
            const shouldBeHost: boolean = sortedPlayerIds[0] === playerId;
            setIsHost(shouldBeHost);
        }
    }, [players, playerId, setIsHost]);

    // update my role
    useEffect(() => {
        // as a convention, the host will be the first word master
        const targetRole = isHost ? 'word_master' : 'word_detective';
        const player = players.find(p => p.id === playerId);
        if (!player) {
            return;
        }

        if (player.role !== targetRole) {
            updateRoom({
                [`/players/${playerId}/role`]: targetRole
            });
        }
    }, [isHost, players, playerId, updateRoom]);

    // set my initial heartbeat info
    useEffect(() => {
        if (!heartbeatData && playerId) {
            updateRoom({
                [`heartbeats/${playerId}`]: firebase.getServerTimestamp()
            });
            const now = firebase.getTimestampNow();
            setLocalClockStart(now);
            console.log('setting heartbeat to', now);
        }
    }, [firebase, heartbeatData, playerId, setLocalClockStart, updateRoom]);

    // finish setting my heartbeat info
    useEffect(() => {
        // finish setting my heartbeat
        if (!heartbeatData && playerId && playerId in heartbeats && heartbeats[playerId] && localClockStart) {
            const localClockEnd = firebase.getTimestampNow();
            const lastValue = heartbeats[playerId];
            console.log('heartbeat snapshot')

            // round trip time (total latency)
            const rtt = localClockEnd.toMillis() - localClockStart.toMillis();
            // time to write something to firestore
            const writeTime = lastValue - localClockStart.toMillis();
            // time to read something from firestore (dissemination)
            const readTime = localClockEnd.toMillis() - lastValue;

            const payload: HeartbeatData = { rtt, writeTime, readTime };
            console.log(payload)

            sessionContext.dispatch({
                type: SET_HEARTBEAT_DATA,
                payload,
            });
            setHeartbeatData(payload);
        }
    }, [setHeartbeatData, heartbeatData, playerId, heartbeats, localClockStart, firebase, sessionContext]);

    // update data from snapshots
    useEffect(() => {
        if (!isPlayerAdded) return;

        const collectionRef = firebase.getRlCollection(ROOMS_COLLECTION, roomId!);
        collectionRef.on('value', (snapshot) => {
            const room = snapshot.val();
            if (!room) {
                return;
            }
            console.log("new room snapshot");

            const { players: _roomPlayers, heartbeats: roomHeartbeats, state } = room;
            const roomPlayers: Array<Player> = Object.values(_roomPlayers || {});

            // players are sorted by creating date
            setPlayers(roomPlayers.sort((a, b) => a.creationDate - b.creationDate));
            setGameState(state);
            setHeartbeats(roomHeartbeats);
        });

        return () => collectionRef.off();
    }, [firebase, roomId, isPlayerAdded]);

    // add myself to the room
    useEffect(() => {
        if (!players || !playerId) return;

        const playerInRoom = players.map(p => p.id).includes(playerId);
        if (!playerInRoom) {
            // add myself to the room
            console.log(`adding myself to the room: ${playerId} (${playerName})`);
            updateRoom({
                [`/players/${playerId}`]: {
                    id: playerId,
                    name: playerName,
                    score: 0,
                    creationDate: firebase.getServerTimestamp(),
                    status: PlayerStatus.CONNECTED,
                    playedAsWordMaster: false,
                }
            })
                .then(() => {
                    setIsPlayerAdded(true);
                });
            firebase.onDisconnect(roomId!, playerId);
        }
    }, [players, playerId, updateRoom, firebase, playerName, roomId]);

    // set myself as connected
    useEffect(() => {
        if (!players || !playerId) {
            return;
        }

        const player = players.find(p => p.id === playerId);
        // possibly player is not in the room yet
        if (!player) return;

        if (player.status !== PlayerStatus.CONNECTED) {
            console.log(`setting myself as connected: ${playerId} (${playerName})`);
            updateRoom({
                [`/players/${playerId}`]: {
                    status: PlayerStatus.CONNECTED
                }
            });
        }
    }, [players, playerId, updateRoom, playerName]);

    // state watcher
    useEffect(() => {
        if (gameState === GameState.WORD_MASTER_CHOOSE_WORD) {
            history.push(`/${roomId}/game`);
        }
    }, [gameState, roomId, history])

    function handleSubmit(evt: MouseEvent): void {
        evt.preventDefault();
        updateRoom({ state: GameState.WORD_MASTER_CHOOSE_WORD });
    }

    function commitPlayerName(newName: string): void {
        sessionContext.dispatch({
            type: SET_PLAYER_NAME,
            payload: newName
        });
        setPlayerName(newName);
        firebase.updateDisplayName(newName);

        updateRoom({
            [`/players/${playerId}/name`]: newName
        });
    }

    function onFinishEditingPlayerName(text: string): void {
        commitPlayerName(text);
    }

    function onChangeRoomConfig(isConfigured: boolean): void {
        setIsRoomConfigured(isConfigured);
    }

    function _renderScreenTitle() {
        let title = "Configuração da sala";
        if (!isHost) {
            title = "Aguardando o início do jogo!";
        }

        return <Label kind="secondary" size="h5" bold>{title}</Label>;
    }

    return (
        <MainContainer
            sidebar={
                <>
                    <Box flex={1}>
                        <EditInput
                            label="Nome do jogador:"
                            type="text"
                            value={playerName}
                            onFinishEditing={onFinishEditingPlayerName}
                        />
                    </Box>

                    <ScrollableContainer flex={8}>
                        <PlayerRanking
                            players={players}
                        />
                    </ScrollableContainer>
                </>
            }
        >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {_renderScreenTitle()}
                </Grid>

                {isHost && <Grid item xs={12}>
                    <CreateRoom roomId={roomId} onChangeRoomConfig={onChangeRoomConfig} />
                </Grid>}

                <Grid container item xs={12}>
                    <Grid item xs={12}>
                        <Label size="h6">Compartilhe o link com seus amigos!</Label>
                    </Grid>

                    <Grid item xs={11}>
                        <Label size="subtitle1" color="white" underline>{lobbyUrl}</Label>
                    </Grid>

                    <Grid item xs={1}>
                        <CopyToClipboard text={lobbyUrl}
                            onCopy={() => setCopied(true)}>
                                <IconButton>
                                    <FileCopyIcon />
                                </IconButton>
                        </CopyToClipboard>
                    </Grid>

                    <Snackbar open={copied} autoHideDuration={3000} onClose={() => setCopied(false)}
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                        <Alert severity="success">Copiado!</Alert>
                    </Snackbar>
                </Grid>

                {isHost && players.length > 1 && isRoomConfigured && (
                    <Grid container item xs={12} justifyContent="center" alignItems="center">
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            label="Começar!"
                        />
                    </Grid>
                )}
            </Grid>
        </MainContainer>
    );
}

export default withFirebase(Lobby);
