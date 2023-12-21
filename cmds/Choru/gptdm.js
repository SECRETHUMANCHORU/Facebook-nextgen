module.exports.config = {
    name: "gptdm",
    description: "asking gpt",
    tutorial: "gptdm input",
    author: "Choru",
    prefix: true
};

module.exports.run = async ({ api, event, input }) => {
    let result;
    try {
        result = await api.gptgo(input);
    } catch (error) {
        return api.sendMessage("Failed to retrieve data from gptdm.", event.threadID, event.threadID, event.messageID);
    }
    return api.sendMessage(result, event.threadID);
}
