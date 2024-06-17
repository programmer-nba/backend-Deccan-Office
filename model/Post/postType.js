const { required } = require('joi');
const mongoose = require('mongoose');

const postTypeSchema = new mongoose.Schema({
    post_type: {type: String, required : false}, 
    post_number: {type : String, required : false, default : ""},
}, { timestamps: true });

const postType = mongoose.model('post_type', postTypeSchema);

module.exports = { postType }