import React, { useState, useEffect, useContext } from "react";
import {
    makeStyles,
    Button,
    Grid,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { withFirebase } from "../firebase/context";
import SessionContext from "../context/Session";

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

    useEffect(() => {
        const unsubscribe = props.firebase.getCollection("rooms").onSnapshot((snapshot) => {
            snapshot.forEach((doc) => {
                const room = doc.data();
                setPlayers(room.players);
                setIsHost(room)
            });
        });
        return () => {
            unsubscribe();
        };
    }, [props.firebase]);

    const handleSubmit = () => {

    };

    return (
        <div className={classes.root}>
            <Grid container spacing={3} direction="row">
                <Grid item xs={12}>
                    <h1>Lobby - Bem vindo, {sessionContext.state.playerName}</h1>

                    <ul>
                        {players.map((player, index) => (
                            <li key={index}>{player}</li>
                        ))}
                    </ul>
                </Grid>

                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Começar!
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}

export default withFirebase(Lobby);
