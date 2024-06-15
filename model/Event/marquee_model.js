const mongoose = require('mongoose')
const { Schema } = mongoose

const marqueeSchema = new Schema(
    {
        text: { type: String }
    },
    {
        timestamps: true
    }
)

const Marquee = mongoose.model("Marquee", marqueeSchema)
module.exports = Marquee