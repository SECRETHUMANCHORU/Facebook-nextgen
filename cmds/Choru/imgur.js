const request = require('request');

module.exports.config = {
    name: "imgur",
    description: "imgur upload",
    tutorial: "upload your image or reply with an image",
    author: "Choru",
    prefix: true
};

module.exports.run = async ({ api, event, input }) => {
    let link;
    
    if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
        link = event.messageReply.attachments[0].url;
    } else {
        link = input; 
    }

    if (!link) {
        return api.sendMessage(`Please reply to an image or provide a direct image URL.`, event.threadID, event.messageID);
    }

    const options = {
        method: 'POST',
        url: 'https://api.imgur.com/3/image',
        headers: {
            Authorization: 'Client-ID fc9369e9aea767c'
        },
        formData: {
            image: link
        }
    };

    request(options, (error, response) => {
        if (error) {
            console.error('Error uploading image:', error);
            api.sendMessage(`Error uploading the image. Please try again.`, event.threadID, event.messageID);
            return;
        }

        const data = response.body;
        const upload = JSON.parse(data);

        if (upload && upload.data && upload.data.link) {
            const uploadedImageUrl = upload.data.link;
            api.sendMessage(`Image uploaded successfully! Link: ${uploadedImageUrl}`, event.threadID, event.messageID);
        } else {
            api.sendMessage(`Error uploading the image.`, event.threadID, event.messageID);
        }
    });
};
