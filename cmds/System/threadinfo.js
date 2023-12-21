const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "threadinfo",
    description: "Fetches and displays detailed information about a specified thread.",
    tutorial: "Invoke in the desired thread to get comprehensive details.",
    author: "System",
    prefix: true
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.run = async ({ api, event, input }) => {
    try {
        let threadInfo = await api.getThreadInfo(event.threadID);
        if (threadInfo) {
            let formattedInfo = `
Thread ID: ${threadInfo.threadID}
Thread Name: ${threadInfo.threadName}
User Info: ${threadInfo.userInfo.map(user => `
    ID: ${user.id}
    Name: ${user.name}
    First Name: ${user.firstName}
    Profile URL: https://www.facebook.com/profile.php?id=${user.id}
`).join('\n')}
Unread Count: ${threadInfo.unreadCount}
Message Count: ${threadInfo.messageCount}
Approval Mode: ${threadInfo.approvalMode}
`;

            let imgData = [];
            let count = 0;
            let imageLimit = 50;
            for (let user of threadInfo.userInfo) {
                if (count >= imageLimit) break;

                const imgPath = path.join(__dirname, `../cache/avtpfp${count}.jpg`);
                await axios.get(user.profileUrl, { responseType: 'stream' })
                    .then(response => {
                        const stream = fs.createWriteStream(imgPath);
                        response.data.pipe(stream);
                        stream.on('finish', () => {
                            imgData.push(fs.createReadStream(imgPath));
                        });
                    });
                count++;
            }

            const baseTime = 3000;
            const timePerImage = 10;
            const totalWaitTime = baseTime + (timePerImage * count);

            await sleep(totalWaitTime);

            api.sendMessage({
                body: formattedInfo,
                attachment: imgData
            }, event.threadID, () => {
                for (let i = 0; i < count; i++) {
                    fs.unlinkSync(path.join(__dirname, `../cache/avtpfp${i}.jpg`));
                }
            });
        } else {
            api.sendMessage("Couldn't fetch thread information.", event.threadID);
        }
    } catch (err) {
        api.sendMessage("An error occurred while fetching thread info.", event.threadID);
    }
};
