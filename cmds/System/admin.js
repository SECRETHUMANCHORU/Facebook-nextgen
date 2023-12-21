const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../../configbot.json');
let config = require(configPath);

module.exports.config = {
    name: "admin",
    description: "Admin command to manage FBIDs.",
    tutorial: "admin add [FBID or @mention] or admin remove [FBID or @mention].",
    author: "System",
    prefix: true
};

module.exports.run = async ({ api, event, input }) => {
    const args = event.body.split(" ");
    const operation = args[1];
    
    let targetID = `${input || event.senderID}`;
    if (Object.keys(event.mentions).length > 0) {
        targetID = Object.keys(event.mentions)[0];
    }

    // Validate FBID
    if (!/^\d+$/.test(targetID) && operation !== 'list') {
        return api.sendMessage('Invalid FBID provided.', event.threadID, event.messageID);
    }

    if (operation !== 'list' && !config.adminbot.includes(event.senderID)) {
    return api.sendMessage('You are not authorized to perform this action.', event.threadID, event.messageID);
}


    switch (operation) {
        case 'add':
            if (config.adminbot.includes(targetID)) {
                return api.sendMessage('FBID is already in the list.', event.threadID, event.messageID);
            }
            config.adminbot.push(targetID);
            break;

        case 'remove':
            if (!config.adminbot.includes(targetID)) {
                return api.sendMessage('FBID is not in the list.', event.threadID, event.messageID);
            }
            config.adminbot = config.adminbot.filter(id => id !== targetID);
            break;
        
        case 'list': 
            return api.sendMessage(`FBIDs:\n${global.config.adminbot.join(', ')}`, event.threadID, event.messageID);
      
        default:
            return api.sendMessage('Invalid operation. Use "add", "remove", or "list".', event.threadID, event.messageID);
    }

    
    if (['add', 'remove'].includes(operation)) {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
        api.sendMessage(`FBID ${targetID} has been ${operation}ed.`, event.threadID, event.messageID);
    }
};
