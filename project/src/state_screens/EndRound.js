import React from "react";
import { Grid } from "@material-ui/core";

function EndRound(props) {
    return (
        <Grid item xs={12}>
            <h3>Palavra foi descoberta! Parabéns!</h3>

            <p>
                A palavra é <b>{props.word}</b>!
            </p>

            <p>Começando novo round...</p>
        </Grid>
    );
}

export default EndRound;
