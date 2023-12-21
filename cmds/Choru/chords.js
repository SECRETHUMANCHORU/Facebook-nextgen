module.exports.config = {
	name: "chords",
	description: "search chords",
	tutorial: "chords input",
    author: "Choru",
    prefix: true
};

module.exports.run = async ({ api, event, input }) => {
const tabs = require("ultimate-guitar");
const music = input;
const ris = await tabs.firstData(music);
var title = ris.title

var chords = ris.chords

var type = ris.type

var key = ris.key

var artist = ris.artist
return api.sendMessage(`title: ${title}\ntype: ${type}\nkey: ${key}\nartist: ${artist}\nchords: ${chords}`, event.threadID, event.messageID)
}
