const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
    role:{type: String, required:false},
    thai_role:{type: String, required:false},
    position:{type: String, required:false},
    thai_position:{type: String, required:false},
    Abbreviation: {type: String, required:false},
    number_role: {type: Number, required:false},
    scope: {type:Array, required:false}
}, { roleSchema: false });

const roleEmployee = mongoose.model("role_employee", roleSchema);

module.exports = { roleEmployee };
