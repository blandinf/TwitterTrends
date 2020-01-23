const { Transform } = require("stream")

const tweetParser = new Transform({
    readableObjectMode: true,
    transform(chunk, encoding, callback) {
        let data
        try {
            data = JSON.parse(chunk)
        } catch (error) {
            console.error(error)
        }
        if (data) {
            this.push(data);
        }

        callback();
    }
})

module.exports = tweetParser;