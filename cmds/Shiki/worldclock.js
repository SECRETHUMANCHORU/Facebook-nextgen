const axios = require("axios");

module.exports.config = {
    name: "worldclock",
    description: "View the dates and times of different countries",
    tutorial: "worldclock",
    author: "shiki",
    prefix: true
};

module.exports.run = async ({ api, event }) => {
    try {
        const moment = require("moment-timezone");
        const timezones = [
            { label: "Philippines", emoji: "🇵🇭", timezone: "Asia/Manila" },
            { label: "Vietnam", emoji: "🇻🇳", timezone: "Asia/Ho_Chi_Minh" },
            { label: "London", emoji: "🇬🇧", timezone: "Europe/London" },
            { label: "New York", emoji: "🇺🇸", timezone: "America/New_York" },
            { label: "Seoul", emoji: "🇰🇷", timezone: "Asia/Seoul" },
            { label: "Tokyo", emoji: "🇯🇵", timezone: "Asia/Tokyo" },
            { label: "Brasilia", emoji: "🇧🇷", timezone: "America/Brasilia" },
            { label: "Kuala Lumpur", emoji: "🇲🇾", timezone: "Asia/Kuala_Lumpur" },
            { label: "Paris", emoji: "🇫🇷", timezone: "Europe/Paris" },
            // Add more timezones here
        ];

        let message = "WORLD CLOCK:\n\n";
        for (const tz of timezones) {
            const time = moment.tz(tz.timezone).format("h:mm:ss A || D/MM/YYYY");
            message += `${tz.emoji} ${tz.label}: ${time}\n`;
        }

        api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
        console.error('Error fetching data:', error);
        api.sendMessage("An error occurred while trying to fetch world times.", event.threadID, event.messageID);
    }
};
             