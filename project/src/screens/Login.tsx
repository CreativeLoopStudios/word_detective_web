import React, { useState, useContext, MouseEvent } from "react";

import { useHistory } from "react-router-dom";

import { Grid } from "@material-ui/core";

import SessionContext from "../context/Session";
import { withFirebase } from "../firebase/context";
import Firebase from "../firebase";
import { Input, Button, Logo, MainContainer } from "../components";

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
                if (playerId) {
                    firebase.createNewRoom(playerId)
                    .then((roomId) => {
                        history.push(`/${roomId}/lobby`);
                    });
                }
            });
    };

    function handleInputName(text: string): void {
        setPlayerName(text);
    }

    return (
        <MainContainer alignItems="center">
            <Grid container spacing={3} alignItems="center" direction="column">
                <Grid item>
                    <Logo variant="round" size="medium" />
                </Grid>

                <Grid container item justifyContent="center">
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
        </MainContainer>
    );
}

export default withFirebase(Login);