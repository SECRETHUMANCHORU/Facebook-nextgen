const axios = require('axios');
const logicFiles = require('../../utils/searchJs');

module.exports.config = {
    name: "bin",
    description: "Reads a specific JS file based on user input.",
    tutorial: "",
    author: "Choru",
    prefix: true
};

module.exports.run = async ({ api, event, input }) => {
    try {
        const data = await logicFiles.readFile(input);
        const response = await axios.get(`https://privateserverbin.nextgen0.repl.co/createjs?expired=1d&js=${encodeURIComponent(data)}`);
        
        
        const result = response.data.result;

      
        return api.sendMessage(`Content of ${input}\nResult from API:\n${result}`, event.threadID, event.messageID);
    } catch (err) {
        return api.sendMessage(`An error occurred: ${err.message}`, event.threadID, event.messageID);
    }
}
