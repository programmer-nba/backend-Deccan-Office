const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaveTypeSchema = new Schema({
    
    leavetype_name : {type : String, required : false},
    leavetype_default : {type : Number, required : false, default : 0}

}, { versionKey: false });

module.exports = mongoose.model('LeaveType', LeaveTypeSchema);