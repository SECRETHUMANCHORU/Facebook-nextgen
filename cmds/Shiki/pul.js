const axios = require("axios");
module.exports.config = {
    name: "pul",
    description: "puku",
    tutorial: "pul",
    author: "Shiki",
    prefix: true
};

module.exports.run = async ({ api, event }) => {

    try {
        const res = await axios.get(`https://api.popcat.xyz/pickuplines`);
        
        if (res.data && res.data.pickupline) {
            const pickupLine = res.data.pickupline;
            api.sendMessage(pickupLine, event.threadID, event.messageID);
        } else {
            api.sendMessage("Sorry, there was an issue getting a pickup line.", event.threadID, event.messageID);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        api.sendMessage("An error occurred while trying to fetch the pickup line.", event.threadID, event.messageID);
    }
};
