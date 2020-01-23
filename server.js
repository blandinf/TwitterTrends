const http = require("http")
const fs = require("fs")
const WebSocket = require("ws")
const { pipeline } = require("stream")

const server = http.createServer((request, response) => {
    let file = "./public/";
    if (request.url === '/') {
        file += "index.html"
    } else {
        file += request.url
    }

    const fileStream = fs.createReadStream(file)
    pipeline(
        fileStream,
        response,
        error => {
            console.error(error)
            response.writeHead(500)
            response.end("an error occured")
        }
    )
})

const wsServer = new WebSocket.Server({
    server
})

module.exports = {
    server,
    wsServer
}
