import React, { useState, useEffect, useContext } from "react";
import { makeStyles, Button, Grid } from "@material-ui/core";
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

    const sessionContext = useContext(SessionContext);

    // useEffect(() => {
    //     const unsubscribe = props.firebase
    //         .getCollection("rooms")
    //         .onSnapshot((snapshot) => {
    //             snapshot.forEach((doc) => {
    //                 const room = doc.data();
    //                 setPlayers(room.players);

    //                 if (room.host === sessionContext.state.playerName) {
    //                     setIsHost(true);
    //                 } else {
    //                     setIsHost(false);
    //                 }

    //                 if (room.isGameBegan) {
                        
    //                 }
    //             });
    //         });
    //     return () => {
    //         unsubscribe();
    //     };
    // }, [props.firebase]);

    return (
        <div className={classes.root}>
            <Grid container spacing={3} direction="row">
                <Grid item xs={12}>
                    <h1>
                        Bom Jogo, {sessionContext.state.playerName}
                    </h1>
                </Grid>
            </Grid>
        </div>
    );
}

export default withFirebase(Lobby);
