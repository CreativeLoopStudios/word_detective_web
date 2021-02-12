import React from "react";
import { Grid } from "@material-ui/core";

function EndRound({ word, playerWhoDiscovered }) {
    return (
        <Grid item xs={12}>
            {
                playerWhoDiscovered &&
                <h3>Palavra foi descoberta por {playerWhoDiscovered.name}! Parabéns!</h3>
            }

            {
                !playerWhoDiscovered &&
                <h3>Ninguém descobriu a palavra :(</h3>
            }
            

            <p>
                A palavra é <b>{word}</b>!
            </p>

            <p>Começando novo round...</p>
        </Grid>
    );
}

export default EndRound;
