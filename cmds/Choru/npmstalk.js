const axios = require('axios');
const cheerio = require('cheerio');

async function npmstalk(packageName) {
    const processedName = packageName.replace(/ /g, '-');
    const response = await axios.get(`https://www.npmjs.com/package/${processedName}`);
    const html = response.data;
    const $ = cheerio.load(html);

    const extractedPackageName = $('h2 span._50685029').text();
    const hasTypescript = $('img[alt="TypeScript icon, indicating that this package has built-in type declarations"]').length > 0;
    const packageVersion = $('span._76473bea.f6').first().text();
    const packagePublishedDate = new Date($('span._76473bea.f6 time').attr('datetime')).toDateString();
    const dependenciesCount = parseInt($('a[href="?activeTab=dependencies"] span').text(), 10);
    const dependentsCount = parseInt($('a[href="?activeTab=dependents"] span').text().replace(',', ''), 10);
    const versionsCount = parseInt($('a[href="?activeTab=versions"] span').text(), 10);
    const installCommand = $('span[role="button"][aria-label^="Install"]').text().trim();
    const repositoryLink = $('p._40aff104 a').attr('href');
    const repositoryText = $('span#repository-link').text();
    const title = $('time').attr('title');
    const downloads = $('p._9ba9a726').text().trim();
    const totalFiles = $('h3.c84e15be:contains("Total Files")').next().text();
    const fileSize = $('p.f2874b88:contains("kB")').text();

    function timeSince(date) {
        const now = new Date();
        const secondsPast = (now.getTime() - date.getTime()) / 1000;

        if (secondsPast < 60) return `${parseInt(secondsPast)} seconds ago`;
        if (secondsPast < 3600) return `${parseInt(secondsPast / 60)} minutes ago`;
        if (secondsPast <= 86400) return `${parseInt(secondsPast / 3600)} hours ago`;
        if (secondsPast > 86400) {
            const day = parseInt(secondsPast / 86400);
            if (day > 30) {
                const month = parseInt(day / 30);
                if (month > 12) return `${parseInt(month / 12)} years ago`;
                return `${month} months ago`;
            }
            return `${day} days ago`;
        }
    }

    const keywordsElement = $('h2#user-content-keywords');
    let keywords = [];

    if (keywordsElement.length > 0) {
        keywordsElement.next().find('a').each((index, element) => {
            keywords.push($(element).text().trim());
        });
    }

    const elapsed = timeSince(new Date(title));

    const collaboratorsElement = $('h3#collaborators');
    let collaborators = [];

    if (collaboratorsElement.length > 0) {
        collaboratorsElement.nextAll('img[title]').each((index, element) => {
            const titleText = $(element).attr('title');
            if (titleText) {
                collaborators.push(titleText);
            }
        });
    }

    const res = await axios.get(`https://registry.npmjs.org/${processedName}`);
    const data = res.data;
    const latestVersionData = data.versions[data['dist-tags'].latest];
    const repository = latestVersionData.repository ? latestVersionData.repository.url : null;
    const engines = latestVersionData.engines.node;
    const desc = latestVersionData.description;
    const bugs = latestVersionData.bugs.url;
    const author = latestVersionData.author && latestVersionData.author.name ? 
                   latestVersionData.author.name.replace(/,/g, '\n') : 
                   null;

    return {
        packageName: extractedPackageName.trim(),
        hasTypescript,
        packageVersion: `${packageVersion.trim()} Public`,
        packagePublishedDate,
        dependenciesCount,
        dependentsCount,
        versionsCount,
        installCommand,
        repositoryLink,
        repositoryText,
        time: `• Published ${elapsed}`,
        desc,
        downloads,
        totalFiles,
        fileSize,
        keywords,
        repository,
        engines,
        collaborators: [
          author
        ],
        bugs
    };
}

module.exports.config = {
	name: "npmjs",
	description: "Get information about an NPM package",
	tutorial: "npmjs input",
    author: "Choru",
    prefix: true
};
          
module.exports.run = async ({ api, event, input }) => {
    const packageName = input;

    if (!packageName) {
        return api.sendMessage("No package name provided.", event.threadID, event.messageID);
    }

    try {
        const details = await npmstalk(packageName);
        
        const message = `
Package: ${details.packageName}
Version: ${details.packageVersion}
Published: ${details.time}
Description: ${details.desc}

Downloads: ${details.downloads}
Total Files: ${details.totalFiles}
File Size: ${details.fileSize}

Dependencies: ${details.dependenciesCount}
Dependents: ${details.dependentsCount}
Has TypeScript: ${details.hasTypescript}
Keywords: ${details.keywords.join(', ')}

Repository: ${details.repository}
Other Collaborators: ${details.collaborators[0]}

Engines: ${details.engines}
Bugs: ${details.bugs}
`;

        return api.sendMessage(message, event.threadID, event.messageID);
    } catch (err) {
        return api.sendMessage(err.message, event.threadID, event.messageID);
    }
};
