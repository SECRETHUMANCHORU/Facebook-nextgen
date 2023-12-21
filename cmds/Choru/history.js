module.exports.config = {
	name: "history",
	description: "History world",
	tutorial: "History",
    author: "Choru",
    prefix: true
};

module.exports.run = async ({ api, event, args }) => {
const path = require('path');
const fs = require('fs');

var lol = ["ww2", "ww1", "renaissance", "frenchrevolution"]
var jsonps = lol[Math.floor(Math.random() * lol.length)];
const historyData = fs.readFileSync(path.join(__dirname, './privatecache/data', `${jsonps}.json`), 'utf-8');

const history = JSON.parse(historyData);

// Correcting the typo in the JSON
history.forEach(event => {
  event.description = event.description.replace("''", "'");
});

const randomEvent = history[Math.floor(Math.random() * history.length)];

const { date: eventDate, description: eventDescription, lang: eventLang, granularity: eventGranularity, link: eventLinks } = randomEvent;

let firstLinkText, firstLinkUrl;

if (eventLinks && eventLinks.length > 0) {
  firstLinkText = eventLinks[0].text_in_event;
  firstLinkUrl = eventLinks[0].url;
}
api.sendMessage(`Date: ${eventDate}\nDescription: ${eventDescription}\nLanguage: ${eventLang}\nGranularity: ${eventGranularity}\nFirst Link Text: ${firstLinkText}\nFirst Link URL: ${firstLinkUrl}`, event.threadID, event.messageID);
};