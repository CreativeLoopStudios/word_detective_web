import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/firestore";

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

const firebase_db = firebase.firestore();

export default firebase_db;