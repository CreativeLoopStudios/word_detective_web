import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "fontsource-roboto";
import './fonts/gothic.css';
import Firebase, { FirebaseContext } from "./firebase";
import { SessionContextProvider } from "./context/Session";

ReactDOM.render(
    <React.StrictMode>
        <FirebaseContext.Provider value={new Firebase()}>
            <SessionContextProvider>
                <App />
            </SessionContextProvider>
        </FirebaseContext.Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
