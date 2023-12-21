const { loadImage, createCanvas } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "hackfb",
    description: "hack acc",
    tutorial: "hack mention",
    author: "Joland",
    prefix: true
};

module.exports.wrapText = (ctx, name, maxWidth) => {
    if (ctx.measureText(name).width < maxWidth) return [name];
    if (ctx.measureText('W').width > maxWidth) return null;
    const words = name.split(' ');
    const lines = [];
    let line = '';
    while (words.length > 0) {
        let split = false;
        while (ctx.measureText(words[0]).width >= maxWidth) {
            const temp = words[0];
            words[0] = temp.slice(0, -1);
            if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
            else {
                split = true;
                words.splice(1, 0, temp.slice(-1));
            }
        }
        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
        else {
            lines.push(line.trim());
            line = '';
        }
        if (words.length === 0) lines.push(line.trim());
    }
    return lines;
};

module.exports.run = async function({ api, event, input }) {
    const cacheDir = path.join(__dirname, '../cache');
    if (!fs.existsSync(cacheDir)){
        fs.mkdirSync(cacheDir);
    }

    let targetID = `${input || event.senderID}`;
    if (Object.keys(event.mentions).length > 0) targetID = Object.keys(event.mentions)[0];

    const userMapping = await api.getUserInfo(targetID).catch(err => {
        console.error("Error fetching user info:", err);
        api.sendMessage("An error occurred while fetching user info.", event.threadID);
        return;
    });
    
    if(!userMapping) return;
    const userInfo = userMapping[targetID];

    let imagePath = path.join(cacheDir, 'hack.png');
    let avatarPath = path.join(cacheDir, 'Avtmot.png');

    try {
        const imageResponse = await axios.get("https://i.imgur.com/VQXViKI.png", { responseType: 'arraybuffer' });
        fs.writeFileSync(imagePath, imageResponse.data);

        const avatarResponse = await axios.get(`https://graph.facebook.com/${targetID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' });
        fs.writeFileSync(avatarPath, avatarResponse.data);
    } catch(err) {
        console.error("Error downloading images:", err);
        api.sendMessage("An error occurred while downloading images.", event.threadID);
        return;
    }

    let baseImage = await loadImage(imagePath);
    let baseAvatar = await loadImage(avatarPath);

    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.font = "400 23px Arial";
    ctx.fillStyle = "#1878F3";
    ctx.textAlign = "start";

    const lines = await this.wrapText(ctx, userInfo.name, 1160);
    ctx.fillText(lines.join('\n'), 200, 497);
    ctx.drawImage(baseAvatar, 83, 437, 100, 101);

    const outputBuffer = canvas.toBuffer();
    fs.writeFileSync(imagePath, outputBuffer);

    api.sendMessage({ attachment: fs.createReadStream(imagePath) }, event.threadID, (err) => {
        if (err) {
            console.error("Error sending message:", err);
            api.sendMessage("An error occurred while sending the image.", event.threadID);
        }
        fs.unlinkSync(imagePath);
        fs.unlinkSync(avatarPath);
    }, event.messageID);
}
