import React, { useState } from "react";
import {
    makeStyles,
    Paper,
    Box,
    Button,
    TextField,
    Grid,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flex: 1,
    },
}));

function RegisterUser() {
    const classes = useStyles();
    const [name, setName] = useState("");

    const handleSubmit = (evt) => {
        evt.preventDefault();
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
