const mongoose = require('mongoose');

const ProjectTypeSchema = new mongoose.Schema({

    name: { type : String, required : false},
    code: { type : String, required : false},
    roles: { type: Array, default: [] }

} , { versionKey: false });

module.exports = mongoose.model('ProjectType', ProjectTypeSchema);