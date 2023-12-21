const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const googlethis = require("googlethis");

module.exports.config = {
    name: "gsimg",
    description: "search image",
    tutorial: "Type an image name after the command.",
    author: "Choru",
    prefix: true
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports.run = async ({ api, input, event }) => {
    try {
        const images = await googlethis.image('The Wolf Among Us', { safe: false });

        if (images && images.length > 0) {
            const firstImageURL = images[0].url;
            const formattedMessage = `Image title: ${images[0].origin.title}\nWebsite: ${images[0].origin.website.name}\nURL: ${images[0].origin.website.url}`;

            const imagePath = path.join(__dirname, '../cache/image.jpg');
            const imageResponse = await axios.get(firstImageURL, { responseType: "stream" });
            imageResponse.data.pipe(fs.createWriteStream(imagePath));

            imageResponse.data.on('end', async () => {
                await sleep(1000);

                api.sendMessage({
                    body: formattedMessage,
                    attachment: fs.createReadStream(imagePath)
                }, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);
            });
        } else {
            api.sendMessage("No images found.", event.threadID, event.messageID);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        api.sendMessage("An error occurred while fetching the image.", event.threadID, event.messageID);
    }
};
