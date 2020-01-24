require("dotenv").config();

const { server, wsServer } = require("./server")
const { getFilteredTweets } = require("./twitter")
const { getTrends } = require("./trends")

wsServer.on("connection", async (client) => {
    let trends = await getTrends()
    let trendsArray = {'trends': trends.split(',')}
    let trendsStringified = JSON.stringify(trendsArray)
    client.send(trendsStringified)
    client.on("message", async (selectedTracks) => {
        let stream = null
        if (selectedTracks) {
            if (!stream) {
                stream = await getFilteredTweets()
            } 
            stream.removeAllListeners("data")
            stream.on("data", tweet => {
                let selectedTracksArray = selectedTracks.split(',');
                for (let track of selectedTracksArray) {
                    if (tweet && tweet.text && tweet.text.toLowerCase().includes(track.toLowerCase())) {
                        console.log('track', track)
                        client.send(track)
                    }
                }
            })
        }
    })
})

server.listen(process.env.PORT)