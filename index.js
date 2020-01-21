require("dotenv").config();

const { pipeline } = require("stream")
const request = require("request")
const tweetParser = require("./tweetParser")
const logger = require("./logger")
const splitter = require("./splitter")
const { server, wsServer } = require("./server")
const WsWriter = require("./wsWriter")

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
}).on('error', (error) => {
    console.error(error)
})

const twitterStream = httpRequestStream.pipe(splitter)
                                    //    .pipe(tweetParser)

wsServer.on("connection", (socket) => {
    socket.send('coucou')
    socket.on("message", (message) => {
        console.log('message du client:' + message)
    })
    const wsWriter = new WsWriter(socket)
    twitterStream.pipe(wsWriter)
})

server.listen(process.env.PORT)