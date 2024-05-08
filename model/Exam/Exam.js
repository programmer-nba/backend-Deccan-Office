const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
    extype_id: String,
    question_1: String,
    question_2: String,
    question_3: String,
    c1 : String,
    c1_point : Number,
    c2 : String,
    c2_point : Number,
    c3 : String,
    c3_point : Number,
    c4 : String,
    c4_point : Number,
    cr_answer : String,         
    em_id : String,
    date_post: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    statusquestion: Number,
    image : String

}, { versionKey: false });

module.exports = mongoose.model('Exam', ExamSchema);