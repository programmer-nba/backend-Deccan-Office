const mongoose = require('mongoose')
const { Schema } = mongoose

const permissionSchema = new Schema(
    {
        title: { type: String, require: true },
        active: { type: Boolean, default: true },
    }
)

const Permission = mongoose.model("Permission", permissionSchema)
module.exports = Permission