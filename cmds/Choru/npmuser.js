const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeNpmProfile(username) {
    const response = await axios.get(`https://www.npmjs.com/~${username}`);
    
    if (response.status !== 200) throw new Error("Failed to fetch profile data from npm");

    const $ = cheerio.load(response.data);
    const avatarUrl = $('img').attr('src');
    const nameTag = $('h2.b219ea1a').text();
    const packageCount = $('span.c5c8a11c').text();

    const packages = [];
    $('h3.db7ee1ac').each(function() {
        packages.push($(this).text());
    });

    return {
        avatarUrl,
        nameTag,
        packageCount,
        packages
    };
}

async function scrapeNpmOrgs(username) {
    const response = await axios.get(`https://www.npmjs.com/~${username}?activeTab=orgs`);

    if (response.status !== 200) throw new Error("Failed to fetch organizations data from npm");

    const $ = cheerio.load(response.data);
    const orgText = $('span.c5c8a11c').text();

    return orgText ? `${orgText} Organizations` : "Empty Organizations";
}

async function fetchData(username) {
    const profileData = await scrapeNpmProfile(username);
    const orgCounts = await scrapeNpmOrgs(username);

    return {
        ...profileData,
        orgCounts
    };
}

module.exports.config = {
	name: "npmuser",
	description: "Get information about an User",
	tutorial: "npmuser input",
    author: "Choru",
    prefix: true
};

module.exports.run = async ({ api, event, input }) => {
    const username = input;

    if (!username) {
        return api.sendMessage("No username provided.", event.threadID, event.messageID);
    }

    try {
      const details = await fetchData(username);
        
        const formattedMessage = `
Avatar: ${details.avatarUrl}\n\n
Name: ${details.nameTag}\n
package-correct: ${details.packageCount}\n
package-list: ${details.packages.join(', ') || "no package"}\n
organizations: ${details.orgCounts}
`;
        
        
        
        return api.sendMessage(formattedMessage, event.threadID, event.messageID);
    } catch (err) {
        return api.sendMessage(err.message, event.threadID, event.messageID);
    }
};

