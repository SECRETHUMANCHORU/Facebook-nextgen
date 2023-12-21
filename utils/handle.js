const axios = require('axios');
const fs = require('fs-extra');
const request = require('request');
const path = require('path');

const cacheDirectory = path.join(__dirname, './cache/');

if (!fs.existsSync(cacheDirectory)) {
    fs.mkdirSync(cacheDirectory);
}

const m = require("moment-timezone");
const gradient = require('gradient-string');
const gradients = [
    '#33ff33',  // neon green
    '#3399ff',  // neon blue
    '#00ccff',  // neon sky blue
    '#ff9933',  // neon orange
    '#ffff33'   // neon yellow
];
const crayons = gradients[Math.floor(Math.random() * gradients.length)];
const crayons1 = gradients[Math.floor(Math.random() * gradients.length)];

const crayon = gradient([
    `${crayons}`,
    `${crayons1}`
]);

async function logMessage(event, api) {
    try {
        var n = m.tz("Asia/Manila").format("HH:mm:ss DD/MM/YYYY");

        let targetID = `${event.senderID}`;
        if (Object.keys(event.mentions).length > 0) {
            targetID = Object.keys(event.mentions)[0];
        }

        const userMapping = await api.getUserInfo(targetID);
        const userInfo = userMapping[targetID];
        let threadInfo = await api.getThreadInfo(event.threadID);

        if (userInfo && threadInfo) {
            var userName = userInfo.name.replace("@", "");
            function truncateAndPad(str, maxLength) {
                if (str.length > maxLength) {
                    return str.substring(0, maxLength - 3) + '...';
                }
                return str.padEnd(maxLength);
            }

            process.stderr.write(crayon("╔═✧════════════════════════════════✧═╗\n"));
            process.stderr.write(crayon("║                                    ║\n"));
            process.stderr.write(crayon("║              𓂀 LOG𓂀                ║\n"));
            process.stderr.write(crayon("║                                    ║\n"));
            process.stderr.write(crayon("╟─✦────────────────────────────────✦─╢\n"));
            process.stderr.write(crayon(`║ Group: ${truncateAndPad(threadInfo.threadName, 28)}║\n`));
            process.stderr.write(crayon(`║ ID: ${truncateAndPad(threadInfo.threadID.toString(), 31)}║\n`));
            process.stderr.write(crayon(`║ User: ${truncateAndPad(userName, 29)}║\n`));
            process.stderr.write(crayon(`║ UID: ${truncateAndPad(userInfo.uid.toString(), 30)}║\n`));
            process.stderr.write(crayon(`║ Msg: ${truncateAndPad(event.body || "Image, vid", 30)}║\n`));
            process.stderr.write(crayon(`║ Time: ${truncateAndPad(n, 29)}║\n`));
            process.stderr.write(crayon("║                                    ║\n"));
            process.stderr.write(crayon("╚═✧════════════════════════════════✧═╝\n"));
        }
    } catch (error) {
        console.error("Error in logMessage function: ", error);
    }
}

async function handleUnsend(event, api, vips = [], msgs = {}) {
    if (!Array.isArray(vips) || !vips.includes(event.senderID)) {
        const storedMsg = msgs[event.messageID];
        if (!storedMsg) {
            return;
        }

        api.getUserInfo(event.senderID, async (err, data) => {
            if (err) {
                return;
            }

            if (typeof (storedMsg) === "object") {
                await downloadAndSend(storedMsg, data, event, api);
            } else {
                api.sendMessage(`${data[event.senderID]['name']} unsent this: ${storedMsg}`, event.threadID);
            }
        });
    }
}

async function downloadAndSend(storedMsg, userData, event, api) {
    let name = userData[event.senderID]['name'];
    if (!storedMsg.attachment || storedMsg.attachment.length === 0) {
        return api.sendMessage(`${name} removed this message: ${storedMsg.msgBody}`, event.threadID);
    } else {
        let msg = {
            body: `${name} just removed ${storedMsg.attachment.length} attachments.${storedMsg.msgBody ? `\nContent: ${storedMsg.msgBody}` : ""}`,
            attachment: [],
            mentions: { tag: name, id: event.senderID }
        };

        for (let attachment of storedMsg.attachment) {
            try {
                const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
                const ext = path.extname(attachment.url);
                const filePath = path.join(cacheDirectory, `${Date.now()}${ext}`);
                fs.writeFileSync(filePath, response.data);
                msg.attachment.push(fs.createReadStream(filePath));
            } catch (error) {
                console.error("Error downloading attachment:", error);
            }
        }

        api.sendMessage(msg, event.threadID);
    }
}



async function handleJoin(event, api) {
    try {
        if (event.logMessageType === "log:subscribe") {
            if (event.logMessageData.addedParticipants.some(id => id.userFbId == api.getCurrentUserID())) {
                api.sendMessage(` Connected! Prefix : /`, event.threadID, () => {
                    api.changeNickname(`ina`, event.threadID, api.getCurrentUserID());
                });
            } else {
                for (const id of event.logMessageData.addedParticipants) {
                    const threadID = event.threadID;
                    try {
                        const threadInfo = await api.getThreadInfo(threadID);
                        const userID = id.userFbId;
                        const userInfo = await api.getUserInfo([userID]);
                        const userMentions = `${userInfo[userID].name}`;
                        if (userID !== api.getCurrentUserID()) {
                            api.sendMessage(`Welcome ${userMentions} to the group ${threadInfo.name}`, event.threadID);
                        }
                    } catch (error) {
                        console.error("Error in handleJoin - Getting user info or thread info: ", error);
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error in handleJoin function: ", error);
    }
}

async function LeaveEvent(event, api) {
    try {
        if (event.logMessageType === "log:unsubscribe") {
            const threadID = event.threadID;
            try {
                const threadInfo = await api.getThreadInfo(threadID);
                const userID = event.logMessageData.leftParticipantFbId;
                const userInfo = await api.getUserInfo([userID]);
                const userMentions = `${userInfo[userID].name}`;
                if (userID !== api.getCurrentUserID()) {
                    api.sendMessage(`Goodbye ${userMentions} has left ${threadInfo.name}`, event.threadID);
                }
            } catch (error) {
                console.error("Error in LeaveEvent - Getting user info or thread info: ", error);
            }
        }
    } catch (error) {
        console.error("Error in LeaveEvent function: ", error);
    }
}



module.exports = {
    handleUnsend,
    handleJoin,
    LeaveEvent,
    logMessage
};
