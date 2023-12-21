module.exports.config = {
	name: "emoji",
	description: "emoji type ",
	tutorial: "emoji bat malungkot beshy ko | 🤸",
    author: "Choru",
    prefix: true
};

module.exports.run = async ({ api, event, input }) => {
  const text = input;
const text1 = text.substr(0, text.indexOf(' | ')); 
  const length = parseInt(text1.length)
  const text2 = text.split(" | ").pop()
  const length_2 = parseInt(text2.length)
const pogi = (t) => t.trim().replace(/(\W+)|(1S+)/g, ' ').split(' ').filter(e => e).join(` ${text2} `);
  const result = pogi(text1);
return api.sendMessage(`${result}`, event.threadID, event.messageID)
}
