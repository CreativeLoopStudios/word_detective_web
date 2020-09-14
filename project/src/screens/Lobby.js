import React, { useState, useEffect, useContext } from "react";
import { makeStyles, Button, Grid, TextField, Snackbar } from "@material-ui/core";
import { Alert } from '@material-ui/lab';
import { useHistory, useParams } from "react-router-dom";
import { withFirebase } from "../firebase/context";
import SessionContext from "../context/Session";
import { ROOMS_COLLECTION } from "../firebase/collections";
import GameState from "../state_of_play";
import {CopyToClipboard} from 'react-copy-to-clipboard';

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

    const lobbyUrl = `http://localhost:3000/${roomId}/lobby`;

    useEffect(() => {
        const unsubscribe = props.firebase
            .getCollection(ROOMS_COLLECTION)
            .onSnapshot((snapshot) => {
                snapshot.forEach((doc) => {
                    const room = doc.data();
                    setPlayers(room.players);

                    const isHost = room.host === sessionContext.state.playerName;
                    setIsHost(isHost);

                    if (room.state === GameState.WORD_MASTER_CHOOSE_WORD) {
                        history.push(`/${roomId}/game`);
                    }
                });
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
