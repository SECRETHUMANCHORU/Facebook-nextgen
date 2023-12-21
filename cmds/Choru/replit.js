const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const request = require('request');

async function replitstalk(user) {
  try {
    const response = await axios.get(`https://replit.com/@${user}?tab=repls`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const title = $("title").text();
    const author = $("meta[name='author']").attr("content");
    const description = $("meta[name='description']").attr("content");
    const image = $("meta[itemprop='image']").attr("content");
    const followersButton = $("button span:contains('followers')");
    const followers = followersButton.length ? followersButton.text().trim() : undefined;
    const followingButton = $("button span:contains('following')");
    const following = followingButton.length ? followingButton.text().trim() : undefined;
    const activeOnlineText = $("span.repls-meta-text:contains('Active online')").next().text().trim();
    const lastOnlineText = $("span.repls-meta-text:contains('Last online')").next().text().trim();
    const activeOnline = activeOnlineText.toLowerCase().includes('online');
    const lastOnlineHours = getLastOnlineHours(lastOnlineText);

    return {
      title,
      author,
      description,
      image,
      followers,
      following,
      activeOnline,
      lastOnlineHours
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

function getLastOnlineHours(text) {
  const match = text.match(/\d+/);
  if (match) {
    return parseInt(match[0]);
  }
  return null;
}

module.exports.config = {
    name: "replit",
    description: "replit stalk user",
    tutorial: "replit user",
    author: "Choru",
    prefix: true
};

module.exports.run = async ({ api, event, input }) => { 
    const user = input;
    const details = await replitstalk(user);

    if (!details) {
      return api.sendMessage("Failed to fetch user details.", event.threadID, event.messageID);
    }

    const messageBody = `Title: ${details.title}\n
    Author: ${details.author}\n
    Description: ${details.description}\n
    Followers: ${details.followers}\n
    Following: ${details.following}\n
    ActiveOnline: ${details.activeOnline}\n
    LastOnlineHours: ${details.lastOnlineHours}`;

    const imagePath = __dirname + '/../cache/user.png';
    const callback = () => {
        api.sendMessage({body: messageBody, attachment: fs.createReadStream(imagePath)}, event.threadID, () => {
            fs.unlinkSync(imagePath);
        }, event.messageID);
    };
    request(encodeURI(details.image)).pipe(fs.createWriteStream(imagePath)).on('close', callback);
};
