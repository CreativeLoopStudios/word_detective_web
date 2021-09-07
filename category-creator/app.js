const admin = require('firebase-admin');

const serviceAccount = require("./serviceAccountKey.json");
const CATEGORIES_KEY = 'categories';
const PROJECT_ID = process.env.PROJECT_ID;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${PROJECT_ID}-default-rtdb.firebaseio.com`
});

const db = admin.firestore();

const categories = require('./categories.json');

const fetchCategories = async () => {
    return await db.collection(CATEGORIES_KEY).get();
};

fetchCategories()
    .then((snapshot) => {
        let dbCategories = [];
        snapshot.forEach(doc => {
            dbCategories.push({ id: doc.id, ...doc.data() });
        });

        categories.forEach(jsonCategory => {
            const dbCategoryFound = dbCategories.find(c => c.name === jsonCategory.name);
            if (dbCategoryFound != null) {
                const dbCategoryToUpdate = db.collection(CATEGORIES_KEY).doc(dbCategoryFound.id);
                dbCategoryToUpdate.set(jsonCategory);
                console.log(`Updated category ${jsonCategory.name}`);
            } else {
                let docRef = db.collection(CATEGORIES_KEY)
                    .add(jsonCategory);
                console.log(`Added category ${jsonCategory.name}`);
            }
        });
    });
