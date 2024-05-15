const mongoose = require('mongoose');

const UserinfoSchema = new mongoose.Schema({
    citizen_id: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v.length === 13; // ตรวจสอบว่า citizen_id มีความยาว 13 หลัก
            },
            message: props => `${props.value} ไม่ใช่ citizen_id ที่ถูกต้อง (ควรมี 13 หลัก)`
        }
    },
    user_password: { type: String, request: false, default : ""},
    name: { type: String, request: false, default : ""},
    lastname : {type : String,  request : false, default : ""},
    email : {type : String,  request : false, default : ""},
    gender: { type: String, request: false, default : ""},
    birth: { type: String, request: false, default : ""},
    tel: { type: String, request: false, default : ""},
    status: { type: String, default: 'New', request : false },
    role: { type: String, default: 'User', request : false },
    country: { type: String, request: false, default : ""},
    religion: { type: String, request: false, default : ""},
    height: { type: String, request: false, default : "" },
    weight: { type: String, request: false, default : "" },
    marry: { type: String, request: false, default : "" },
    soldier: { type: String, request: false, default : "" },
    address: { type: String, request: false, default : "" },
    province: { type: String, request: false, default : "" },
    district : { type: String, request: false, default : "" },
    subdistrict : { type: String, request: false, default : "" },
    postal_code: { type: String, request: false, default : "" },
    line_id: { type: String, request: false, default : "" },
    job_title: { type: String, request: false, default : "" },
    desired_salary: { type: Number, request: false, default : null },
    image: { type: String, request: false, default : "" },
    can_work_outside_province: { type: Boolean, request: false, default: false },
    emergency_contact: { type: String, request: false, default: "" },
    chronic_diseases: { type: String, request: false, default: "" },
    job_application_source: { type: String, request: false, default: "" },
    has_applied_before: { type: Boolean, request: false, default: false },
    //ประวัติครอบครัว
    family: [{
        relation: { type: String, request: false, default: "ไม่ระบุ"}, //'บิดา', 'มารดา', 'สามีหรือภรรยา'
        name: { type: String, request: false, default: "" },
        surname: { type: String, request: false, default: "" },
        age: { type: Number, request: false, default: null },
        occupation: { type: String, request: false, default: "" },
        children: { type: Number, request: false, default: 0 },
        siblings: [{
            siblings_gender: { type: String, request: false, default: "ไม่ระบุ" },
            count: { type: Number, request: false, default: 0 },
            order: { type: Number, request: false, default: 0 }
        }]
    }],
    //รายละเอียดการศึกษา
    education_certificate: [{ 
        file : {type: String, request: false, default : ""}, //ตรงนี้เป็นการอัพโหลดไฟล์;
        from_date : { type : Date, required : false, default : null},
        to_date : { type : Date, required : false, default : null},
        institution : {type: String, request: false, default : ""},
        major : {type: String, request: false, default : ""}
    }],
    //ประสบการณ์การทำงาน
    working_experience: [{
        company : {type: String, request: false, default : ""},
        job_start : { type : Date, required : false, default : null},
        job_finnish: { type : Date, required : false, default : null},
        position : {type: String, request: false, default : ""},
        job_description : {type: String, request: false, default : ""},
        salary : {type: String, request: false, default : ""},
        reasons_resingnation : {type: String, request: false, default : ""}
    }],
    //ภาษา
    language_ability : [{
        language: { type: String, request: false, default : ""},
        speak: { type: String, request: false, default : "ไม่มี"},
        read: { type: String,  request: false, default : "ไม่มี"},
        write: { type: String,  request: false, default : "ไม่มี"},
        other_languages: [{ type: String, request: false, default : "" }]
    }],
    //ความสามารถพิเศษ
    special_ability: [{
        ability: { type: String, request: false, default: "ไม่ระบุ"}, //'พิมพ์ดีด', 'คอมพิวเตอร์', 'ขับรถ', 'ความสามารถในการใช้เครื่องใช้สำนักงาน', 'งานอดิเรก', 'กีฬาที่สนใจ', 'ความรู้พิเศษ', 'อื่นๆ'
        detail: { type: String, request: false, default: "" }
    }],
    exams: [{
        score: { type : Number, request : false, default : null},
        passed: { type : Boolean, request : false, default : null},
        exam_date: { type : Date, request : false, default : null}
    }],
    updated_at: { type: Date, request : false},
    user: { // เพิ่มฟิลด์ user ที่เชื่อมโยงกับโมเดล User
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // กำหนดความสัมพันธ์กับโมเดล User
        required: true
    }
}, { versionKey: false });

module.exports = mongoose.model('Userinfo', UserinfoSchema);