import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/database";
import "firebase/compat/analytics";
import "firebase/compat/auth";
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
    db: firebase.firestore.Firestore;
    realtimeDb: firebase.database.Database;
    analytics: firebase.analytics.Analytics;

    constructor() {
        firebase.initializeApp(firebaseConfig);
        this.db = firebase.firestore();
        this.realtimeDb = firebase.database();
        this.analytics = firebase.analytics();
    }

    getCollection = (collection_name: string): firebase.firestore.CollectionReference => {
        return this.db.collection(collection_name);
    };

    getCollectionByDocId = (collection_name: string, id: string): firebase.firestore.DocumentReference => {
        return this.db.collection(collection_name).doc(id);
    };

    getRlCollection = (collection_name: string, id: string): firebase.database.Reference => {
        if (id) return this.realtimeDb.ref(collection_name + '/' + id);
        return this.realtimeDb.ref(collection_name);
    };

    getItemById = async (collection_name: string, id: string): Promise<firebase.firestore.DocumentSnapshot> => {
        return await this.db.collection(collection_name).doc(id).get();
    };

    getTimestampNow = () => {
        return firebase.firestore.Timestamp.now();
    };

    getServerTimestamp = () => {
        return firebase.database.ServerValue.TIMESTAMP;
    };

    pushToList = async (collection_name: string, id: string, key: string, value: any): Promise<void> => {
        await this.realtimeDb.ref(`${collection_name}/${id}/${key}`).push(value);
    };

    updateById = async (collection_name: string, id: string, value: any): Promise<void> => {
        await this.db.collection(collection_name).doc(id).update(value);
    };

    updateRlById = async (collection_name: string, id: string, value: any): Promise<void> => {
        await this.realtimeDb.ref(collection_name + '/' + id).update(value);
    };

    onDisconnect = async (roomId: string, playerId: string): Promise<void> => {
        this.realtimeDb.ref(`rooms/${roomId}/players/${playerId}/status`).onDisconnect().set(PlayerStatus.DISCONNECTED);
    };

    updateRoom = async (roomId: string, data: any): Promise<void> => {
        await this.db.collection(ROOMS_COLLECTION).doc(roomId).update(data);
        await this.realtimeDb.ref(ROOMS_COLLECTION + '/' + roomId).update({ categories: data.categories });
    }

    createNewRoom = async (creatorId: string): Promise<string> => {
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

    logEvent = (event: string, value: any): void => {
        this.analytics.logEvent(event, value);
    };

    signIn = async (sessionCtx: any): Promise<string | null> => {
        console.log('Setting up playerId');
        const userCred = await firebase.auth().signInAnonymously();
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
            await currentUser.updateProfile({
                displayName: sessionCtx.state.playerName
            })
        }
        console.log('signup done')
        let userId = null;
        if (userCred.user) {
            userId = userCred.user.uid;
            sessionCtx.dispatch({
                type: SET_PLAYER_ID,
                payload: userId
            });
            sessionCtx.dispatch({
                type: SET_FIREBASE_USER,
                payload: userCred
            });
        }
        
        return userId;
    };

    updateDisplayName = async (newName: string): Promise<void> => {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
            await currentUser.updateProfile({
                displayName: newName
            });
        }
    };
}

export default Firebase;