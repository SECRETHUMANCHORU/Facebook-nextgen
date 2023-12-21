const axios = require('axios');

module.exports.config = {
    name: "brainly",
    description: "asking Brainly",
    tutorial: "!brainly <question>",
    author: "shiki"
};

module.exports.run = async ({ api, event }) => {
    const question = event.body.slice(event.body.indexOf(' ') + 1);

    if (!question) {
        return api.sendMessage("Please provide a question: !brainly <question>", event.threadID, event.messageID);
    }

    try {
        const res = await axios.get(`https://testapi.heckerman06.repl.co/api/other/brainly?text=${encodeURIComponent(question)}`);
        const data = res.data;

        if (data.question && data.answer) {
            const response = `Question: ${data.question}\nAnswer: ${data.answer}`;
            api.sendMessage(response, event.threadID, event.messageID);
        } else {
            api.sendMessage("No answer found for the given question.", event.threadID, event.messageID);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        api.sendMessage("An error occurred while trying to fetch data from the Brainly API.", event.threadID, event.messageID);
    }
};
