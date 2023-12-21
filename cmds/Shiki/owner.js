const axios = require('axios');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

module.exports.config = {
    name: 'owner',
    description: 'Display bot owner information',
    tutorial: 'ownerinfo',
    author: 'Shiki',
    prefix: true
};

function convertVideoQuality(inputPath, outputPath, bitrate) {
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(inputPath)
            .videoBitrate(bitrate)
            .on('end', resolve)
            .on('error', reject)
            .save(outputPath);
    });
}

module.exports.run = async ({ api, event }) => {
    try {
        const ownerInfo = {
            name: 'shiki/choru/joland',
            gender: 'Male/Male/Male',
            age: '19/15/19',
            height: '5,8/5,7/5,8',
            facebookLink: 'secret',
            status: 'Nothing'
        };

        const videoUrl = 'https://drive.google.com/uc?export=download&id=1JJwwQDPrHMKzLQq_AYHvlMNLjD-kTIMO';

        const response = `
Owner Information:
Name: ${ownerInfo.name}
Gender: ${ownerInfo.gender}
Age: ${ownerInfo.age}
Height: ${ownerInfo.height}
Facebook: ${ownerInfo.facebookLink}
Status: ${ownerInfo.status}
`;

        const tmpFolderPath = path.join(__dirname, 'tmp');
        if (!fs.existsSync(tmpFolderPath)) {
            fs.mkdirSync(tmpFolderPath);
        }

        const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
        const videoPath = path.join(tmpFolderPath, 'owner_video_original.mp4');
        const videoLowerQualityPath = path.join(tmpFolderPath, 'owner_video_low_quality.mp4');

        fs.writeFileSync(videoPath, Buffer.from(videoResponse.data, 'binary'));
        await convertVideoQuality(videoPath, videoLowerQualityPath, '500k');  
        api.sendMessage(response, event.threadID, () => {
            
            setTimeout(() => {
                api.sendMessage({
                    attachment: fs.createReadStream(videoLowerQualityPath)
                }, event.threadID);
            }, 3000); 
        });

    } catch (error) {
        console.error('Error in ownerinfo command:', error);
        api.sendMessage('An error occurred while processing the command.', event.threadID);
    }
};
