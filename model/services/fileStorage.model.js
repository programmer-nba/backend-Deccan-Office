const mongoose = require('mongoose');
const { Schema } = mongoose;

const fileStorageSchema = new Schema(
    {
        user_id: String,
        fileName: String,
        fileType: String,
        title: String
    },
    {
        timestamps: true
    }
)

const FileStorage = mongoose.model('FileStorage', fileStorageSchema)
module.exports = FileStorage