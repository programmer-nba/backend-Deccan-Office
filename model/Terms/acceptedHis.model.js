const mongoose = require("mongoose")
const { Schema } = mongoose

const acceptedTermSchema = new Schema(
    {
        term_id: { type: String },
        user_id: { type: String },
        user_ip: { type: String },
        user_type: { type: String }, //tossagun, //partner ...
        fromUrl: { type: String }
    },
    {
        timestamps: true
    }
)
const AcceptedTerm = mongoose.model("AcceptedTerm", acceptedTermSchema)

module.exports = AcceptedTerm