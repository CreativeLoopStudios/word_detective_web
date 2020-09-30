import app from "firebase/app";
import "firebase/firestore";

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
    }

    getCollection = (collection_name, id) => {
        if (id) return this.db.collection(collection_name).doc(id);
        return this.db.collection(collection_name);
    };

    getItemById = async (collection_name, id) => {
        return await this.db.collection(collection_name).doc(id).get();
    };

    updateById = async (collection_name, id, value) => {
        await this.db.collection(collection_name).doc(id).update(value);
    };

    createNewRoom = async (categories) => {
        const res = await this.db.collection('rooms').add({
            host: '',
            state: '',
            players: [],
            categories: categories,
            turns: 0,
            word_detectives: [],
            word_master: '',
            rounds: 0,
            word_of_the_round: '',
            category_of_the_round: {},
            questions: [],
            heartbeats: {},
            question_answered: null,
            clues: []
        });
        return res.id;
    };
}

export default Firebase;