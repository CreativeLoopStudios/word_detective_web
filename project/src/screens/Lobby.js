import React, { useState, useEffect } from "react";
import {
    makeStyles,
    Paper,
    Box,
    Button,
    TextField,
    Grid,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { withFirebase } from "../firebase/context";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flex: 1,
    },
}));

function Lobby(props) {
    const classes = useStyles();
    const history = useHistory();

    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const unsubscribe = props.firebase.getCollection("rooms").onSnapshot((snapshot) => {
            snapshot.forEach((doc) => {
                const room = doc.data();
                setPlayers(room.players);
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
                    <h1>Lobby</h1>

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
