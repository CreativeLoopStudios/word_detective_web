import React from "react";
import { useHistory } from "react-router-dom"
import {
  makeStyles,
  Button,
  Grid,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
      display: "flex",
      flex: 1,
  },
}));

function Home() {
  const history = useHistory();
  const classes = useStyles();

  return (
    <div className={classes.root}>
        <Grid container spacing={3} direction="row">
            <Grid item xs={12}>
                <h1>Home</h1>
            </Grid>

            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => history.push("/create-room")}
                >
                    Criar Sala
                </Button>
            </Grid>
        </Grid>
    </div>
);
}

export default Home;