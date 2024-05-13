const { required } = require('joi');
const mongoose = require('mongoose');

const signatureSchema = new mongoose.Schema({
    user_id : { type : String, required : false, default : ""},
    terms_id : { type : String, required : false, default : "" },
    signature : { type : String, required : false, default : ""}
}, { versionKey: false });

module.exports = mongoose.model('signatureSchema', signatureSchema);