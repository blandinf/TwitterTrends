require("dotenv").config();

const request = require("request")
const splitter = require("./splitter")
const { server, wsServer } = require("./server")
const WsWriter = require("./wsWriter")

function launchRequest (track, socket) {
    const httpRequestStream = request.post(`${process.env.TWITTER_API_URL}/statuses/filter.json`, {
        json: true,
        form: {
            track: track
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
    const wsWriter = new WsWriter(socket)
    twitterStream.pipe(wsWriter)
}

wsServer.on("connection", (socket) => {
    socket.on("message", (message) => {
        if (message) {
            launchRequest(message, socket)
        }
    })
})

server.listen(process.env.PORT)