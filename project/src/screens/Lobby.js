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

    const [players, setPlayers] = useState({});
    const [copied, setCopied] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [playerName, setPlayerName] = useState(sessionContext.state.playerName);
    const [heartbeatData, setHeartbeatData] = useState(null);
    const [wordDetectives, setWordDetectives] = useState({});
    const [localClockStart, setLocalClockStart] = useState(null);

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

        for(let [key, player] of Object.entries(players)) {
            if (player.id === playerId) {
                const data = {};
                data[`/players/${key}/name`] = newName;
                updateRoom(data);
                break;
            }
        }
    }

    // update host status
    useEffect(() => {
        if (Object.keys(players).length > 0 && !isHost) {
            // as a convention, the host is always the first player to enter the room
            const shouldBeHost = players[Object.keys(players)[0]].id === playerId;
            setIsHost(shouldBeHost);

            if (shouldBeHost) {
                updateRoom({ host: playerId, word_master: playerId });
            } else if (!(playerId in wordDetectives)) {
                const data = {};
                data[`word_detectives/${playerId}`] = {}; 
                updateRoom(data);
            }
        }
    }, [players, playerId, setIsHost, isHost, wordDetectives, updateRoom]);

    // add heartbeat info if needed
    useEffect(() => {
        if (!heartbeatData) {
            const data = {};
            data[`heartbeats/${playerId}`] = database.ServerValue.TIMESTAMP;
            updateRoom(data);

            const now = firestore.Timestamp.now();
            setLocalClockStart(now);

            console.log('setting heartbeat to', now)
        }
    }, [heartbeatData, playerId, setLocalClockStart, updateRoom]);

    // firebase snapshot
    useEffect(() => {
        const collectionRef = firebase.getRlCollection(ROOMS_COLLECTION, roomId);
        collectionRef.on('value', (snapshot) => {
            console.log("new room snapshot");
            const room = snapshot.val();
            if (!room) {
                return;
            }

            const { players: roomPlayers, heartbeats, state, word_detectives } = room;
            setPlayers(roomPlayers || {});
            setWordDetectives(word_detectives || {});

            const playerInRoom = roomPlayers && Object.values(roomPlayers).map(p => p.id).includes(playerId);
            // add player in room
            if (!playerInRoom) {
                firebase.pushToList(ROOMS_COLLECTION, roomId, 'players', {
                    id: playerId,
                    name: playerName,
                    score: 0
                });
            }

            // finish setting the heartbeat
            if (!heartbeatData && playerId in heartbeats && heartbeats[playerId]) {
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

            if (state === GameState.WORD_MASTER_CHOOSE_WORD) {
                history.push(`/${roomId}/game`);
            }
        });

        return () => {
            collectionRef.off();
        };
    }, [playerId, playerName, heartbeatData, firebase, roomId, sessionContext, localClockStart, history]);

    return (
        <div className={classes.root}>
            <Grid container spacing={3} direction="row">
                <Grid item xs={12}>
                    <h1>
                        Lobby - Bem vindo, {playerName}
                    </h1>

                    <ul>
                        {Object.keys(players).map((key) => (
                            <li key={key}>{players[key].name}</li>
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
                    {isHost && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Começar!
                        </Button>
                    )}

                    {!isHost && <h3>Aguardando Host</h3>}
                </Grid>
            </Grid>
        </div>
    );
}

export default withFirebase(Lobby);
