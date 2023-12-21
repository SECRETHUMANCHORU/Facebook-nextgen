
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "md2",
    description: "Generate image from polination",
    tutorial: "Type with prefix md2 followed by a query to get an image.",
    author: "shiki",
    prefix: true
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports.run = async ({ api, input, event }) => {
    try {
        const query = input;
        const res = await axios.get(`https://api.biswax.dev/image?model=3d&prompt=${encodeURIComponent(query)}`);
        
        if (res.data && res.data.result.length > 0) {
            const imageUrl = res.data.result[0];
            const imagePath = path.join(__dirname, '..', 'cache', 'md2_image.png');
            
            const messageText = "Here's the image you requested:";
            
            const imageResponse = await axios.get(imageUrl, { responseType: "stream" });
            imageResponse.data.pipe(fs.createWriteStream(imagePath));
            
            imageResponse.data.on('end', async () => {
                await sleep(1000); 

                api.sendMessage({
                    body: messageText,
                    attachment: fs.createReadStream(imagePath)
                }, event.threadID, () => fs.unlinkSync(imagePath));
            });
        } else {
            api.sendMessage("No images found.", event.threadID, event.messageID);
        }
    } catch (error) {
        console.error('Error fetching image:', error);
        api.sendMessage("Error fetching image.", event.threadID, event.messageID);
    }
};
                        