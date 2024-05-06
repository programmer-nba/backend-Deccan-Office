const { required } = require('joi');
const mongoose = require('mongoose');

const SubTypeSchema = new mongoose.Schema({

    min_type : { type : String, required : true}, // ID Main Project
    sub_type_name : { type : String, required : true }
    

} , { versionKey: false });

module.exports = mongoose.model('SubType', SubTypeSchema);