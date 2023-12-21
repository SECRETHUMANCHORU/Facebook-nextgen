const axios = require('axios');

module.exports.config = {
    name: "gogpt",
    description: "gogpt ask",
    tutorial: "gogpt input",
    author: "Shiki",
    prefix: true
};

module.exports.run = async ({ api, event, input }) => {
    let result;
    try {
        result = await api.gogpt(input);
    } catch (error) {
        return api.sendMessage("Failed to retrieve data from gogpt.", event.threadID, event.messageID);
    }
    return api.sendMessage(result, event.threadID, event.messageID);
}
