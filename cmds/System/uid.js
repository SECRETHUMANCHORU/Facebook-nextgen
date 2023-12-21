const fs = require('fs');
const path = require('path');
const request = require('request');  // Ensure you have this library installed

module.exports.config = {
    name: "fbid",
    description: "fbid details from Facebook.",
    tutorial: "fbid @mention or fbid",
    author: "System",
    prefix: true
};

module.exports.run = async ({ api, event, input }) => {
    try {
      //const botId = api.getCurrentUserID();
        let targetID = `${input || event.senderID}`; 
        if (Object.keys(event.mentions).length > 0) {
            targetID = Object.keys(event.mentions)[0]; 
        }

        const userMapping = await api.getUserInfo(targetID);
        const userInfo = userMapping[targetID];

        if (userInfo) {
          const selfID = api.getCurrentUserID()
            const formattedInfo = `UID: ${userInfo.uid}`;

            api.sendMessage(formattedInfo, event.threadID);
        } else {
            api.sendMessage("Couldn't fetch user information.", event.threadID);
        }
    } catch (err) {
        api.sendMessage("An error occurred while fetching user info.", event.threadID);
    }
};
