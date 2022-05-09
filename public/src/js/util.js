export {randomElement, randomId}

const randomId = function () {
    return Math.random().toString(16).substr(2, 16);
}

const randomElement = function (array) {
    let index = Math.floor(Math.random() * array.length);
    return array[index];
};