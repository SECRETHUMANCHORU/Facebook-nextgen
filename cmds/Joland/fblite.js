const { loadImage, createCanvas } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "fblite",
    description: "loading error",
    tutorial: "fblite input",
    author: "Joland",
    prefix: true
};

module.exports.wrapText = (ctx, text, maxWidth) => {
    if (ctx.measureText(text).width < maxWidth) return [text];
    if (ctx.measureText('W').width > maxWidth) return null;
    const words = text.split(' ');
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
    
    let imagePath = path.join(cacheDir, 'fblite.jpg');
    const imageResponse = await axios.get(`https://i.imgur.com/QBOGwjx.jpeg`, { responseType: 'arraybuffer' });
    if (imageResponse.config.url.endsWith('.jpeg')) {
        imagePath = path.join(cacheDir, 'fblite.jpeg');
    }
    
    fs.writeFileSync(imagePath, imageResponse.data);
    let baseImage = await loadImage(imagePath);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    ctx.font = "400 32px Arial";
    ctx.fillStyle = "#7C7D7F";
    ctx.textAlign = "start";
    let fontSize = 250;
    while (ctx.measureText(input).width > 2000) {   
        fontSize--;
        ctx.font = `400 ${fontSize}px Arial, sans-serif`;
    }
    const lines = await this.wrapText(ctx, input, 610);  
    ctx.fillText(lines.join('\n'), 90, 670);

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(imagePath, imageBuffer);
    api.sendMessage({ attachment: fs.createReadStream(imagePath) }, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);
}
