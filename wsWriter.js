const { Writable } = require("stream")

class WsWriter extends Writable {
    constructor(webSocket) {
        super()
        this.webSocket = webSocket
    }

    _write(chunk, encoding, callback) {
        if(this.webSocket) {
            this.webSocket.send(chunk.toString())
        }
        
        callback();
    }
}

module.exports = WsWriter;