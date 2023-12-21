const fs = require('fs');
const path = require('path');
const settings = require('../../utils/settings');
const configs = settings.loadConfigurations();

module.exports.config = {
    name: "help",
    description: "List all available commands or commands from a specific author.",
    tutorial: "Type help for all commands or help [author_name] for commands from a specific author.",
    author: "System",
    prefix: true
};

module.exports.run = async ({ api, event }) => {
    const relevantConfig = configs[0]; 
    const prefix = relevantConfig.prefix;
    const authors = ['Shiki', 'Choru', 'Joland', 'Jean'];
    let allCommands = [];

    authors.forEach(author => {
        const cmdFolderPath = path.join(__dirname, `../../cmds/${author}`);
        const files = fs.readdirSync(cmdFolderPath);

        files.forEach(file => {
            const commandName = path.parse(file).name;
            allCommands.push(`${prefix}${commandName}`);  // Add the prefix here
        });
    });

    const perPage = 7;
    const totalPages = Math.ceil(allCommands.length / perPage);

    let page = parseInt(event.body.toLowerCase().trim().split(' ')[1]) || 1;
    page = Math.max(1, Math.min(page, totalPages));

    const startIndex = (page - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, allCommands.length);

    const response = [
        `┌─[ Help @ Page ${page} ]`,
        '├───────────────────',
        '│ ┌─[ Public Commands ]'
    ];

    for (let i = startIndex; i < endIndex; i++) {
        response.push(`│ ├─[ ${allCommands[i]} ]`);
    }

    if (endIndex < allCommands.length) {
        response.push(`│ └─[ Page ${page}/${totalPages} - Use '${prefix}help ${page + 1}' for more commands ]`);
    } else {
        response.push(`│ └─[ Page ${page}/${totalPages} ]`);
    }

    response.push('└───────────────────');
    response.push(`Type '${prefix}help command_name' to see more details about a specific command.`);

    api.sendMessage(response.join('\n'), event.threadID);
};
