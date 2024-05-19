const mongoose = require('mongoose');

const ProjectTypeSchema = new mongoose.Schema({

    name: { type : String, required : false},
    code: { type : String, required : false}

} , { versionKey: false });

module.exports = mongoose.model('ProjectType', ProjectTypeSchema);