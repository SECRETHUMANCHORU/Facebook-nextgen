const axios = require('axios');
const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
    name: "bible",
    description: "The 'bible' project is an in-depth and comprehensive database of biblical scriptures, stories, and teachings. Designed to provide easy access to holy verses and guidance, this tool aims to help users deepen their understanding of the Christian faith.",
    tutorial: "bible",
    author: "Choru",
    prefix: true
};

module.exports.run = async ({ api, event, input }) => {
    try {
        const { threadID, senderID, messageID } = event;
        const response = await axios.get("https://labs.bible.org/api/?passage=random&type=json");
        const { bookname, chapter, verse, text } = response.data[0];

        const imageResponse = await axios.get(`https://source.unsplash.com/1600x900/?${bookname},God story`);
        const image = imageResponse.request.res.responseUrl;
        
        const imagePath = path.join(__dirname, '../cache/image.png');

        let callback = function() {
            if (fs.existsSync(imagePath)) {
                api.sendMessage({
                    body: `bookname: ${bookname}\nchapter: ${chapter}\nverse: ${verse}\ntitle: ${text}`,
                    attachment: fs.createReadStream(imagePath)
                }, threadID, () => {
                    fs.unlinkSync(imagePath);
                }, messageID);
            }
        };

        request(encodeURI(image)).pipe(fs.createWriteStream(imagePath)).on("close", callback);
    } catch (err) {
        console.log(err);
        return api.sendMessage(`Error`, threadID);
    }
};
