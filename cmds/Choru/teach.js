module.exports.config = {
	name: "teach",
	description: "simsimi fun",
	tutorial: "teach hi | hello",
    author: "Choru",
    prefix: true
};

module.exports.run = async ({ api, event,input }) => {
const axios = require ("axios");
let text = input;
  const text1 = text.substr(0, text.indexOf(' | ')); 
  const length = parseInt(text1.length)
  const text2 = text.split(" | ").pop()
  const length_2 = parseInt(text2.length)
const res = await axios.get(`https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/teach?text1=${text1}&text2=${text2}`);
var ask = res.data.result;

return api.sendMessage(`Your ask: ${text1}\nSim respond: ${text2}`, event.threadID, event.messageID)
}