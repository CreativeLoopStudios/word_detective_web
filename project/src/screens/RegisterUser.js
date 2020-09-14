import React, { useState, useContext } from "react";
import {
    makeStyles,
    Button,
    TextField,
    Grid,
} from "@material-ui/core";
import * as firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import { withFirebase } from "../firebase/context";
import SessionContext from "../context/Session";
import { SET_PLAYER_NAME, SET_HEARTBEAT_DATA } from '../actions';
import { ROOMS_COLLECTION } from "../firebase/collections";
import GameState from '../state_of_play';

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flex: 1,
    },
}));

function RegisterUser(props) {
    const magicRoomId = "Dy9vm3vNjlIWKc84Ug78";
    const classes = useStyles();
    const history = useHistory();

    const sessionContext = useContext(SessionContext);

    const [name, setName] = useState("");

    const handleSubmit = async (evt) => {
        evt.preventDefault();

        sessionContext.dispatch({
            type: SET_PLAYER_NAME,
            payload: name
        });

        const room = (
            await props.firebase.getItemById(ROOMS_COLLECTION, magicRoomId)
        ).data();

        let objToUpdate = null;
        if (room.host === "") {
            objToUpdate = {
                host: name,
                word_master: name,
            };
        } else {
            objToUpdate = {
                word_detectives: firebase.firestore.FieldValue.arrayUnion(name),
            };
        }

        objToUpdate[`heartbeats.${name}`] = firebase.firestore.FieldValue.serverTimestamp();
        objToUpdate["players"] = firebase.firestore.FieldValue.arrayUnion({
            score: 0,
            name
        });

        const localClockStart = firebase.firestore.Timestamp.now();
        const updatePromise = props.firebase.updateById(
            ROOMS_COLLECTION,
            magicRoomId,
            { 
                ...objToUpdate,
                state: GameState.WAITING_PLAYERS
            }
        );

        // listen to heartbeat
        const unsubscribeFromHeartbeat = props.firebase.getCollection(ROOMS_COLLECTION, magicRoomId)
            .onSnapshot((doc) => {
                const localClockEnd = firebase.firestore.Timestamp.now();
                const room = doc.data();

                if (name in room.heartbeats && room.heartbeats[name]) {
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

                    unsubscribeFromHeartbeat();
                }
            })

        await updatePromise;

        history.push(`/${magicRoomId}/lobby`);
    };

    const resetRoom = async () => {
        await props.firebase.updateById(
            ROOMS_COLLECTION,
            magicRoomId,
            {
                host: '',
                state: '',
                players: [],
                turns: 0,
                word_detectives: [],
                word_master: '',
                rounds: 0,
                word_of_the_round: '',
                questions: [],
                heartbeats: {},
                question_answered: null,
                clues: []
            }
        );
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={3} direction="row">
                <Grid item xs={12}>
                    <h1>Entre na sala!</h1>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        id="outlined-basic"
                        label="Seu nome"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Jogar!
                    </Button>
                </Grid>

                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={resetRoom}
                    >
                        Resetar Sala
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}

export default withFirebase(RegisterUser);
