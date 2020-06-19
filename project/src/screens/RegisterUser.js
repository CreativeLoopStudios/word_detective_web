import React, { useState } from "react";
import {
    makeStyles,
    Paper,
    Box,
    Button,
    TextField,
    Grid,
} from "@material-ui/core";
import db from '../database/db';
import * as firebase from "firebase/app";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flex: 1,
    },
}));

function RegisterUser() {
    const classes = useStyles();
    const history = useHistory();
    const [name, setName] = useState("");

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        await db.updateById('rooms', 'Dy9vm3vNjlIWKc84Ug78', {
            players: firebase.firestore.FieldValue.arrayUnion(name)
        });
        history.push('/lobby');
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
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Jogar!
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}

export default RegisterUser;
