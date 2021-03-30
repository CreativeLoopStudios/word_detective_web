import React from "react";
import { makeStyles, Grid, Avatar, Badge } from "@material-ui/core";
import PlayerStatus from "../player_status";

const useStyles = makeStyles((theme) => ({
    avatarContainer: {
        display: "flex",
        flexDirection: "row"
    },
    avatarItem: {
        marginRight: 16
    }
}));

function PlayerInfo({ wordMaster, word, wordDetectives, category, host, rounds }) {
    const classes = useStyles();

    return (
        <>
            {
                category.name &&
                <Grid item xs={12}>
                    <h2>Categoria Selecionada</h2>
                    <p>{category.name}</p>
                </Grid>
            }

            <Grid item xs={12}>
                <h2>Rodada</h2>
                <p>{rounds + 1}</p>
            </Grid>

            <Grid item xs>
                <h2>Word Master</h2>
                <Badge color={wordMaster.status === PlayerStatus.CONNECTED ? 'primary' : 'secondary'} variant="dot">
                    <Avatar style={{ backgroundColor: "green" }}>
                        {wordMaster.id === host.id && "*"}
                        {wordMaster && wordMaster.name.substring(0, 2)}
                    </Avatar>
                </Badge>
                Score: <b>{(wordMaster && wordMaster.score) || 0}</b>
                {word && (
                    <>
                    <br />
                    Word: <b>{word}</b>
                    </>
                )}
            </Grid>
            <Grid item xs>
                <h2>Word Detectives</h2>
                <div className={classes.avatarContainer}>
                    {wordDetectives
                        .map(detective => (
                        <div className={classes.avatarItem} key={detective.id}>
                            <Badge color={detective.status === PlayerStatus.CONNECTED ? 'primary' : 'secondary'} variant="dot">
                                <Avatar>
                                    {detective.id === host.id && "*"}
                                    {detective.name.substring(0, 2)}
                                </Avatar>
                            </Badge>
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
