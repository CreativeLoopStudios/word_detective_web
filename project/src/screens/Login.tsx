import React, { useState, useContext, MouseEvent, ChangeEvent } from "react";

import { useHistory } from "react-router-dom";

import { Grid } from "@material-ui/core";

import SessionContext from "../context/Session";
import { withFirebase } from "../firebase/context";
import Firebase from "../firebase";
import { Input, Button } from "../components";

type Props = {
    firebase: Firebase
}

function Login({ firebase }: Props) {
    const history = useHistory();
    const sessionContext = useContext(SessionContext);

    const [playerName, setPlayerName] = useState<string>(sessionContext.state.playerName);

    function handleSubmit(event: MouseEvent): void {
        event.preventDefault();
        firebase.signIn(sessionContext)
            .then((playerId) => {
                firebase.createNewRoom(playerId)
                    .then((roomId) => {
                        history.push(`/${roomId}/lobby`);
                    });
            });
    };

    function handleInputName(event: ChangeEvent<HTMLInputElement>): void {
        setPlayerName(event.target.value);
    }

    return (
        <Grid container spacing={3} alignItems="center" direction="column">
            <Grid item>
                <h1>Logo</h1>
            </Grid>

            <Grid container item justify="center">
                <Grid item xs={4}>
                    <Input
                        placeholder=""
                        label="Digite seu nome:"
                        type="text"
                        onChange={handleInputName}
                        value={playerName}
                    />
                </Grid>
            </Grid>

            <Grid item>
                <Button
                    kind="primary"
                    label="Criar Sala"
                    backgroundColor="#ff0000"
                    onClick={handleSubmit}
                />
            </Grid>
        </Grid>
    );
}

export default withFirebase(Login);