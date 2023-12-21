const gradient = require('gradient-string');

const successLoading = [
    '#33ff33',
    '#3399ff',
    '#00ccff',
    '#ff9933',
    '#ffff33'
];

const faildedLoading = [
    '#FF0004',
    '#8B0000'
];

const warnLoading = [
    '#ffff33',
    '#ffcc00'
];

const randomGradient = (colorArray) => colorArray[Math.floor(Math.random() * colorArray.length)];

const logger = {};

logger.info = (message) => {
    process.stderr.write(gradient([randomGradient(successLoading), randomGradient(successLoading)])(`[ INFO ] » ${message}\n`));
};

logger.error = (message) => {
    process.stderr.write(gradient([randomGradient(faildedLoading), randomGradient(faildedLoading)])(`[ ERROR ] » ${message}\n`));
};

logger.warn = (message) => {
    process.stderr.write(gradient([randomGradient(warnLoading), randomGradient(warnLoading)])(`[ WARN ] » ${message}\n`));
};

module.exports = logger;
