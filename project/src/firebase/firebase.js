import app from "firebase/app";
import "firebase/firestore";
import "firebase/database";
import { ROOMS_COLLECTION } from "./collections";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_ID,
    measurementId: process.env.REACT_MEASUREMENT_ID,
};

class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);
        this.db = app.firestore();
        this.realtimeDb = app.database();
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

    createNewRoom = async (roomName, numberOfPlayers, categories, isPrivate) => {
        const res = await this.db.collection(ROOMS_COLLECTION).add({
            createdBy: {},
            name: roomName,
            categories: categories,
            number_of_players: numberOfPlayers,
            is_private: isPrivate
        });
        
        this.realtimeDb.ref(ROOMS_COLLECTION + '/' + res.id).set({
            host: '',
            state: '',
            players: {},
            heartbeats: {},
            categories: categories,
            turns: 0,
            word_detectives: {},
            word_master: '',
            rounds: 0,
            word_of_the_round: '',
            category_of_the_round: {},
            questions: {},
            question_answered: null,
            clues: {}
        });

        return res.id;
    };
}

export default Firebase;