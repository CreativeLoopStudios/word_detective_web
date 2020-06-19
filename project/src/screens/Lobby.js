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
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flex: 1,
    },
}));

function Lobby() {
    const classes = useStyles();
    const history = useHistory();

    return (
        <div className={classes.root}>
            <Grid container spacing={3} direction="row">
                <Grid item xs={12}>
                    <h1>Lobby</h1>
                </Grid>
            </Grid>
        </div>
    );
}

export default Lobby;
