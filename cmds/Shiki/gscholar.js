const axios = require('axios');

module.exports.config = {
    name: "gscholar",
    description: "gscholar ask",
    tutorial: "gscholar input",
    author: "Shiki",
    prefix: true
};



module.exports.run = async ({ api, event, input }) => {
  const args = input;
  if (!args) {
    return api.sendMessage("Please provide a query for gscholar.", event.threadID, event.messageID);
  }

  let result;
  try {
    result = await api.gscholar(args);
  } catch (error) {
    return api.sendMessage("Failed to retrieve data from gscholar.", event.threadID, event.messageID);
  }

  if (result && result.length > 0) {
    let responseMessage = "Here are the answers from gscholar:\n\n";
    for (const answer of result) {
      responseMessage = `Title: ${answer.title}\nDescription: ${answer.description}\nAuthors: ${answer.authors ? answer.authors.join(", ") : "Not available"}\nPublication: ${answer.publication}\nURL: ${answer.url}\nCitation URL: ${answer.citationUrl}\nRelated URL: ${answer.relatedUrl}\n-------------------------\n`;
    }
    return api.sendMessage(responseMessage, event.threadID, event.messageID);
  } else {
    return api.sendMessage("No answer found in the response.", event.threadID, event.messageID);
  }
};
