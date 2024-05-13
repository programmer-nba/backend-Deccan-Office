const mongoose = require("mongoose")
const { Schema } = mongoose

const notifyTokenSchema = new Schema(
    {
        user_id: { type: String, require: true },
        token: { type: String, require: true }
    },
    {
        timestamps: true
    }
)

const NotifyToken = mongoose.model("NotifyToken", notifyTokenSchema)
module.exports = { NotifyToken }