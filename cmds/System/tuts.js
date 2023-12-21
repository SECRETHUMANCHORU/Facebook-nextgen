module.exports.config = {
    name: "tuts",
    description: "List all available commands tuts and   commands from a specific author.",
    tutorial: "Type tuts for all commands tuts tuts [author_name] for commands from a specific author.",
    author: "System",
    prefix: true
};

module.exports.run = async ({ api, event, commands }) => {
    const input = event.body.split(" ").slice(1).join(" ");  

    if (input) { 
        let response = `Commands by author '${input}':\n\n`;
        let found = false;

        for (const cmdName in commands) {
            const cmd = commands[cmdName];
            if (cmd.config.author && cmd.config.author.toLowerCase() === input.toLowerCase()) {
                found = true;
                response += `
Name: ${cmd.config.name}
Description: ${cmd.config.description}
Author: ${cmd.config.author ? cmd.config.author : "Not specified"}
Tutorial: ${cmd.config.tutorial}
----------------------
`;
            }
        }

        response += !found ? `No commands found for the author '${input}'.` : "";
        api.sendMessage(response, event.threadID);
        return;
    }
    
    let response = 'Here are the available commands:\n\n';
    for (const cmdName in commands) {
        const cmd = commands[cmdName];
        response += `
Name: ${cmd.config.name}
Description: ${cmd.config.description}
Author: ${cmd.config.author ? cmd.config.author : "Not specified"}
Tutorial: ${cmd.config.tutorial}
----------------------
`;
    }

    api.sendMessage(response, event.threadID);
};
