const axios = require("axios");
const fs = require("fs");

module.exports.config = {
    name: "lyrics",
    description: "View the image and lyrics of a song",
    tutorial: "lyrics",
    author: "shiki",
    prefix: true
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports.run = async ({ api, input, event }) => {
    try {
        const songName = input;
        const res = await axios.get(`https://api.popcat.xyz/lyrics?song=${encodeURIComponent(songName)}`);
        
        if (res.data && res.data.image && res.data.lyrics) {
            const { image, lyrics } = res.data;
            const imagePath = __dirname + "/../cache/image.png";
            
            
            const imageResponse = await axios.get(image, { responseType: "stream" });
            imageResponse.data.pipe(fs.createWriteStream(imagePath));
            
            imageResponse.data.on('end', async () => {
                await sleep(1000); 

                api.sendMessage({
                    body: `Lyrics for "${songName}":\n${lyrics}`,
                    attachment: fs.createReadStream(imagePath)
                }, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);
            });
        } else {
            api.sendMessage("Sorry, lyrics and/or image not found for that song.", event.threadID, event.messageID);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        api.sendMessage("An error occurred while trying to fetch the song lyrics and image.", event.threadID, event.messageID);
    }
};
