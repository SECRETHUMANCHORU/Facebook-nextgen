module.exports.config = {
    name: "bard",
    description: "asking bard",
    tutorial: "bard input",
    author: "Choru",
    prefix: true
};

module.exports.run = async ({ api, event, input }) => {
  
   /* if (!global.config.adminbot.includes(event.senderID)) {
        return api.sendMessage('You are not authorized to use this command.', event.threadID, event.messageID);
    }*/

    let result;
    try {
        result = await api.bard(input);
    } catch (error) {
        return api.sendMessage("Failed to retrieve data from bard.", event.threadID, event.messageID);
    }
    return api.sendMessage(result, event.threadID);
};
