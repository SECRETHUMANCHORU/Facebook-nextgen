const fs = require('fs');
const path = require('path');
const logger = require('./logger');

let commands = {}; // This will hold loaded commands

function ensureFolderExists(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }
}

function loadCommandsFromDirectory(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const absolutePath = path.join(directory, file);
        if (file.endsWith('.js')) {
            const command = require(absolutePath);
            if (command && command.config && command.config.name) {
                commands[command.config.name] = command;
            } else {
                logger.error(`Command in ${file} does not export a proper configuration.`);
            }
        } else if (fs.statSync(absolutePath).isDirectory()) {
            loadCommandsFromDirectory(absolutePath);
        }
    }
}

function initCommands() {
    loadCommandsFromDirectory(path.join(__dirname, '../cmds'));
    return commands;
}

module.exports = {
    ensureFolderExists,
    initCommands
};
