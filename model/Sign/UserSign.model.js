const { required } = require('joi');
const mongoose = require('mongoose');

const UserSignSchema = new mongoose.Schema({

    Sign : { type : String, required : true}

} , { versionKey: false });

module.exports = mongoose.model('UserSign', UserSignSchema);