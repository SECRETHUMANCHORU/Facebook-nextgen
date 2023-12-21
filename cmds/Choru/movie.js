const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "movie",
    description: "Fetch movie details from OMDB API.",
    tutorial: "Specify the movie name after the command.",
    author: "Choru",
    prefix: true
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports.run = async ({ api, input, event }) => {
    try {
        const res = await axios.get(`https://www.omdbapi.com/?t=${input}&apikey=a3df25aa`);
        const movieInfo = res.data;

        if (movieInfo && movieInfo.Response !== "False") {
            const formattedMessage = `
Title: ${movieInfo.Title}
Year: ${movieInfo.Year}
Released: ${movieInfo.Released}
Runtime: ${movieInfo.Runtime}
Genre: ${movieInfo.Genre}
Plot: ${movieInfo.Plot}
IMDb Rating: ${movieInfo.imdbRating}
`;

            const imagePath = path.join(__dirname, '../cache/movie.png');
            const imageResponse = await axios.get(movieInfo.Poster, { responseType: "stream" });
            imageResponse.data.pipe(fs.createWriteStream(imagePath));

            imageResponse.data.on('end', async () => {
                await sleep(1000);

                api.sendMessage({
                    body: formattedMessage,
                    attachment: fs.createReadStream(imagePath)
                }, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);
            });

        } else {
            api.sendMessage("Sorry, movie details and/or image not found for the given input.", event.threadID, event.messageID);
        }

    } catch (error) {
        console.error('Error fetching data:', error);
        api.sendMessage("An error occurred while trying to fetch the movie details and image.", event.threadID, event.messageID);
    }
};
