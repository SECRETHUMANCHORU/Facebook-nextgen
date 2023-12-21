const axios = require('axios');

async function mlstalk(id, zoneId) {
    try {
        const response = await axios.post(
            'https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store',
            new URLSearchParams(
                Object.entries({
                    productId: '1',
                    itemId: '2',
                    catalogId: '57',
                    paymentId: '352',
                    gameId: id,
                    zoneId: zoneId,
                    product_ref: 'REG',
                    product_ref_denom: 'AE',
                })
            ),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Referer: 'https://www.duniagames.co.id/',
                    Accept: 'application/json',
                },
            }
        );
        return response.data.data.gameDetail;
    } catch (err) {
        throw err;
    }
}

module.exports.config = {
    name: "mlstalk",
    description: "Find your id",
    tutorial: "mlstalk id | server",
    author: "Choru",
    prefix: true
};

module.exports.run = async ({ api, event, input }) => {
    let text = input;
    const id = text.substr(0, text.indexOf(' | ')); 
    const zoneId = text.split(" | ").pop();
    const gameDetail = await mlstalk(id, zoneId);
    return api.sendMessage(gameDetail.userName, event.threadID, event.messageID);
};
