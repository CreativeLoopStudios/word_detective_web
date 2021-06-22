import React from "react";

import { CircularProgress, Grid } from "@material-ui/core";

import { MainContainer } from "../components";

function Loading() {
    return (
        <MainContainer alignItems="center">
            <Grid container justify="center">
                <Grid item>
                    <CircularProgress variant="indeterminate" size={90} thickness={7} />
                </Grid>
            </Grid>
        </MainContainer>
    );
}

export default Loading;