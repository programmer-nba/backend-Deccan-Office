const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaveTypeSchema = new Schema({
    
    leavetype_name_eng : {type: String, required : false},
    leavetype_name_thai : {type : String, required : false}

}, { versionKey: false });

module.exports = mongoose.model('LeaveType', LeaveTypeSchema);