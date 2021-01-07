import React, { useState, useEffect, useContext, useCallback } from "react";
import { makeStyles, Button, Grid, TextField, Snackbar } from "@material-ui/core";
import { Alert } from '@material-ui/lab';
import { useHistory, useParams } from "react-router-dom";
import { withFirebase } from "../firebase/context";
import SessionContext from "../context/Session";
import { ROOMS_COLLECTION } from "../firebase/collections";
import GameState from "../state_of_play";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { SET_PLAYER_NAME, SET_HEARTBEAT_DATA } from '../actions';
import { database, firestore } from "firebase/app";
import PlayerStatus from "../player_status";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flex: 1,
    },
}));

function Lobby(props) {
    const { roomId } = useParams();
    const classes = useStyles();
    const history = useHistory();

    const sessionContext = useContext(SessionContext);

    const [players, setPlayers] = useState([]);
    const [copied, setCopied] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [playerName, setPlayerName] = useState(sessionContext.state.playerName);
    const [heartbeatData, setHeartbeatData] = useState(null);
    const [localClockStart, setLocalClockStart] = useState(null);
    const [gameState, setGameState] = useState(null);
    const [heartbeats, setHeartbeats] = useState({});

    const lobbyUrl = window.location.href;
    const { playerId } = sessionContext.state;
    const { firebase } = props;

    const updateRoom = useCallback((data) => {
        return firebase.updateRlById(ROOMS_COLLECTION, roomId, data);
    }, [firebase, roomId]);

    const handleSubmit = (evt) => {
        evt.preventDefault();
        updateRoom({ state: GameState.WORD_MASTER_CHOOSE_WORD });
    }

    const commitPlayerName = (newName) => {
        sessionContext.dispatch({
            type: SET_PLAYER_NAME,
            payload: newName 
        });
        setPlayerName(newName);

        updateRoom({
            [`/players/${playerId}/name`]: newName
        });
    }

    // sign up user
    useEffect(() => {
        if (!playerId) {
           firebase.signIn(sessionContext);
        }
    }, [firebase, playerId, sessionContext]);

    // update host status
    useEffect(() => {
        const connectedPlayers = players.filter(p => p.status === "connected");
        if (connectedPlayers && playerId) {
            // as a convention, the host is always the player that was created first
            const sortedPlayerIds = connectedPlayers.map(p => p.id).sort((a, b) => a.creationDate - b.creationDate);
            const shouldBeHost = sortedPlayerIds[0] === playerId;
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
                [`heartbeats/${playerId}`]: database.ServerValue.TIMESTAMP
            });
            const now = firestore.Timestamp.now();
            setLocalClockStart(now);
            console.log('setting heartbeat to', now);
        }
    }, [heartbeatData, playerId, setLocalClockStart, updateRoom]);

    // finish setting my heartbeat info
    useEffect(() => {
         // finish setting my heartbeat
         if (!heartbeatData && playerId && playerId in heartbeats && heartbeats[playerId]) {
            const localClockEnd = firestore.Timestamp.now();
            const lastValue = heartbeats[playerId];
            console.log('heartbeat snapshot')

            // round trip time (total latency)
            const rtt = localClockEnd - localClockStart;
            // time to write something to firestore
            const writeTime = lastValue - localClockStart;
            // time to read something from firestore (dissemination)
            const readTime = localClockEnd - lastValue;

            const payload = { rtt, writeTime, readTime };
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
        const collectionRef = firebase.getRlCollection(ROOMS_COLLECTION, roomId);
        collectionRef.on('value', (snapshot) => {
            const room = snapshot.val();
            if (!room) {
                return;
            }
            console.log("new room snapshot");

            const { players: _roomPlayers, heartbeats: roomHeartbeats, state } = room;
            const roomPlayers = Object.values(_roomPlayers || {});

            // players are sorted by creating date
            setPlayers(roomPlayers.sort((a, b) => a.creationDate - b.creationDate));
            setGameState(state);
            setHeartbeats(roomHeartbeats);
        });

        return () => collectionRef.off();
    }, [setGameState, setPlayers, setHeartbeats, firebase, roomId]);

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
                    creationDate: database.ServerValue.TIMESTAMP,
                    status: PlayerStatus.CONNECTED,
                    playedAsWordMaster: false,
                }
            });
            firebase.onDisconnect(roomId, playerId);
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

    // render template
    return (
        <div className={classes.root}>
            <Grid container spacing={3} direction="row">
                <Grid item xs={12}>
                    <h1>
                        Lobby - Bem vindo, {playerName}
                    </h1>

                    <ul>
                        {players.map((player, idx) => (
                            <li key={player.id}>{player.name} - Status: {player.status} - Id: {player.id}</li>
                        ))}
                    </ul>
                </Grid>

                <Grid item xs={12}>
                    <Grid container>
                        <Grid item>
                            <TextField fullWidth label="Nome" value={playerName || ''} onChange={(ev) => setPlayerName(ev.target.value)} />
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="secondary" onClick={() => commitPlayerName(playerName)}>
                                Mudar
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12}>
                            <h3>Compartilhe o link com seus amigos!</h3>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField fullWidth label="Link" readOnly value={lobbyUrl} />
                        </Grid>

                        <Grid item>
                            <CopyToClipboard text={lobbyUrl}
                                onCopy={() => setCopied(true)}>
                                <Button variant="outlined" color="secondary">Copiar</Button>
                            </CopyToClipboard>
                        </Grid>
                    </Grid>

                    <Snackbar open={copied} autoHideDuration={3000} onClose={() => setCopied(false)}
                        anchorOrigin={{vertical: "top", horizontal: "center"}}>
                        <Alert severity="success">Copiado!</Alert>
                    </Snackbar>
                </Grid>

                <Grid item xs={12}>
                    {isHost && players.length > 1 && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Começar!
                        </Button>
                    )}

                    {isHost && players.length === 1 && (
                        <h3>Aguardando demais jogadores</h3>
                    )}

                    {!isHost && <h3>Aguardando Host</h3>}
                </Grid>
            </Grid>
        </div>
    );
}

export default withFirebase(Lobby);
