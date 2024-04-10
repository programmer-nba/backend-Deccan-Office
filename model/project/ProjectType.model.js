const mongoose = require('mongoose');

const ProjectTypeSchema = new mongoose.Schema({

    Type_name: { type : String, required : false},
    Type_code: { type : String, required : false}

} , { versionKey: false });

module.exports = mongoose.model('ProjectType', ProjectTypeSchema);