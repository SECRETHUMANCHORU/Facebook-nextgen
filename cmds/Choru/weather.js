const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const fontFilePath = path.join(__dirname, '../cache/Arial-Bold.ttf');

const ensureFontFileExists = async () => {
    if (!await fs.pathExists(fontFilePath)) {
        const fontUrl = 'https://drive.google.com/u/0/uc?id=1a2d5TV4bnteJHNwISGjpiDyy_gA6lwiI&export=download';
        const fontData = (await axios.get(fontUrl, { responseType: 'arraybuffer' })).data;
        await fs.writeFile(fontFilePath, Buffer.from(fontData));
    }
};

ensureFontFileExists().then(() => {
    registerFont(fontFilePath, { family: 'Arial Bold' });
});

module.exports.config = {
    name: "weather",
    description: "Gets the weather information for a specified location.",
    tutorial: "Type /weather followed by the name of the city or location.",
    author: "Choru",
    prefix: true
};
module.exports.run = async ({ api, event, input }) => {
    try {
        const apiKey = 'd95ed50e3751a17296d2ebc9ec5c8541';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${input}&APPID=${apiKey}&units=metric`;
        
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data || data.cod !== 200) {
            api.sendMessage("Couldn't find weather for that location.", event.threadID);
            return;
        }

        const imageUrl = data.weather[0].main.toLowerCase().includes("rain")
            ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaAxDTuEY__vkX5q0V3nhCKXtkpN2DOQc_bw&usqp=CAU'
            : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqvY6yTBtk7brHKfY5QVSUUkPM7Xvg75f9SA&usqp=CAU';

        const image = await loadImage(imageUrl);

        const scale = 2;
        const canvas = createCanvas(400 * scale, 300 * scale);
        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const msg = `Weather for ${data.name}\nTemperature: ${data.main.temp}°C\nCondition: ${data.weather[0].description}\nWind: ${data.wind.speed} m/s\nHumidity: ${data.main.humidity}%`;
        ctx.font = '20px Arial Bold';
        ctx.fillStyle = 'cyan';
        ctx.fillText(msg, 10, 50);

        const dirPath = path.join(__dirname, '../cache/');
        await fs.ensureDir(dirPath);
        const outputPath = path.join(dirPath, 'weather.jpg');
        
        const out = fs.createWriteStream(outputPath);
        const stream = canvas.createJPEGStream();
        stream.pipe(out);
        
        out.on('finish', async () => {
    api.sendMessage({
        body: msg,
        attachment: fs.createReadStream(outputPath)
    }, event.threadID, (err) => {
        if (!err) {
            fs.unlink(outputPath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error("Error deleting file:", unlinkErr);
                }
            });
        }
    });
});


    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred. Please try again later.", event.threadID);
    }
};
