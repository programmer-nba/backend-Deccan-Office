const mongoose = require('mongoose');

const ExamTypeSchema = new mongoose.Schema({
    extype_id: String,
    extype_name: String,
    extype_sub: [{
        position: {type:String, required: false}
    }]
}, { versionKey: false });

module.exports = mongoose.model('ExamType', ExamTypeSchema);