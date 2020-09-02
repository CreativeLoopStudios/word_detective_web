import React from "react";
import { makeStyles, Grid, Avatar } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    avatarContainer: {
        display: "flex",
        flexDirection: "row"
    },
    avatarItem: {
        marginRight: 16
    }
}));

function PlayerInfo(props) {
    const classes = useStyles();

    const renderScore = (name) => {
        const playerFound = props.players.find((p) => p.name === name);
        if (playerFound) {
            return playerFound.score;
        }
        return 0;
    };

    return (
        <>
            <Grid item xs={2}>
                <h2>Word Master</h2>
                <Avatar style={{ backgroundColor: "green" }}>
                    {props.wordMaster.substring(0, 2)}
                </Avatar>
                Score: <b>{renderScore(props.wordMaster)}</b>
                {props.word && (
                    <>
                    <br />
                    Word: <b>{props.word}</b>
                    </>
                )}
            </Grid>
            <Grid item xs={10}>
                <h2>Word Detectives</h2>
                <div className={classes.avatarContainer}>
                    {props.wordDetectives.map((detective) => (
                        <div className={classes.avatarItem} key={detective}>
                            <Avatar>
                                {detective.substring(0, 2)}
                            </Avatar>
                            <span>
                                Score: <b>{renderScore(detective)}</b>
                            </span>
                        </div>
                    ))}
                </div>
            </Grid>
        </>
    );
}

export default PlayerInfo;
