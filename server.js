const http = require("http")
const fs = require("fs")
const WebSocket = require("ws")

const server = http.createServer((request, response) => {
    console.log(request.url)
    if (request.url === '/') {
        const file = fs.readFile('./public/index.html', (error, file) => {
            response.writeHead(200)
            response.end(file)
        })
    } 
})

const wsServer = new WebSocket.Server({
    server
})

wsServer.on("connection", (socket) => {
    socket.send('coucou')
    socket.on("message", (message) => {
        console.log('message du client:' + message)
    })
})

module.exports = server
