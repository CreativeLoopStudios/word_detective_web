import React, { useState, useEffect, useContext } from "react";
import { makeStyles, Button, Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { withFirebase } from "../firebase/context";
import SessionContext from "../context/Session";
import { ROOMS_COLLECTION } from "../firebase/collections";
import GameState from "../state_of_play";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flex: 1,
    },
}));

function Lobby(props) {
    const classes = useStyles();
    const history = useHistory();

    const sessionContext = useContext(SessionContext);

    const [players, setPlayers] = useState([]);
    const [isHost, setIsHost] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        const unsubscribe = props.firebase
            .getCollection(ROOMS_COLLECTION)
            .onSnapshot((snapshot) => {
                snapshot.forEach((doc) => {
                    const room = doc.data();
                    setPlayers(room.players);

                    if (room.host === sessionContext.state.playerName) {
                        setIsHost(true);
                    } else {
                        setIsHost(false);
                    }

                    if (room.state === GameState.WORD_MASTER_CHOOSE_WORD) {
                        const { latency } = sessionContext.state.heartbeatData;
                        // correct for latency:
                        const countFrom = 10 - latency;
                        doCountdown(countFrom, async () => {
                            history.push("/game");
                        });
                    }
                });
            });
        return () => {
            unsubscribe();
        };
    }, [props.firebase, history, sessionContext.state.playerName, sessionContext.state.heartbeatData]);

    const doCountdown = (counter, callback) => {
        if (counter <= 0) {
            return;
        }

        // first, wait for fractional second
        const splitSecond = counter % 1;
        console.log(splitSecond);

        // transform to int
        counter = (counter - splitSecond) | 0;

        setTimeout(() => {
            const h = setInterval(() => {
                setCountdown(counter);
                if (counter === 0) {
                    clearInterval(h);
                    if (callback) {
                        callback();
                    }
                } else {
                    counter -= 1;
                }
            }, 1000);
        }, splitSecond);
    }

    const handleSubmit = async (evt) => {
        evt.preventDefault();

        await props.firebase.updateById(
            ROOMS_COLLECTION,
            "Dy9vm3vNjlIWKc84Ug78",
            {
                state: GameState.WORD_MASTER_CHOOSE_WORD
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
                            <li key={index}>{player}</li>
                        ))}
                    </ul>
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

                    {countdown > 0 && <h1>{countdown}</h1>}
                </Grid>
            </Grid>
        </div>
    );
}

export default withFirebase(Lobby);
