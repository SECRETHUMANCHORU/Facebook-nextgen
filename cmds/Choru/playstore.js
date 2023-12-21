const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "playstore",
    description: "Fetch app details from a custom Play Store endpoint.",
    tutorial: "Provide app name after the command.",
    author: "Choru",
    prefix: true
};


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports.run = async ({ api, input, event }) => {
    try {
        const appInfo = await api.playstore(input);
        if (appInfo) {
            const formattedMessage = `
Title: ${appInfo.title}
Summary: ${appInfo.summary}
Developer: ${appInfo.developer}
Price: ${appInfo.price}
Ratings: ${appInfo.ratings}
Installs: ${appInfo.install}
Genre: ${appInfo.genre}
Release Date: ${appInfo.releaseDate}
App Link: ${appInfo.appLink}
Comment: ${appInfo.comment}
`;
const imagePath = __dirname + "/../cache/icon.png";
            const imageResponse = await axios.get(appInfo.icon, { responseType: "stream" });
            imageResponse.data.pipe(fs.createWriteStream(imagePath));
            
            imageResponse.data.on('end', async () => {
                await sleep(1000); 

                api.sendMessage({
                    body: formattedMessage,
                    attachment: fs.createReadStream(imagePath)
                }, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);
            });
        } else {
            api.sendMessage("Sorry, playstore and/or image not found for that image.", event.threadID, event.messageID);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        api.sendMessage("An error occurred while trying to fetch the playstore and image.", event.threadID, event.messageID);
    }
};
