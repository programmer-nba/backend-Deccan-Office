const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Joi = require("joi");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const recordTypeSchema = new Schema({
    type_name: {type:String, required:false},
    type_number: {type:String, required:false},
    approve_flow: [{
        role: {type:String, required:false},
        thai_role : {type:String, required:false},
        position: {type:String, required:false},
        thai_position : {type:String, required:false},
        number_role: {type:Number, required:false},
    }],
},{timestamps:true});

const recordType = mongoose.model("record_type", recordTypeSchema);

module.exports = { recordType};

