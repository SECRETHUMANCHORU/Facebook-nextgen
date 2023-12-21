module.exports.config = {
	name: "idioms",
description: "The 'idioms' platform is a comprehensive repository of idiomatic expressions from around the world. Designed for language enthusiasts, learners, and educators, it provides detailed explanations, origins, and usage examples for a wide range of idioms, aiding in better understanding and appreciation of diverse linguistic cultures.",
	tutorial: "idioms",
    author: "Choru",
    prefix: true
};

module.exports.run = async ({ api, event, input }) => {
	const idioms = require('idioms');
	idioms.getIdioms(function(idiomsList) {
		const randomIndex = Math.floor(Math.random() * idiomsList.length);
		const randomIdiom = idiomsList[randomIndex];
		api.sendMessage(`${randomIdiom}`, event.threadID, event.messageID);
	});
};
