const mongoose = require("mongoose")
const { Schema } = mongoose

const termSchema = new Schema(
    {
        title: { type: String, require: true },
        code: { type: String, require: true },
        content: { type: String, default: "" },
        active: { type: Boolean, default: true },
        standard: { type: Boolean, default: false },

        user: {
            _id: { type: String },
            name: { type: String },
            email: { type: String },
        },

        signatures: { type: Array },
        status: { type: Array },
    },
    {
        timestamps: true
    }
)
const Term = mongoose.model("Term", termSchema)

module.exports = Term