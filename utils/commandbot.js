const configbot = require('../configbot.json');
global.config = configbot;
const settings = require('./settings');
const logicFiles = require('./logicfiles');
const commands = logicFiles.initCommands();
const configs = settings.loadConfigurations();
const config = configs[0];  // Assuming you're using the first configuration
const logger = require('./logger');
const fs = require('fs');

function getRandomPrefixMessage(prefix) {
    const essays = [
        `Yes, ${prefix} is my stylish prefix.`,
        `Did you know? The ${prefix} symbol is not just any prefix; it's a style statement.`,
        `Using ${prefix} is like adding a touch of elegance to commands.`,
        `Commands beginning with ${prefix} have a unique charm.`,
        `Every time you use ${prefix}, somewhere a bot smiles with style.`,
    ];

    return essays[Math.floor(Math.random() * essays.length)];
}

function handleMessageEvent(event, api) {
    if (!event.body) {
        //logger.error("Received an event without body!");
        return;
    }

    const args = event.body.trim().split(/ +/);
    let commandName = args.shift().toLowerCase();
    let input = args.join(" ");

    if (commandName.startsWith(config.prefix)) {
        commandName = commandName.slice(config.prefix.length);

        if (commands[commandName] && commands[commandName].config.prefix) {
            logger.info(`Executing command with prefix: ${commandName}`);
            commands[commandName].run({ api, event, input, commands });
        } else {
            api.sendMessage(`𝖢𝗈𝗆𝗆𝖺𝗇𝖽 '${commandName}' 𝗐𝗂𝗍𝗁 𝗉𝗋𝖾𝖿𝗂𝗑 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖴𝗌𝖾 ${config.prefix}𝗁𝖾𝗅𝗉`, event.threadID, event.messageID);
        }
    } else if (commands[commandName] && !commands[commandName].config.prefix) {
        logger.info(`Executing command without prefix: ${commandName}`);
        commands[commandName].run({ api, event, input, commands });
    } else if (event.body.trim() === config.prefix) {
        const response = getRandomPrefixMessage(config.prefix);
        api.sendMessage(response, event.threadID, event.messageID);
    } else {
       // logger.warn("Received a message, but it doesn't match any command structure.");
      const selfID = api.getCurrentUserID();
      const autochatpath ='utils/database/autochat.json'
      const autochat = JSON.parse(fs.readFileSync(autochatpath, 'utf8'));
      if(event.isGroup == true){
        if(autochat.hasOwnProperty(event.threadID)){
          if(autochat[event.threadID] == 1 && event.type == 'message_reply' && selfID == event.messageReply.senderID){
            commands.autochat.run({api, event, input, commands});
          };
        }else{
            autochat[event.threadID] = 0
            fs.writeFileSync(autochatpath, JSON.stringify(autochat, null, 4));
        }
      }else if(event.isGroup == false){
        if (autochat.hasOwnProperty(event.senderID)){
          if (autochat[event.senderID] == 1){
            commands.autochat.run({api, event, input, commands});
          };
        }else{
          autochat[event.threadID] = 0
          fs.writeFileSync(autochatpath, JSON.stringify(autochat, null, 4));
        };
      }
    }

    //api.setMessageReaction("✅", event.messageID, (err) => {}, true);
}

module.exports = {
    handleMessageEvent
};
