const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "imgsearch",
    description: "Search for images related to a query.",
    author: "shiki",
    prefix: true
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports.run = async ({ api, input, event }) => {
    try {
        const query = input;

        if (!query) {
            api.sendMessage("Please provide a query to search for images...", event.threadID, event.messageID);
            return;
        }

        const imageResponse = await axios.get(`https://api-v2.jrtxtracy.repl.co/v2/crawl/yahoo-image?s=${encodeURIComponent(query)}`);

        if (imageResponse.data.status === 200) {
            const u = imageResponse.data.data;

            if (u.count > 0) {
                const randomIndex = Math.floor(Math.random() * u.count);
                const res = await axios.get(u.url_image[randomIndex], { responseType: "stream" });

                if (res.status === 200) {
                    const imagePath = path.join(__dirname, '..', 'cache', 'image_search.png');

                    const messageText = "Here's an image related to your query:";
                    
                    res.data.pipe(fs.createWriteStream(imagePath));
                    
                    res.data.on('end', async () => {
                        await sleep(1000);

                        api.sendMessage({
                            body: messageText,
                            attachment: fs.createReadStream(imagePath)
                        }, event.threadID, () => fs.unlinkSync(imagePath));
                    });
                } else {
                    api.sendMessage("An error occurred while retrieving the image.", event.threadID, event.messageID);
                }
            } else {
                api.sendMessage("No images found for the given query.", event.threadID, event.messageID);
            }
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while searching for images...", event.threadID, event.messageID);
    }
};
