const { request } = require('express');
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    contact_type: {type : String, request : false},
    name: {type : String, request : false},
    email: {type : String, request : false},
    phone: {type : String, request : false},
    details : {type : String, request : false},
    examResult : String,
    updated_at: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model('Contact', ContactSchema);