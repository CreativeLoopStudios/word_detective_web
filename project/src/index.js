import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "fontsource-roboto";
import * as firebase from "firebase/app";
import "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyANA60wHv9J53cD_w7OgQ8yrM1bQ8h9igg",
    authDomain: "whoami-dev-d4380.firebaseapp.com",
    databaseURL: "https://whoami-dev-d4380.firebaseio.com",
    projectId: "whoami-dev-d4380",
    storageBucket: "whoami-dev-d4380.appspot.com",
    messagingSenderId: "375277764180",
    appId: "1:375277764180:web:4e4cefb08e406dc086b7c1",
    measurementId: "G-F5FBELCV0C",
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
