const { generateRandomInfo } = require('sensui-package');

module.exports.config = {
    name: "rinfo",
    description: "Generate Random Info",
    author: "Sensui",
    prefix: true
};

function formatValue(value, indent) {
    if (Array.isArray(value)) {
        return `[${value.map(obj => formatValue(obj, indent + 2)).join(', ')}]`;
    } else if (typeof value === 'object') {
        let formatted = '';
        for (const key in value) {
            formatted += `${' '.repeat(indent)}${key}: ${formatValue(value[key], indent + 2)}\n`;
        }
        return formatted;
    } else {
        return value;
    }
}

module.exports.run = async ({ api, event, input }) => {
    let result;
    try {
        result = await generateRandomInfo();
    } catch (error) {
        return api.sendMessage("Failed to retrieve random info.", event.threadID, event.messageID);
    }

    let formattedInfo = "Random info:\n\n";
    for (const key in result) {
        const value = result[key];
        formattedInfo += `${key}: ${formatValue(value, 2)}\n`;
    }

    return api.sendMessage(formattedInfo, event.threadID);
}
