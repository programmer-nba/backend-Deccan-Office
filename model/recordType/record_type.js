const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Joi = require("joi");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const recordTypeSchema = new Schema({
    type_name: {type:String, required:false},
    type_number: {type:String, required:false},
    approve_flow: [{
        role: {type:String, required:false},
        level: {type:String, required:false},
    }],
},{timestamps:true});

const recordTpye = mongoose.model("record_type", recordTypeSchema);

module.exports = { recordTpye};

