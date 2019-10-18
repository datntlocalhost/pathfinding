const random = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomOddNumber = function(min, max) {
    let value = random(min, max);
    if (value % 2 === 0) {
        value = value === max ? value - 1 : value + 1;
    }
    return value;
}

const randomEvenNumber = function(min, max) {
    let value = random(min, max);
    if (value % 2 !== 0) {
        value = value === max ? value - 1 : value + 1;
    }
    return value;
}

const chooseOrientation = function(width, height) {
    if (width > height) {
        return Orientation.VERTICAL;
    } else if (width < height) {
        return Orientation.HORIZONTAL;
    } else {
        return random(0, 1) === 0 ? Orientation.VERTICAL : Orientation.HORIZONTAL;
    }
}

const isOddNumber = function(number) {
    return number % 2 !== 0;
}

const isEvenNumber = function(number) {
    return !isOddNumber(number);
}

const sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}