require("dotenv").config();
const request = require("request")

function getTrends () {
    let promise = new Promise((resolve, reject) => {
        request.get(`${process.env.TWITTER_API_URL}/trends/place.json?id=1`, {
            oauth: {
                consumer_key: process.env.TWITTER_API_CONSUMER_KEY,
                consumer_secret: process.env.TWITTER_API_CONSUMER_SECRET,
                token: process.env.TWITTER_API_TOKEN,
                token_secret: process.env.TWITTER_API_TOKEN_SECRET
            }
        }, (error, response, body) => {
            if (error) {
                reject(error)
            }
            if (response && response.statusCode) {
                console.log('statusCode:', response && response.statusCode); 
            }
            let trendsStream = JSON.parse(body)
            let trends = ""
            for (let trend of trendsStream[0].trends) {
                trends += trend.name + ","
            }
            trends = trends.substring(0, trends.length - 1);
            resolve(trends)
        })
    })

    return promise
}

module.exports = {
    getTrends: getTrends
} 
