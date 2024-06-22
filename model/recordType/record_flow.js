const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Joi = require("joi");

const approveSchema = new Schema({
    role:{type:String, require:false},
    thai_role: {type:String, require:false},
    number_role: {type:Number, require:false},
},{timestamps:true});

const recordFlow = mongoose.model("record_flow", approveSchema);

module.exports = { recordFlow };

