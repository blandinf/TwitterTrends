require("dotenv").config();

const { server, wsServer } = require("./server")

let stream = null

wsServer.on("connection", (client) => {
    client.on("message", (selectedTracks) => {
        if (selectedTracks) {
            if (!stream) {
                stream = getFilteredTweets()
            } 
            stream.removeAllListeners("data")
            stream.on("data", tweet => {
                let selectedTracksArray = selectedTracks.split(',');
                for (let track of selectedTracksArray) {
                    if (tweet && tweet.text && tweet.text.toLowerCase().includes(track.toLowerCase())) {
                        console.log(track)
                        client.send(track)
                    }
                }
            })
        }
    })
})

server.listen(process.env.PORT)