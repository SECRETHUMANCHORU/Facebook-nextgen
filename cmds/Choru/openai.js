module.exports.config = {
    name: "openai",
    description: "asking gpt",
    tutorial: "openai input",
    author: "Choru",
    prefix: true
};

const fs = require('fs');

// Define a helper function to get a random element from an array
function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

module.exports.run = async ({ api, event, input }) => {
    const cachepath = "cmds/Joland/replycache.json";
    const cache = JSON.parse(fs.readFileSync(cachepath, 'utf8'));

    try {
        const targetID = `${event.senderID}`;  
        const userMapping = await api.getUserInfo(targetID);
        const userInfo = userMapping[targetID];

        if (!userInfo) {
            console.error("Error: Unable to fetch user info for", targetID);
            return;
        }

        const threadInfo = await api.getThreadInfo(event.threadID);
        const userName = userInfo.name.replace("@", "");
        const userGender = userInfo.gender;  

        if (cache.hasOwnProperty(targetID)) { // changed key to targetID as it seems logical
            const requestBody = (`{\n"prompt": "${input}",\n
"group_chat": "ID": ${threadInfo.threadID} "Name": "${threadInfo.threadName}",\n
"your_last_response": "${cache.key}",\n "language": "Filipino/tagalog",\n
"role": "casual lover, close person",\n "yourGender": "${userGender}",\n
"context": "Your name is ${userName}, what should I reply to that prompt. Your replies should be in a JSON format that simulates a natural conversation with more like a human to human conversation with some flirt but (your response must not be cheesy or corny). And should be as short as possible",\n example type answer ("response": "string")`);

            const chat1 = await api.openai(JSON.stringify(requestBody));
            const resp = JSON.parse(chat1);

            console.log(resp);

            if (resp.hasOwnProperty('response')) {
                cache[targetID] = resp.response;
                fs.writeFileSync(cachepath, JSON.stringify(cache, null, 4));
                return api.sendMessage(resp.response, event.threadID, event.messageID);
            } else if (resp.hasOwnProperty('suggestedUserResponses')) {
                const arr = resp.suggestedUserResponses;
                const randomChoice = getRandomElement(arr);
                cache[targetID] = randomChoice;
                fs.writeFileSync(cachepath, JSON.stringify(cache, null, 4));
                return api.sendMessage(randomChoice, event.threadID, event.messageID);
            }
        }
    } catch (error) {
        console.error(error);
        return api.sendMessage("Failed to retrieve data from OpenAI.", event.threadID, event.messageID);
    }
};
