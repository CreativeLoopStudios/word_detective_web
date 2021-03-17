import React, { useEffect } from "react";

import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Home, Lobby, Game, Login } from "./screens";
import theme from "./themes";
import { Background } from "./components";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

function App() {
    const classes = useStyles();

    useEffect(() => {
        window.addEventListener("beforeunload", (ev) => {
            ev.preventDefault();
            const confirmationMessage =
                "Você tem certeza que gostaria de sair?";
            ev.returnValue = confirmationMessage;
            return confirmationMessage;
        });
    }, []);

    return (
        <Router>
            <ThemeProvider theme={theme}>
                <Background>
                    <CssBaseline />
                    <Container maxWidth="lg">
                        <AppBar position="static">
                            <Toolbar>
                                <IconButton
                                    edge="start"
                                    className={classes.menuButton}
                                    color="inherit"
                                    aria-label="menu"
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Typography
                                    variant="h6"
                                    className={classes.title}
                                >
                                    Word Detective Online
                                </Typography>
                            </Toolbar>
                        </AppBar>

                        <Switch>
                            <Route path="/:roomId/game">
                                <Game />
                            </Route>
                            <Route path="/:roomId/lobby">
                                <Lobby />
                            </Route>
                            <Route path="/login">
                                <Login />
                            </Route>
                            <Route path="/">
                                <Home />
                            </Route>
                        </Switch>
                    </Container>
                </Background>
            </ThemeProvider>
        </Router>
    );
}

export default App;
