require("dotenv").config();

const { pipeline } = require("stream")
const request = require("request")
const tweetParser = require("./tweetParser")
const logger = require("./logger")
const splitter = require("./splitter")
const server = require("./server")

const httpRequestStream = request.post(`${process.env.TWITTER_API_URL}/statuses/filter.json`, {
    json: true,
    form: {
        track: "javascript, nodejs"
    },
    oauth: {
        consumer_key: process.env.TWITTER_API_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_API_CONSUMER_SECRET,
        token: process.env.TWITTER_API_TOKEN,
        token_secret: process.env.TWITTER_API_TOKEN_SECRET
    }
})

pipeline(
    httpRequestStream,
    splitter,
    tweetParser,
    logger,
    (error) => {
        console.error(error)
    }
)

server.listen(process.env.PORT)