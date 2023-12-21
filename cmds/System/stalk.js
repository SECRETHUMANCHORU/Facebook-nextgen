const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');

module.exports.config = {
    name: "stalk",
    description: "Retrieve user details from Facebook.",
    tutorial: "Use by typing /stalk, or /stalk followed by a Facebook user ID, or mention someone.",
    author: "System",
    prefix: true
};

module.exports.run = async ({ api, event, input }) => {
    try {
        let targetID = `${input || event.senderID}`; 
        if (Object.keys(event.mentions).length > 0) {
            targetID = Object.keys(event.mentions)[0]; 
        }

        const userMapping = await api.getUserInfo(targetID);
        const userInfo = userMapping[targetID];

        if (userInfo) {
            var obj = Object.keys(userMapping);
                var userName = userMapping[obj].name.replace("@", "");

            const formattedInfo = `
Thread ID: ${event.threadID}
Name: ${userName} 
uid: ${userInfo.uid}
First Name: ${userInfo.firstName}
Vanity: ${userInfo.vanity}
Profile URL: ${userInfo.profileUrl}
Gender: ${userInfo.gender}
Type: ${userInfo.type}
Is Friend: ${userInfo.isFriend ? 'Yes' : 'No'}
Birthday Today: ${userInfo.isBirthday ? 'Yes' : 'No'}
`;


            const combinedPath = path.join(__dirname, '../cache/combined.jpg');

            const sendMsgWithCombinedImage = () => {
                api.sendMessage({
                    body: formattedInfo,
                    attachment: fs.createReadStream(combinedPath)
                }, event.threadID, () => {
                    fs.unlinkSync(combinedPath);
                });
            };

            const [avatarResp, bgResp] = await Promise.all([
                axios.get(userInfo.highResProfilePic, { responseType: 'arraybuffer' }),
                axios.get('https://i.ibb.co/2yt37gd/New-Project-1122-A84-B16-C.png', { responseType: 'arraybuffer' })
            ]);

            const [avatar, bgImage] = await Promise.all([
                loadImage(Buffer.from(avatarResp.data)),
                loadImage(Buffer.from(bgResp.data))
            ]);

            const canvas = createCanvas(bgImage.width, bgImage.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height);
            let x = 279;
let y = 164;
let width = 753;
let height = 755;
let radius = 50; 


ctx.beginPath();
ctx.moveTo(x + radius, y);
ctx.arcTo(x + width, y, x + width, y + height, radius);
ctx.arcTo(x + width, y + height, x, y + height, radius);
ctx.arcTo(x, y + height, x, y, radius);
ctx.arcTo(x, y, x + width, y, radius);
ctx.closePath();
ctx.clip();

ctx.drawImage(avatar, x, y, width, height);
            const out = fs.createWriteStream(combinedPath);
            const stream = canvas.createJPEGStream();
            stream.pipe(out);
            out.on('finish', sendMsgWithCombinedImage);

        } else {
            api.sendMessage("Couldn't fetch user information.", event.threadID);
        }
    } catch (err) {
        console.error(err);
        api.sendMessage("An error occurred while fetching user info.", event.threadID);
    }
};