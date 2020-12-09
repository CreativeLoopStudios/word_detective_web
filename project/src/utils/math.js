function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
}

const random = Math.random;

export default {
    randomInt,
    random
};