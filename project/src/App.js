import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { RegisterUser, Lobby, Game, CreateRoom } from "./screens";

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

    return (
        <Router>
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
                        <Typography variant="h6" className={classes.title}>
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
                    <Route path="/create-room">
                        <CreateRoom />
                    </Route>
                    <Route path="/">
                        <RegisterUser />
                    </Route>
                </Switch>
            </Container>
        </Router>
    );
}

export default App;
