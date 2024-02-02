const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Joi = require("joi");

const projectPartnerSchema = new Schema({
    type: {type:String, require: true},
    project_name: {type:String, require: true},
    price: {type:String, require: true},
    detail: {type:String, require: false}
},{timestamps:true});

const projectPartner = mongoose.model("project_partner", projectPartnerSchema);

module.exports = {projectPartner};