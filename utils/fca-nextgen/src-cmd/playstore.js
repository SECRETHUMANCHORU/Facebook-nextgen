const axios = require('axios');

module.exports = function(defaultFuncs, api, ctx) {
    return async function(appName) {
        try {
            const response = await axios.get(`https://facebook-bot.nextgen0.repl.co/playstore?name=${appName}`);
            if (response.data) {
                return response.data;
            } else {
                console.log('No data received from the endpoint.');
                return null;
            }
        } catch (error) {
            console.log('Error in playstore function:', error);
            return null;
        }
    };
};
