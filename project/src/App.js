import React, { useEffect } from "react";

import {
    Grid,
    CssBaseline,
    Container,
    makeStyles,
    ThemeProvider,
} from "@material-ui/core";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Lobby, Game, Login } from "./screens";
import theme from "./themes";
import { Background, Footer } from "./components";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: "10rem",
    },
}));

function App() {
    const classes = useStyles();

    useEffect(() => {
        // window.addEventListener("beforeunload", (ev) => {
        //     ev.preventDefault();
        //     const confirmationMessage =
        //         "Você tem certeza que gostaria de sair?";
        //     ev.returnValue = confirmationMessage;
        //     return confirmationMessage;
        // });
    }, []);

    return (
        <Router>
            <ThemeProvider theme={theme}>
                <Background>
                    <CssBaseline />
                    <Container disableGutters className={classes.root}>
                        <Grid container justify="center" spacing={2}>
                            <Grid item xs={8}>
                                <Switch>
                                    <Route path="/:roomId/game">
                                        <Game />
                                    </Route>
                                    <Route path="/:roomId/lobby">
                                        <Lobby />
                                    </Route>
                                    <Route path="/">
                                        <Login />
                                    </Route>
                                </Switch>
                            </Grid>
                            <Grid item xs={12}>
                                <Footer />
                            </Grid>
                        </Grid>
                    </Container>
                </Background>
            </ThemeProvider>
        </Router>
    );
}

export default App;
