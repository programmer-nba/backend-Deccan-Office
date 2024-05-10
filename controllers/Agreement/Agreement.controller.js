const Agreement = require ('../../model/Agreement/Agreement')
const { Employees } = require("../../model/employee/employee");
const Userinfo =require ('../../model/Userinfo/Userinfo')
var bcrypt = require("bcrypt");

//Get Agreement
exports.getallAgreement = async (req, res, next) => {
    try {
        const agreement = await Agreement.find();
        return res.json({
            message: 'Get Agreement data successfully!',
            status: true,
            data: agreement
        });
    } catch (err) {
        console.log(err)
        return res.json({
            message: ('Can not get types data', err.message),
            status: false,
            data: null
        })
    }
}

//Get Agreement By Id
exports.getAgreementById = async (req, res, next) => {
    try {
        const agreement = await Agreement.findById(req.params.id);
        return res.json({
            message: 'Get Agreement by id successfully!',
            status : true,
            data : agreement
        })
    }
    catch (err){
        console.log(err)
        return res.json({
            message: 'Can not get Agreement by id : '+ err.message,
            status: false,
            data : null
        })
    }
};

//Get Agreement by me
exports.getallAgreementByme = async (req, res, next) => {
    try {
        const user = req.decoded.id
        const userdata = await Userinfo.findById(user); //ดึงข้อมูลส่วนตัว
        if (!userdata) {
            return res.status(404).json({
                message: 'User not found',
                status: false,
                data: null
            });
        }
        console.log(userdata)

        const agreement = await Agreement.find({
            user_id : userdata._id,
        });

        return res.json({
            message: 'Get Agreement data successfully!',
            status: true,
            data: agreement
        });
    } catch (err) {
        console.log(err)
        return res.json({
            message: ('Can not get types data', err.message),
            status: false,
            data: null
        })
    }
}

//Insert Agreement
exports.InsertAgreement = async (req, res, next) => {
    console.log(req.decoded)
    const userid = req.decoded.id
    try {
        const { user_id, argument_type, argument_detail, argument_position, argument_salary, argument_timeout} = req.body
        const argument = new Agreement({
            user_id : user_id,
            argument_type : argument_type,
            argument_detail : argument_detail,
            argument_position : argument_position,
            argument_salary : argument_salary, //Number
            argument_timeout : argument_timeout,
            argument_timeline : [{
                timeline_userid : userid,
                timeline : Date.now(),
                action : "เพิ่มข้อมูล"
            }]
        })
        const saved_argument = await argument.save()
        if (!saved_argument) {
            return res.json({
                message: 'can not save argument',
                status: false,
                data: null
            })
        }
        return res.json({
            message: 'Insert argument successfully!',
            status: true,
            data: saved_argument
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            message: err.message,
            status: false,
            data: null
        })
    }
};

//Update Agreement
exports.updateAgreement = async (req, res, next) => {
    try {
        const agreement = await Agreement.findByIdAndUpdate(req.params.id, req.body);
        const userid = req.decoded.id

        const timelineEntry = {
            timeline_userid: userid,
            timeline: Date.now(),
            action: "แก้ไขข้อมูล"
        };

        agreement.argument_timeline.push(timelineEntry);
        await agreement.save();
        
        return res.json({
            message: 'Update agreement successfully!',
            status: true,
            data: agreement
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            message: err.message,
            status: false,
            data: null
        })
    }
};

//Delete Agreement
exports.DeleteAgreement = async (req, res, next) =>{
    try {
        const agreement = await Agreement.findByIdAndDelete(req.params.id);
        res.json({
            message: 'Delete agreement successfully!',
            status: true,
            data: agreement
        });
    } catch (err) {
        console.log(err)
        return res.json({
            message: err.message,
            status: false,
            data: null
        })
    }
};

//Update Userconfirm
exports.Userconfirm = async (req, res, next) => {
    try {
        const statusdata = await Agreement.findById(req.params.id);// ตรวจสอบสัญญาว่าถูกยอมไปหรือปฏิเสธ ไปหรือยัง
        let  statusagreement = statusdata.argument_status;
        if (statusagreement === "ไม่ยอมรับ") {
            return res.status(400).json({
                message: 'สัญญานี้ถูก ปฏิเสธ ไปแล้ว',
                status: false,
                data: null
            });
        } else if (statusagreement === "ยอมรับ") {
            return res.status(400).json({
                message: 'สัญญานี้ถูก ยอมรับ ไปแล้ว',
                status: false,
                data: null
            });
        }

        const user = req.decoded
        const userdata = await Userinfo.findById(user.id); //ดึงข้อมูลส่วนตัว
        if (!userdata) {
            return res.status(404).json({
                message: 'User not found',
                status: false,
                data: null
            });
        }

        const agreement = await Agreement.findByIdAndUpdate(req.params.id, req.body); //แก้ไขสถาณะ

        const status = req.body.argument_status;
        const timelineEntry = {
            timeline_userid: userdata._id,
            timeline: Date.now(),
            action: status
        };

        agreement.argument_status = status
        agreement.argument_timeline.push(timelineEntry);

        if (req.body.argument_status === "ยอมรับ"){

            //สรวจสอบว่ามีผู้ใช้ในระบบไหม
            const duplicate = await Employees.findOne({
                $or: [
                  { iden_number: userdata.citizen_id },
                  { userid: userdata.citizen_id }
                ]
            });
            if (duplicate) {
                if (duplicate.iden_number === userdata.citizen_id) {
                  return res
                    .status(409)
                    .json({ status: false, message: 'มีผู้ใช้นี้ในระบบแล้ว' });
                } else if (duplicate.userid === userdata.citizen_id) {
                  return res
                    .status(200)
                    .json({ status: false, message: 'มีผู้ใช้นี้ในระบบแล้ว' });
                }
            }
        
            let checkrole;
            if (agreement.argument_position === 'hr'){
                checkrole = 'hr'
            } else {
                checkrole = 'employee'
            }

            const newEmployeeData = {
                userid: userdata.citizen_id,
                first_name : userdata.name,
                last_name : userdata.lastname,
                iden_number : userdata.citizen_id,
                password : await bcrypt.hash(userdata.citizen_id, 10),
                role : checkrole,
                position : agreement.argument_position,
                tel : userdata.tel,
                address : userdata.address,
                birthday : userdata.birth,
                salary : agreement.agreement_salary
            };

            await agreement.save();
            const newEmployee = await Employees.create(newEmployeeData);

            if (newEmployee) {
                return res.status(201).json({
                    status: true,
                    message: 'เพิ่มข้อมูลพนักงานในระบบสำเร็จแล้ว',
                    data: newEmployee
                });
            }
        }
        return res.json({
            message: 'Update agreement successfully!',
            status: true,
            data: agreement
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            message: err.message,
            status: false,
            data: null
        })
    }
};