const { request } = require('express');
const { required } = require('joi');
const mongoose = require('mongoose');

const DraftDocumentSchema = new mongoose.Schema({

    draft_headers : {type: String, required: false, default : ""},//เรื่อง
    draft_type : {type : String, required: false},
    draft_to : {type: String, required: false, default : ""},
    draft_ot : {
        draft_timein : {type : Date, required : false},
        draft_timeout : {type : Date, required : false},
    },
    draft_remark : { type : String, required : false, default : "" },
    draft_detail :{type : String, required : false, default : ""},
    user : {type : String, required : false}
    
}, { versionKey: false });

module.exports = mongoose.model('DraftDocument', DraftDocumentSchema);