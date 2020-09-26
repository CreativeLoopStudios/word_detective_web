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
    const { wordMaster, word, wordDetectives, players } = props;
    const wordMasterInfo = players.find(p => p.id === wordMaster);

    return (
        <>
            <Grid item xs={2}>
                <h2>Word Master</h2>
                <Avatar style={{ backgroundColor: "green" }}>
                    {wordMasterInfo && wordMasterInfo.name.substring(0, 2)}
                </Avatar>
                Score: <b>{(wordMasterInfo && wordMasterInfo.score) || 0}</b>
                {word && (
                    <>
                    <br />
                    Word: <b>{word}</b>
                    </>
                )}
            </Grid>
            <Grid item xs={10}>
                <h2>Word Detectives</h2>
                <div className={classes.avatarContainer}>
                    {wordDetectives
                        .map(detectiveId => players.find(p => p.id === detectiveId))
                        .map(detective => (
                        <div className={classes.avatarItem} key={detective.id}>
                            <Avatar>
                                {detective.name.substring(0, 2)}
                            </Avatar>
                            <span>
                                Score: <b>{detective.score}</b>
                            </span>
                        </div>
                    ))}
                </div>
            </Grid>
        </>
    );
}

export default PlayerInfo;
