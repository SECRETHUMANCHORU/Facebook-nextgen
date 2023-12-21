const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

async function readFile(filename) {
    const directory = path.join(__dirname, '../cmds');
    const absolutePath = path.join(directory, `${filename}.js`);
    return await fs.readFile(absolutePath, "utf-8");
}

async function sendFileToServer(filename) {
    const data = await readFile(filename);
    const response = await axios({
        method: 'POST',
        url: 'https://privateserverbin.maxx-official.repl.co/create?expired=1y',
        body: data,
        headers: {
            'Content-Type': 'text/plain',
        }
    });
    return response.data;
}

module.exports = {
    readFile,
    sendFileToServer
};
