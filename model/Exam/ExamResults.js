const { required } = require('joi');
const mongoose = require('mongoose');

const ExamResultsSchema = new mongoose.Schema({
    User_id : {type : String, required : false},
    Position_applied : {type : String, required : false},
    Score : {type : String, required : false, default : false},
    Result : {type : String, required : false},
    Position : {type : String, required : false},
    Meeting : {
        meeting_type : {type : String, required : false, default : "ยังไม่ได้นัดหมาย"}, //Online , Onsite
        meeting_date : {type : Date, required : false, default : null}
    },
    Meeting_result : {type : String, required : false, default : "รอนัดสัมภาษณ์"}, //รอสัมภาษณ์ , รอนัดสัมภาษณ์ , สัมภาษณ์แล้ว
    postid : { type : String, required : true},
    Create_date : {type : Date, required : false, default : Date.now()},
    Update_date : { type : Date, required : false, default : Date.now()}

}, { versionKey: false });

module.exports = mongoose.model('ExamResults', ExamResultsSchema);