const mongoose = require('mongoose')
const { Schema } = mongoose

const eventSchema = new Schema(
    {
        title: { type: String, default: "" },
        detail: { type: String, default: "" },
        creator: { type: String, default: "" },
        members: { type: Array, default: [] },
        location: { type: String, default: "" },
        startDate: { type: Date, default: () => new Date() },
        endDate: { type: Date, default: () => new Date() },
        startTime: { type: Date, default: null },
        endTime: { type: Date, default: null },
        status: { type: Array, default: [] },
        eventType: { type: String, default: "normal" },
        remind: { type: Boolean, default: false },
    },
    {
        timestamps: true
    }
)

const Event = mongoose.model("Event", eventSchema)
module.exports = Event