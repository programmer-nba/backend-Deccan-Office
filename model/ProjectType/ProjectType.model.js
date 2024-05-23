const { required } = require('joi');
const mongoose = require('mongoose');

const ProjectTypeSchema = new mongoose.Schema({

    type_name : { type : String, required : false, default : "" },
    type_code : { type : String, required : false, default : "" }, // เช่น DEV , GRP , MRK
    roles: { type: Array, default: [] }

} , { versionKey: false });

module.exports = mongoose.model('ProjectType', ProjectTypeSchema);