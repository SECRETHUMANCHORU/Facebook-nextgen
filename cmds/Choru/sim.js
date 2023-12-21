module.exports.config = {
	name: "sim",
	description: "simsimi fun",
	tutorial: "sim [text]",
    author: "Choru",
    prefix: true
};

module.exports.run = async ({ api, event,input }) => {
const axios = require ("axios");
let timkiem = input;
const res = await axios.get(`https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/sim?ask=${timkiem}`);
var sim = res.data.result;
return api.sendMessage(`${sim}`, event.threadID, event.messageID)
}

