const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const cookiesDirectory = 'fbstate';
const optionsDirectory = 'options';

function getConfigForThread(threadID) {
    const configs = loadConfigurations();
    return configs[0];
}

function loadConfigurations() {
    const configPath = path.join(__dirname, '..', optionsDirectory, 'config.json');
    let configs = [];

    if (fs.existsSync(configPath)) {
        try {
            configs = require(configPath);
        } catch (err) {
            fs.writeFileSync(configPath, JSON.stringify([], null, 4));
            return [];
        }
    } else {
        fs.writeFileSync(configPath, JSON.stringify([], null, 4));
    }

    // Iterate through configs and filter out those where the fb doesn't exist
    configs = configs.filter(config => fs.existsSync(path.join(__dirname, '..', config.fb)));

    // If any config was removed, update the file
    if (configs.length === 0) {
        fs.writeFileSync(configPath, JSON.stringify([], null, 4));
    }

    return configs;
}

function clearConfiguration(config) {
    const configPath = path.join(__dirname, '..', optionsDirectory, 'config.json');
    let existingConfigs = [];

    if (fs.existsSync(configPath)) {
        try {
            existingConfigs = require(configPath);
        } catch (err) {
            fs.writeFileSync(configPath, JSON.stringify([], null, 4));
            return;
        }
    }

    const updatedConfigs = existingConfigs.filter(cfg => cfg.fb !== config.fb);
    fs.writeFileSync(configPath, JSON.stringify(updatedConfigs, null, 4));
}

module.exports = {
    loadConfigurations,
    getConfigForThread,
    clearConfiguration
};
