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
import { SET_PLAYER_NAME } from '../actions';

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flex: 1,
    },
}));

function RegisterUser(props) {
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
            await props.firebase.getItemById("rooms", "Dy9vm3vNjlIWKc84Ug78")
        ).data();

        let objToUpdate = {};
        if (room.host === "") {
            objToUpdate = {
                players: firebase.firestore.FieldValue.arrayUnion(name),
                host: name,
                word_master: name,
            };
        } else {
            objToUpdate = {
                players: firebase.firestore.FieldValue.arrayUnion(name),
                word_detectives: firebase.firestore.FieldValue.arrayUnion(name),
            };
        }

        await props.firebase.updateById(
            "rooms",
            "Dy9vm3vNjlIWKc84Ug78",
            objToUpdate
        );

        history.push("/lobby");
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
            </Grid>
        </div>
    );
}

export default withFirebase(RegisterUser);
