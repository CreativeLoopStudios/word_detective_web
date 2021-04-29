function randomInt(min: number, max: number): number {
    return min + Math.floor((max - min) * Math.random());
}

const random: () => number = Math.random;

const math = {
    randomInt,
    random
};

export default math;