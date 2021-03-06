const { Transform } = require("stream")

const splitter = new Transform({
    readableObjectMode: true,
    transform(chunk, encoding, callback) {
        if (this.remainingData == null) {
            this.remainingData = ""
        }

        const currentData = this.remainingData + chunk.toString("utf8")
        const lines = currentData.split(/\r\n/)
        this.remainingData = lines.pop()

        for (let line of lines) {
            this.push(line)
        }
        
        callback()
    }
})

module.exports = splitter;