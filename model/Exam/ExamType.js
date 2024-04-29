const mongoose = require('mongoose');

const ExamTypeSchema = new mongoose.Schema({
    extype_id: String,
    extype_name: String,
}, { versionKey: false });

module.exports = mongoose.model('ExamType', ExamTypeSchema);