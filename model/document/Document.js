const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
    Document_id : {type: String, required: false}, // รันอัตโนมัติ
    Year: {type: Number, required: false},
    Headers : {type: String, required: false},//เรื่อง
    To : {type: String, required: false }


}, { versionKey: false });

module.exports = mongoose.model('Document', DocumentSchema);