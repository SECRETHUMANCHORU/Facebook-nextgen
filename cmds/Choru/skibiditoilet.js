const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "skibiditoilet",
    description: "skibiditoilet series",
    tutorial: "Skibiditoilet search episode",
    author: "Choru",
    prefix: true
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports.run = async ({ api, event, input }) => {
    const epNumber = input;

    if (!epNumber || isNaN(epNumber)) {
        return api.sendMessage("Please provide a valid episode number.", event.threadID, event.messageID);
    }

    let result;

    try {
        result = await api.skibiditoilet(epNumber);
    } catch (error) {
        return api.sendMessage("Failed to retrieve data.", event.threadID, event.messageID);
    }

    if (result && result.data && result.info) {
        const baseTime = 3000;
        await sleep(baseTime);

        const tmpFolderPath = path.join(__dirname, '../cache');

        if (!fs.existsSync(tmpFolderPath)) {
            fs.mkdirSync(tmpFolderPath);
        }

        const videoResponse = await axios.get(result.data.videoURL, { responseType: 'arraybuffer' });
        const videoPath = path.join(tmpFolderPath, 'video.mp4');

        fs.writeFileSync(videoPath, Buffer.from(videoResponse.data, 'binary'));

        const messageBody = `Title: ${result.info.title}\nDescription: ${result.info.description}`;

        await api.sendMessage({
            body: messageBody,
            attachment: fs.createReadStream(videoPath)
        }, event.threadID);

        fs.unlinkSync(videoPath);
    } else {
        return api.sendMessage("No data found for the provided episode number.", event.threadID, event.messageID);
    }
};
