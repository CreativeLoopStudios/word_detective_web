import firebase_db from '../firebase';

const read = (collection_name) => {
    return firebase_db.collection(collection_name).get();
};

const updateById = async (collection_name, id, value) => {
    await firebase_db.collection(collection_name).doc(id).update(value);
}

export default {
    read,
    updateById
};