require("dotenv").config();

const { server, wsServer } = require("./server")
const { getFilteredTweets } = require("./twitter")
const { getTrends } = require("./trends")

wsServer.on("connection", async (client) => {
    let trends = null
    let stream = null
    if (!trends) {
        trends = await getTrends()
    }
    let trendsArray = {'trends': trends.split(',')}
    let trendsStringified = null
    try {
        trendsStringified = JSON.stringify(trendsArray)
        client.send(trendsStringified)
    } catch (error) {
        console.error(error)
    }
    client.on("message", async (message) => {
        if (!message) {
            return;
        }
        if (message === 'stop') {
            stream.removeAllListeners("data")
        } else {
            let selectedTracks = message
            if (!stream) {
                stream = getFilteredTweets(trends)
            } 
            stream.removeAllListeners("data")
            stream.on("data", tweet => {
                let selectedTracksArray = selectedTracks.split(',');
                for (let track of selectedTracksArray) {
                    if (tweet && tweet.text && tweet.text.toLowerCase().includes(track.toLowerCase())) {
                        client.send(track)
                    }
                }
            })
        }
    })
})

server.listen(process.env.PORT)