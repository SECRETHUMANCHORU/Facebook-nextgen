module.exports.config = {
    name: "groupinfo",
    description: "Retrieve information about Facebook groups",
    tutorial: "groupinfo",
    author: "Choru",
    prefix: true
};

module.exports.run = async ({ api, event, input }) => {
    try {
        const inbox = await api.getThreadList(100, null, ['INBOX']);
        const list = [...inbox].filter(group => group.isSubscribed && group.isGroup);

        const listthread = [];
        for (const groupInfo of list) {
            const data = await api.getThreadInfo(groupInfo.threadID);
            listthread.push({
                id: groupInfo.threadID,
                name: groupInfo.name,
                sotv: data.userInfo.length,
            });
        }

        const listbox = listthread.sort((a, b) => {
            if (a.sotv > b.sotv) return -1;
            if (a.sotv < b.sotv) return 1;
        });

        let msg = '';
        let i = 1;
        const groupid = [];
        for (const group of listbox) {
            msg += `${i++}. ${group.name}\n🧩TID: ${group.id}\n🐸Member: ${group.sotv}\n\n`;
            groupid.push(group.id);
        }

        // Now you can send the 'msg' variable as a message response
        api.sendMessage(msg, event.threadID);

    } catch (error) {
        console.error("Error in groupinfo command: ", error);
        // Handle any errors or send an error message
        api.sendMessage("An error occurred while retrieving group info.", event.threadID);
    }
};
