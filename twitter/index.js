require("dotenv").config();
const request = require("request")
const splitter = require("./splitter")
const parser = require("./parser")
const { getTrends } = require("../trends")

async function getFilteredTweets () {
    let trends = await getTrends()
    const httpRequestStream = request.post(`${process.env.TWITTER_STREAM_URL}/statuses/filter.json`, {
        json: true,
        form: {
            track: trends
        },
        oauth: {
            consumer_key: process.env.TWITTER_API_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_API_CONSUMER_SECRET,
            token: process.env.TWITTER_API_TOKEN,
            token_secret: process.env.TWITTER_API_TOKEN_SECRET
        }
    }).on('error', (error) => {
        console.error(error)
    })

    const tweetStream = httpRequestStream
                            .pipe(splitter)
                            .pipe(parser)

    return tweetStream
}

module.exports = {
    getFilteredTweets: getFilteredTweets
} 
