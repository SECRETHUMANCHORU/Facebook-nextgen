module.exports.config = {
	name: "quotes",
	description: "quotes greet",
	tutorial: "quote words",
    author: "Choru",
    prefix: true
};
const fs = require("fs");
module.exports.run = async ({ api, event,args }) => {
let quotes = fs.readFileSync(__dirname + '/privatecache/text/quote.sql', 'utf-8').split('\n');
  let quotes1 = quotes[Math.floor(Math.random() * quotes.length)].trim();
return api.sendMessage(`${quotes1}`, event.threadID, event.messageID)
}
