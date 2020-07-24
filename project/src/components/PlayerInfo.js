import React from "react";
import { makeStyles, Grid, Avatar } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    avatarContainer: {
        display: "flex",
        flexDirection: "row",
    },
}));

function PlayerInfo(props) {
    const classes = useStyles();

    return (
        <>
            <Grid item xs={2}>
                <h2>Word Master</h2>
                <Avatar style={{ backgroundColor: "green" }}>
                    {props.wordMaster.substring(0, 2)}
                </Avatar>
            </Grid>
            <Grid item xs={10}>
                <h2>Word Detectives</h2>
                <div className={classes.avatarContainer}>
                    {props.wordDetectives.map((detective) => (
                        <Avatar key={detective}>
                            {detective.substring(0, 2)}
                        </Avatar>
                    ))}
                </div>
            </Grid>
        </>
    );
}

export default PlayerInfo;
