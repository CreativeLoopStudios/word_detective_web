import React from "react";
import { makeStyles, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    first: {
        color: "#FED700",
    },
    second: {
        color: "#C3C3C3",
    },
    third: {
        color: "#C75A00",
    },
    default: {
        color: "black",
    },
}));

function EndGame(props) {
    const classes = useStyles();

    return (
        <Grid item xs={12}>
            <h3>Pontuação final!</h3>

            <ul>
                {props.players.map((p, index) => {
                    let className = classes.default;
                    switch (index) {
                        case 0:
                            className = classes.first;
                            break;
                        case 1:
                            className = classes.second;
                            break;
                        case 2:
                            className = classes.third;
                            break;
                        default:
                            break;
                    }

                    return (
                        <li className={className} key={index}>
                            <b>{p.name} - Score: {p.score}</b>
                        </li>
                    );
                })}
            </ul>

            <p>FIM DO JOGO! OBRIGADO POR TER JOGADO E PARTICIPADO DESSE PLAYTEST!</p>
        </Grid>
    );
}

export default EndGame;
