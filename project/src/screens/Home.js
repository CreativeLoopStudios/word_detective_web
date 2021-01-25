import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom"
import {
  makeStyles,
  Button,
  Grid,
  TextField
} from "@material-ui/core";
import SessionContext from "../context/Session";
import { withFirebase } from "../firebase/context";

const useStyles = makeStyles((theme) => ({
  root: {
      display: "flex",
      flex: 1,
  },
}));

function Home(props) {
  const history = useHistory();
  const classes = useStyles();
  const { firebase } = props;
  const sessionContext = useContext(SessionContext);

  const [playerName, setPlayerName] = useState(sessionContext.state.playerName);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const playerId = await firebase.signIn(sessionContext);
    const roomId = await firebase.createNewRoom(playerId);
    history.push(`/${roomId}/lobby`);
  };

  return (
    <div className={classes.root}>
        <Grid container spacing={3} direction="row">
            <Grid item xs={12}>
                <h1>Home</h1>
            </Grid>

            <Grid item xs={12}>
                <TextField fullWidth label="Seu nome" value={playerName || ''} onChange={(ev) => setPlayerName(ev.target.value)} />
            </Grid>

            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Criar Sala
                </Button>
            </Grid>
        </Grid>
    </div>
);
}

export default withFirebase(Home);