import React, { useState, useEffect, useContext } from "react";
import { makeStyles, Button, Grid, TextField, Snackbar } from "@material-ui/core";
import { Alert } from '@material-ui/lab';
import { useHistory, useParams } from "react-router-dom";
import { withFirebase } from "../firebase/context";
import SessionContext from "../context/Session";
import { ROOMS_COLLECTION } from "../firebase/collections";
import GameState from "../state_of_play";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { SET_PLAYER_NAME, SET_HEARTBEAT_DATA } from '../actions';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import * as firebase from "firebase/app";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flex: 1,
    },
}));

const generateUserName = () => {
    return uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], separator: ' ', style: 'capital' });
}

function Lobby(props) {
    const { roomId } = useParams();
    const classes = useStyles();
    const history = useHistory();

    const sessionContext = useContext(SessionContext);

    const [players, setPlayers] = useState([]);
    const [copied, setCopied] = useState(false);
    const [isHost, setIsHost] = useState(false);

    const lobbyUrl = window.location.href;

    useEffect(() => {
        let name = sessionContext.state.playerName;

        if (!name) {
            name = generateUserName();
            sessionContext.dispatch({
                type: SET_PLAYER_NAME,
                payload: name 
            });
        }

        // add player to room
        props.firebase.updateById(
            ROOMS_COLLECTION,
            roomId,
            { 
                players: firebase.firestore.FieldValue.arrayUnion({
                    score: 0,
                    name
                })
            }
        );

        let roleIsSet = false;
        let heartbeatSet = false;
        let localClockStart = null;

        const unsubscribe = props.firebase
            .getCollection(ROOMS_COLLECTION, roomId)
            .onSnapshot((doc) => {
                const room = doc.data();
                setPlayers(room.players);
                const playerName = sessionContext.state.playerName;

                if (room.players.length > 0 && !roleIsSet) {
                    // as a convention, the host is always the first player to enter the room
                    const isHost = room.players[0].name === playerName;
                    setIsHost(isHost);

                    const objToUpdate = {};
                    if (isHost) {
                        objToUpdate['host'] = playerName;
                        objToUpdate['word_master'] = playerName;
                    }
                    else {
                        // add player to word detectives
                        objToUpdate['word_detectives'] = firebase.firestore.FieldValue.arrayUnion(playerName);
                    }
                    objToUpdate[`heartbeats.${playerName}`] = firebase.firestore.FieldValue.serverTimestamp();

                    localClockStart = firebase.firestore.Timestamp.now();
                    props.firebase.updateById(
                        ROOMS_COLLECTION,
                        roomId,
                        objToUpdate,
                    );

                    roleIsSet = true;
                }
                
                if (!heartbeatSet && playerName in room.heartbeats && room.heartbeats[playerName]) {
                    const localClockEnd = firebase.firestore.Timestamp.now();
                    const lastValue = room.heartbeats[name];

                    // round trip time (total latency)
                    const rtt = localClockEnd - localClockStart;
                    // time to write something to firestore 
                    const writeTime = lastValue - localClockStart;
                    // time to read something from firestore (dissemination)
                    const readTime = localClockEnd - lastValue;

                    sessionContext.dispatch({
                        type: SET_HEARTBEAT_DATA,
                        payload: { rtt, writeTime, readTime },
                    });

                    heartbeatSet = true;
                }

                if (room.state === GameState.WORD_MASTER_CHOOSE_WORD) {
                    history.push(`/${roomId}/game`);
                }
            });
        return () => {
            unsubscribe();
        };
    }, [props.firebase, history, sessionContext.state.playerName, roomId]);

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        await props.firebase.updateById(
            ROOMS_COLLECTION,
            roomId,
            {
                state: GameState.WORD_MASTER_CHOOSE_WORD,
            }
        );
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={3} direction="row">
                <Grid item xs={12}>
                    <h1>
                        Lobby - Bem vindo, {sessionContext.state.playerName}
                    </h1>

                    <ul>
                        {players.map((player, index) => (
                            <li key={index}>{player.name}</li>
                        ))}
                    </ul>
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
