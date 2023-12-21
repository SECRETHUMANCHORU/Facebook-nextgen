const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const googlethis = require("googlethis");

module.exports.config = {
    name: "dictionary",
    description: "Search for a dictionary definition and play its pronunciation.",
    tutorial: "Type a word after the command.",
    author: "Choru",
    prefix: true
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports.run = async ({ api, input, event }) => {
    try {
        const searchResult = await googlethis.search('meaning of ' + input);

        if (searchResult && searchResult.dictionary) {
            const audio = searchResult.dictionary.audio;
            const dictionary = searchResult.dictionary;
            
            const word = dictionary.word;
            const phonetic = dictionary.phonetic;
            const definition = dictionary.definitions[0];
            const example = dictionary.examples[0] || 'Not found';

            const formattedMessage = `
Word: ${word}
Phonetic: ${phonetic}
Definition: ${definition}
Example: ${example}
`;

            const voicePath = path.join(__dirname, '../cache/voice.mp3');
            const voiceResponse = await axios.get(audio, { responseType: "stream" });
            voiceResponse.data.pipe(fs.createWriteStream(voicePath));

            voiceResponse.data.on('end', async () => {
                await sleep(1000);

                api.sendMessage({
                    body: formattedMessage,
                    attachment: fs.createReadStream(voicePath)
                }, event.threadID, () => fs.unlinkSync(voicePath), event.messageID);
            });
        } else {
            api.sendMessage("Sorry, definition and/or pronunciation not found for the given word.", event.threadID, event.messageID);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        api.sendMessage("An error occurred while trying to fetch the definition and pronunciation.", event.threadID, event.messageID);
    }
};
