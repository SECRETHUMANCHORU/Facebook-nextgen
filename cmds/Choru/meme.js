const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "meme",
    description: "Fetches a random meme with all its details.",
    tutorial: "Type with prefix meme to get a meme.",
    author: "Choru",
    prefix: true
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports.run = async ({ api, input, event }) => {
    try {
        const songName = input;
        const res = await axios.get(`https://meme-api.com/gimme`);
        
        if (res.data) {
            const { 
            postLink,
            subreddit,
            title,
            url,
            nsfw,
            spoiler,
            author,
            ups,
            preview } = res.data;
            const imagePath = __dirname + "/../cache/url.png";
            
            const messageText = `
Title: ${title}
Author: ${author}
Subreddit: ${subreddit}
Upvotes: ${ups}
NSFW: ${nsfw}
Spoiler: ${spoiler}
Link: ${postLink}
        `;
//Previews: ${preview.join(', ')}

            const imageResponse = await axios.get(url, { responseType: "stream" });
            imageResponse.data.pipe(fs.createWriteStream(imagePath));
            
            imageResponse.data.on('end', async () => {
                await sleep(1000); 

                api.sendMessage({
                    body: messageText,
                    attachment: fs.createReadStream(imagePath)
                }, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);
            });
        } else {
            api.sendMessage("Sorry, meme and/or image not found for that song.", event.threadID, event.messageID);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        api.sendMessage("An error occurred while trying to fetch the meme and image.", event.threadID, event.messageID);
    }
};
