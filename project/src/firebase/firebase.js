import app from "firebase/app";
import "firebase/firestore";
import "firebase/database";
import "firebase/analytics";
import "firebase/auth";
import { ROOMS_COLLECTION } from "./collections";
import PlayerStatus from "../player_status";
import { SET_PLAYER_ID, SET_FIREBASE_USER } from '../actions';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);
        this.db = app.firestore();
        this.realtimeDb = app.database();
        this.analytics = app.analytics();
    }

    getCollection = (collection_name, id) => {
        if (id) return this.db.collection(collection_name).doc(id);
        return this.db.collection(collection_name);
    };

    getRlCollection = (collection_name, id) => {
        if (id) return this.realtimeDb.ref(collection_name + '/' + id);
        return this.realtimeDb.ref(collection_name);
    };

    getItemById = async (collection_name, id) => {
        return await this.db.collection(collection_name).doc(id).get();
    };

    pushToList = async (collection_name, id, key, value) => {
        await this.realtimeDb.ref(collection_name + '/' + id + '/' + key).push(value);
    };

    updateById = async (collection_name, id, value) => {
        await this.db.collection(collection_name).doc(id).update(value);
    };

    updateRlById = async (collection_name, id, value) => {
        await this.realtimeDb.ref(collection_name + '/' + id).update(value);
    };

    onDisconnect = async (roomId, playerId) => {
        this.realtimeDb.ref(`rooms/${roomId}/players/${playerId}/status`).onDisconnect().set(PlayerStatus.DISCONNECTED);
    };

    updateRoom = async (roomId, data) => {
        await this.db.collection(ROOMS_COLLECTION).doc(roomId).update(data);
        await this.realtimeDb.ref(ROOMS_COLLECTION + '/' + roomId).update({ categories: data.categories });
    }

    createNewRoom = async (creatorId) => {
        const res = await this.db.collection(ROOMS_COLLECTION).add({ createdBy: creatorId, is_private: true });

        await this.realtimeDb.ref(ROOMS_COLLECTION + '/' + res.id).set({
            state: '',
            players: {},
            heartbeats: {},
            turns: 0,
            rounds: 0,
            word_of_the_round: '',
            category_of_the_round: {},
            playerWhoDiscoveredWord: null,
            questions: {},
            question_answered: null,
            clues: {}
        });

        return res.id;
    };

    logEvent = (event, value) => {
        this.analytics.logEvent(event, value);
    };

    signIn = async (sessionCtx) => {
        console.log('Setting up playerId');
        const userCred = await app.auth().signInAnonymously();
        await app.auth().currentUser.updateProfile({
            displayName: sessionCtx.state.playerName
        })
        console.log('signup done')
        const userId = userCred.user.uid;
        sessionCtx.dispatch({
            type: SET_PLAYER_ID,
            payload: userId
        });
        sessionCtx.dispatch({
            type: SET_FIREBASE_USER,
            payload: userCred
        });
        return userId;
    };

    updateDisplayName = async (newName) => {
        await app.auth().currentUser.updateProfile({
            displayName: newName
        });
    };
}

export default Firebase;