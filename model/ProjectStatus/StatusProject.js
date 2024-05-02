const mongoose = require('mongoose');

const StatusProjectSchema = new mongoose.Schema({
    Status_id: { // เพิ่มส่วนของ Status_id
        type: Number,
        required: true,
        enum: [1, 2, 3, 4], // กำหนดค่าที่สามารถเลือกได้สำหรับ Status_id
        default: 3 // กำหนดค่าเริ่มต้นสำหรับ Status_id
    },
    projectStatus: { // สถานะของโปรเจ็ค
        type: String,
        required: true,
        enum: ['โปรเจ็คเสร็จลุล่วง', 'อยู่ระหว่างการทำงาน', 'โปรเจ็ครอการอนุมัติ', 'โปรเจ็คถูกระงับ'], // กำหนดค่าที่สามารถเลือกได้สำหรับ projectStatus
        default: 'โปรเจ็ครอการอนุมัติ' // กำหนดค่าเริ่มต้นสำหรับ projectStatus
    }
});

module.exports = mongoose.model('StatusProject', StatusProjectSchema);
