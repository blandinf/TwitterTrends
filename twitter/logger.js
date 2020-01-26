const { Writable } = require("stream")

const logger = new Writable({
    objectMode: true,
    write(chunk, encoding, callback) {
        let data
        try {
            data = JSON.stringify(chunk)
        } catch (error) {
            console.error(error)
        }

        console.log("------------\n")
        console.log(data + "\n\n")

        callback();
    }
})

module.exports = logger;