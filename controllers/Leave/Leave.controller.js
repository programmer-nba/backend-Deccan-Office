const Leave = require("../../model/leave/Leave");
const LeaveType = require("../../model/leave/LeaveType")
const { Employees } = require("../../model/employee/employee");
const dayjs = require('dayjs');
const { recordType } = require("../../model/recordType/record_type");
const { roleEmployee } = require("../../model/employee/role");
const { assertIsOneOfOrUndefined } = require("pdf-lib");

//ดึงข้อมูลทั้งหมด
exports.getAll = async (req, res) => {
    try {
      const getAllLeave = await Leave.find();
      if (getAllLeave.length > 0) {
        return res.send({ 
            message : "ดึงข้อมูลสำเร็จ",
            status: true, 
            data: getAllLeave 
        });
      } else {
        return res.status(400).send({ 
            message: "ไม่พบข้อมูลใบลา",
            status: false, 
            data : null
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ 
        message: "มีบางอย่างผิดพลาด" ,
        status : false,
        data : null
    });
    }
};

//ดึงข้อมูลตามปีนั้นทั้งหมด
exports.getByYear = async (req, res, next) => {
  try {
      const date = new Date(req.params.date); // แปลงค่า date จาก string เป็น Date object
      const year = date.getFullYear(); // ดึงปีออกมาจาก Date object
      const leaves = await Leave.aggregate([
          {
              $match: {
                  $expr: {
                      $eq: [{ $year: '$Leave_date' }, year] // กรองเอกสารที่ year ของ Leave_date เท่ากับ year ที่ระบุ
                  }
              }
          }
      ]);
      return res.json({
          message: 'Get leaves by year successfully!',
          status : true,
          data : leaves
      })
  }
  catch (err){
      console.log(err)
      return res.json({
          message: 'Can not get leaves by year: '+ err.message,
          status: false,
          data : null
      })
  }
};

//ดึงข้อมูลตามปีของผู้ใช้คนนั้น
exports.getByEmployeeIdAndYear = async (req, res, next) => {
  try {
      const { employeeId, year } = req.params; // รับค่า Employees_id และ year จาก params
      const leaves = await Leave.aggregate([
          {
              $match: {
                  Employees_id: employeeId, // กรองเอกสารที่มี Employees_id ตรงกับ employeeId ที่ระบุ
                  $expr: { $eq: [{ $year: '$leave_date' }, parseInt(year)] } // กรองเอกสารที่ year ของ Date_Start_leave เท่ากับ year ที่ระบุ
              }
          }
      ]);
      return res.json({
          message: 'Get leaves by employeeId and year successfully!',
          status : true,
          data : leaves
      })
  }
  catch (err){
      console.log(err)
      return res.json({
          message: 'Can not get leaves by employeeId and year: '+ err.message,
          status: false,
          data : null
      })
  }
};

//ดึงข้อมูลตาม Type ID
exports.getByType = async (req, res, next) => {
    try {
        const leave = await Leave.findOne({ leave_type : req.body.leavetype_code });

        const leavetype = await LeaveType.findOne({ _id : req.body.leavetype_code });
        if (!leavetype) {
            return res.json({
                message: 'ไม่พบประเภทใบลา',
                status: false,
                data: null
            });
        }

        if (!leave) {
            return res.json({
                message: 'ไม่พบใบลา',
                status : false,
                data : null
            })
        }
        return res.json({
            message: 'ดึงข้อมูลตาม '+ leavetype.leavetype_name + ' สำเร็จ',
            status : true,
            data : leave
        })
    }
    catch (err){
        console.log(err)
        return res.json({
            message: 'Can not get leave by id : '+ err.message,
            status: false,
            data : null
        })
    }
};

//เพิ่มข้อมู,ใบลา
exports.InsertLeave = async (req, res, next) => {
    try {
        const latestleave = await Leave.findOne().sort({ leave_id: -1 }).limit(1);
        const employee_id = req.decoded.id
        const role = req.decoded.role
        const position = req.decoded.position
        const findEmployee = await Employees.findById(employee_id)
            if(!findEmployee){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่พบพนักงาน"})
            }
        let leaveid = 1; // ค่าเริ่มต้นสำหรับ leaveid
        if (latestleave) {
            leaveid = parseInt(latestleave.leave_id.slice(2)) + 1; // เพิ่มค่า leaveid
        }   
        const leaveidString = leaveid.toString().padStart(6, '0'); // แปลง leaveid เป็นสตริงพร้อมเติมเลข 0 ข้างหน้า
        const {  leave_date, leave_head, leave_type, details, date_start_leave, date_end_leave, type_name, contact, tel, } = req.body;

        const startDate = dayjs(date_start_leave)
        const endDate = dayjs(date_end_leave)
        let daysDiff
        let time_leave

        // ตรวจสอบว่า startDate และ endDate มี format ที่ถูกต้องหรือไม่
        if (startDate.isValid() && endDate.isValid()) {
            // คำนวณหาความต่างของวันที่
            daysDiff = endDate.diff(startDate);
            if(leave_type == "ลาครึ่งวัน"){
                // แปลงเป็นรูปแบบชั่วโมง นาที วินาที
                const hours = Math.floor(daysDiff / (1000 * 60 * 60));
                const minutes = Math.floor((daysDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((daysDiff % (1000 * 60)) / 1000);

                time_leave = `${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`
                console.log(time_leave)
            }else{
                // แปลงเป็นรูปแบบ "วัน, ชั่วโมง, นาที"
                const days = Math.floor(daysDiff / (1000 * 60 * 60 * 24)); // หารายการวันทั้งหมด
                const hours = Math.floor((daysDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // คิดเป็นชั่วโมง
                const minutes = Math.floor((daysDiff % (1000 * 60 * 60)) / (1000 * 60)); // คิดเป็นนาที

                time_leave = `${days} วัน ${hours} ชั่วโมง ${minutes} นาที`
            }

            console.log(daysDiff);
        } else {
            console.log("Invalid date format");
        }
        const type = await recordType.findOne({type_name:type_name})
            if(!type){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่พบประเภทเอกสารที่ต้องการ"})
            }

        const roleAll = await roleEmployee.find()
            if(roleAll.length == 0){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่สามารถค้นหา role employee ได้"})
            }

        const index = type.approve_flow.findIndex(flow => {
            if(flow.role == role && flow.position == position){
                return true
            }else if(flow.role == role && flow.position == ""){
                let isFound = false
                for (const element of type.approve_flow) {
                    if (element.role == role && element.position == position) {
                      isFound = true;
                      break;
                    }
                }
                if(!isFound){
                    return true
                }else{
                    return false
                }
            }
            return false
        })
        let nextApproveFlow
        let status_document
        if (index !== -1 && index + 1 <= type.approve_flow.length){
            nextApproveFlow = type.approve_flow[index + 1];
            if(nextApproveFlow.number_role == 1){
                status_document = `รอผู้บริหารอนุมัติ`
            }else if(nextApproveFlow.position == ""){
                let roleNextIndex = roleAll.filter(item => item.role == nextApproveFlow.role)
                const documents = roleNextIndex.filter(item => item.scope.includes(position));
                // console.log(roleNextIndex)
                console.log(documents)
                status_document = `รอ${documents[0].thai_role}${documents[0].thai_position}อนุมัติ`
            }else{
                let roleNextIndex = roleAll.find(item => item.role == nextApproveFlow.role && item.position == nextApproveFlow.position)
                status_document = `รอ${roleNextIndex.thai_role}${roleNextIndex.thai_position}อนุมัติ`
            }
        }else{
            let roleIndex = roleAll.find(item => item.role == role && item.position == position)
            nextApproveFlow = type.approve_flow.find(item => item.number_role < roleIndex.number_role) //number_role ยิ่งน้อยยิ่งมีอำนาจ
            // console.log(findIndex)
                if(nextApproveFlow.number_role == 1){
                    status_document = 'รอผู้บริหารอนุมัติ'
                }else if(nextApproveFlow.position == ""){
                    let roleNextIndex = roleAll.filter(item => item.role == nextApproveFlow.role)
                    const documents = roleNextIndex.filter(item => item.scope.includes(position));
                    status_document = `รอ${documents[0].thai_role}${documents[0].thai_position}อนุมัติ`
                }else{
                    let roleNextIndex = roleAll.find(item => item.role == nextApproveFlow.role && item.position == nextApproveFlow.position)
                    status_document = `รอ${roleNextIndex.thai_role}${roleNextIndex.thai_position}อนุมัติ`
                }
        }
        // console.log(findIndex[0].role)
        const status_detail = [{
            employee_id: employee_id,
            role: findEmployee.role,
            position: findEmployee.position,
            status: "ยื่นคำขอ",
            date: dayjs(Date.now()),
            remark: ""
        }]

        const leave = new Leave({
            leave_id: leaveidString,

            employees_id : employee_id,
            type_name : type_name,
            leave_date: leave_date,
            leave_head: leave_head,

            leave_type: leave_type,
            details: details,

            date_start_leave: date_start_leave,
            date_end_leave: date_end_leave,

            contact: contact,
            tel: tel,

            set_day: daysDiff,
            time_leave: time_leave,
            number_role: nextApproveFlow.number_role,
            status_document: status_document,
            status_detail: status_detail
        });
        const saved_leave = await leave.save();
        if (!saved_leave) {
            return res.json({
                message: 'ไม่สามารถบันทึกข้อมูลใบลาได้',
                status: false,
                data: null
            });
        }
        return res.json({
            message: 'บันทึกข้อมูลใบลาสำเร็จ!',
            status: true,
            data: saved_leave
        });
    } catch (err) {
        console.log(err);
        return res.json({
            message: err.message,
            status: false,
            data: null
        });
    }
};

//ดึงข้อมูลตาม id ใบลา
exports.getByID = async (req, res, next) => {
  try {
      const leave = await Leave.findById(req.params.id);
      return res.json({
          message: 'Get leave by id successfully!',
          status : true,
          data : leave
      })
  }
  catch (err){
      console.log(err)
      return res.json({
          message: 'Can not get leave by id : '+ err.message,
          status: false,
          data : null
      })
  }
};

//ดึงข้อมูลทั้งหมดตามรหัสพนักงาน
exports.getByEmID = async (req, res, next) => {
    try {
        const leave = await Leave.find({ employees_id: req.params.employees_id });
        if (leave.length === 0) {
            return res.json({
                message: 'ไม่พบข้อมูลใบลาของพนักงาน',
                status: false,
                data: null
            });
        } else {
            return res.json({
                message: 'Get leave by id successfully!',
                status: true,
                data: leave
            });
        }
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'Can not get leave by id : ' + err.message,
            status: false,
            data: null
        });
    }
};

//อัพเดตใบลา
exports.Update = async (req, res, next) => {
    try {
        const record_id = req.params.id
        const role = req.decoded.role
        const id = req.decoded.id
        const position = req.decoded.position
        const { statusApprove, remark } = req.body;
            if(statusApprove != 'อนุมัติ' && statusApprove != 'ไม่อนุมัติ' && statusApprove != 'แก้ไข'){
                return res
                        .status(400)
                        .send({status:false, message:"กรุณาใส่สถานะให้ถูกต้อง"})
            }
    
        const type = await recordType.findOne({type_name:"บันทึกข้อความการลา"})
            if(!type){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่พบประเภทเอกสารที่ต้องการ"})
            }
        let status_detail
        const findDocument = await Leave.findById(record_id)
            if (findDocument) {
                console.log(findDocument)
                status_detail = findDocument.status_detail[findDocument.status_detail.length - 1];
                let statusDocs = findDocument.status_document
                if(statusDocs == 'รอตรวจสอบ'){
                    return res
                            .status(400)
                            .send({status:false, message:"กรุณารอการแก้ไขจากผู้ร้องขอ"})
                }else if(statusDocs == 'ไม่อนุมัติ'){
                    return res
                            .status(400)
                            .send({status:false, message:"เอกสารนี้ไม่อนุมัติเป็นที่เรียบร้อยแล้ว"})
                }else if (statusDocs == 'อนุมัติ'){
                    return res
                            .status(400)
                            .send({status:false, message:"เอกสารนี้อนุมัติเป็นที่เรียบร้อยแล้ว"})
                }
                // ทำสิ่งที่ต้องการกับ findRole ต่อไป
            } else {
                return res
                        .status(400)
                        .send({status:false, message:"ไม่พบเอกสารที่ท่านต้องการ"})
            }
        const roleAll = await roleEmployee.find()
            if(roleAll.length == 0){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่สามารถค้นหา role employee ได้"})
            }
        let roleUser = roleAll.find(item => item.role == role && item.position == position)
        let roleStatusLast = roleAll.find(item => item.role == status_detail.role && item.position == status_detail.position)
            if (!roleUser) {
                return res
                        .status(404)
                        .send({status:false, message:`ไม่สามารถหา role: ${role}, position: ${position}`})
            }
            if (!roleStatusLast) {
                return res
                        .status(404)
                        .send({status:false, message:`ไม่สามารถหา status last for role: ${status_detail.role}, position: ${status_detail.position}`})
            }
            if(status_detail.role == role && status_detail.position == position){
                return res
                        .status(400)
                        .send({status:false, message:`คุณได้ทำการ ${status_detail.status} ไปแล้ว`})
            }
            if(roleUser.number_role > findDocument.number_role){
                return res
                        .status(400)
                        .send({status:false, message:"คุณไม่มีสิทธิ์ทำรายการเอกสารนี้"})
            }

        const index = type.approve_flow.findIndex(flow => {
            if(flow.role == role && flow.position == position){
                return true
            }else if(flow.role == role && flow.position == ""){
                let isFound = false
                for (const element of type.approve_flow) {
                    if (element.role == role && element.position == position) {
                      isFound = true;
                      break;
                    }
                }
                if(!isFound){
                    return true
                }else{
                    return false
                }
            }
            return false
        })
        console.log("index:",index)
        let number_role
        let status_document
        let status
        let detail = {
                employee_id:id,
                role:role,
                position:position,
                date: dayjsTimestamp,
                status:status
        }
            // ถ้าเจอ index และต้องการใช้ approve_flow ตัวถัดไป
            if (index !== -1 && index + 1 <= type.approve_flow.length) {
                let nextPush = index + 1
                console.log("nextPush:",nextPush)
                const nextApproveFlow = type.approve_flow[index + 1];
                console.log("nextApproveFlow:",nextApproveFlow)
                if(statusApprove == 'ไม่อนุมัติ'){
                    status_document = 'ไม่อนุมัติ'
                    detail.status = "ไม่อนุมัติ"
                    detail.remark = remark
                }else if(statusApprove == 'อนุมัติ'){
                    if(roleUser.number_role == 1){
                            status_document = 'อนุมัติ'
                            status = 'อนุมัติ'
                            number_role = roleUser.number_role
                    }else{
                        let nextIndex = nextApproveFlow
                            number_role = nextIndex.number_role
                            if(nextIndex.number_role == 1){
                                status_document = `รอผู้บริหารอนุมัติ`
                                status = 'อนุมัติ'
                            }else if(nextIndex.position == ""){
                                let roleNextIndex = roleAll.filter(item => item.role == nextIndex.role)
                                const documents = roleNextIndex.map(item => {
                                    if (item.scope.includes(position)) {
                                            return item
                                        }
                                        return []
                                    }).flat();
                                console.log("documents:",documents)
                                status_document = `รอ${documents[0].thai_role}${documents[0].thai_position}อนุมัติ`
                                status = 'อนุมัติ'
                            }else{
                                let roleNextIndex = roleAll.find(item => item.role == nextIndex.role && item.position == nextIndex.position)
                                console.log("roleNextIndex:",roleNextIndex)
                                status_document = `รอ${roleNextIndex.thai_role}${roleNextIndex.thai_position}อนุมัติ`
                                status = 'อนุมัติ'
                            }
                    }
                    detail.status = status
                }else if (statusApprove == 'แก้ไข'){
                    number_role = 4
                    detail.remark = remark
                    status_document = 'รอตรวจสอบ'
                    detail.status = 'แก้ไข'
                }
            } else {
                console.log('No next approve flow found or index out of bounds');
                return res
                        .status(404)
                        .send({status:false, message:"คุณไม่มีสิทธิ์แก้ไขเอกสารนี้"})
            }

        const updateLeave = await Leave.findByIdAndUpdate(
            record_id,
            {
                number_role:number_role,
                status_document: status_document,
                $push:{
                    status_detail:detail
                }
            },
            {new:true})

            if(!updateLeave){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่พบเอกสารที่คุณต้องการ"})
            }

        return res
                .status(200)
                .send({status:true, data:updateLeave})    
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Can not update leave: ' + err.message,
            status: false,
            data: null
        });
    }
};

exports.updateLeave = async (req, res)=>{
    try{
        const record_id = req.params.id
        const role = req.decoded.role
        const position = req.decoded.position
        const employee_id = req.decoded.id
        const findRecord = await Leave.findById(record_id)
            if(!findRecord){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่สามารถค้นหาเอกสารเจอ"})
            }
        const employee = findRecord.status_detail.find(detail => detail.employee_id == employee_id && detail.status == 'ยื่นคำขอ')
            if(!employee){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่สามารถแก้ไขเอกสารนี้ได้เนื่องจากคุณไม่ใช่ผู้ยื่นคำขอ"})
            }
        const type = await recordType.findOne({type_name:findRecord.type_name})
            if(!type){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่พบประเภทเอกสารที่ต้องการ"})
            }

        const roleAll = await roleEmployee.find()
            if(roleAll.length == 0){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่สามารถค้นหา role employee ได้"})
            }

        const index = type.approve_flow.findIndex(flow => {
            if(flow.role == role && flow.position == position){
                return true
            }else if(flow.role == role && flow.position == ""){
                let isFound = false
                for (const element of type.approve_flow) {
                    if (element.role == role && element.position == position) {
                      isFound = true;
                      break;
                    }
                }
                if(!isFound){
                    return true
                }else{
                    return false
                }
            }
            return false
        })
        let nextApproveFlow
        let status_document
        if (index !== -1 && index + 1 <= type.approve_flow.length){
            nextApproveFlow = type.approve_flow[index + 1];
            if(nextApproveFlow.number_role == 1){
                status_document = `รอผู้บริหารอนุมัติ`
            }else if(nextApproveFlow.position == ""){
                let roleNextIndex = roleAll.filter(item => item.role == nextApproveFlow.role)
                const documents = roleNextIndex.filter(item => item.scope.includes(position));
                // console.log(roleNextIndex)
                console.log(documents)
                status_document = `รอ${documents[0].thai_role}${documents[0].thai_position}อนุมัติ`
            }else{
                let roleNextIndex = roleAll.find(item => item.role == nextApproveFlow.role && item.position == nextApproveFlow.position)
                status_document = `รอ${roleNextIndex.thai_role}${roleNextIndex.thai_position}อนุมัติ`
            }
        }else{
            let roleIndex = roleAll.find(item => item.role == role && item.position == position)
            nextApproveFlow = type.approve_flow.find(item => item.number_role < roleIndex.number_role) //number_role ยิ่งน้อยยิ่งมีอำนาจ
            // console.log(findIndex)
                if(nextApproveFlow.number_role == 1){
                    status_document = 'รอผู้บริหารอนุมัติ'
                }else if(nextApproveFlow.position == ""){
                    let roleNextIndex = roleAll.filter(item => item.role == nextApproveFlow.role)
                    const documents = roleNextIndex.filter(item => item.scope.includes(position));
                    status_document = `รอ${documents[0].thai_role}${documents[0].thai_position}อนุมัติ`
                }else{
                    let roleNextIndex = roleAll.find(item => item.role == nextApproveFlow.role && item.position == nextApproveFlow.position)
                    status_document = `รอ${roleNextIndex.thai_role}${roleNextIndex.thai_position}อนุมัติ`
                }
        }
        // console.log(findIndex[0].role)
        const status_detail = [{
            employee_id: employee_id,
            role: role,
            position: position,
            status: "ผู้ยื่นคำขอทำการแก้ไข",
            date: dayjs(Date.now()),
            remark: ""
        }]

        const update = await Leave.findByIdAndUpdate(
            record_id,
            {
                number_role: nextApproveFlow.number_role,
                status_document: status_document,
                $push:{
                    status_detail:status_detail
                }
            },{new:true}
        )
        return res
                .status(200)
                .send({status:true, data:update})
    }catch(err){
        return res
                .status(500)
                .send({status:false, message:err.message})
    }
}

//ลบใบลา
exports.Delete = async (req, res, next) => {
  try {
      const leave = await Leave.findByIdAndDelete(req.params.id);
      res.json({
          message: 'Delete Leave successfully!',
          status: true,
          data: leave
      });
  } catch (err) {
      console.log(err)
      return res.json({
          message: err.message,
          status: false,
          data: null
      })
  }
}

// Get Leave By Me
exports.getLeaveByMe = async (req, res, next) => {
    try {
        const user_id = req.decoded.id
        const leave = await Leave.find({ 'employee_id': user_id });
        return res.json({
            message: 'Get leave by Me successfully!',
            status: true,
            data: leave
        });
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'Can not get documents by Me : ' + err.message,
            status: false,
            data: null
        });
    }
};

//คำนวนวันที่ตาม id พนักงาน
exports.calculateLeave = async (req, res) => {
    try {
        const { employees_id, leavetype_code } = req.body;

        const stats = await Leave.aggregate([
            {
                $match: {
                    employees_id: employees_id,
                    leave_type: leavetype_code,
                    "Status.Status_name": "Allow"
                }
            },
            {
                $group: {
                    _id: "$employees_id",
                    totalSetDay: { $sum: "$set_day" }
                }
            }
        ]);
        const employeemodel = await Employees.findOne({ _id : employees_id });
        if (!employeemodel) {
            return res.json({
                message: 'ไม่พบพนักงาน',
                status: false,
                data: null
            });
        }
        const leavetype = await LeaveType.findOne({ _id : leavetype_code });
        if (!leavetype) {
            return res.json({
                message: 'ไม่พบประเภทใบลา',
                status: false,
                data: null
            });
        }

        if  (stats.length === 0 || stats[0].totalSetDay <= 0) {
            return res.json({
                message: 'ผู้ใช้นี้ไม่มีวันลา',
                status: false,
                data: employeemodel.first_name + " " + employeemodel.last_name + " " + leavetype.leavetype_name + " ทั้งหมด 0 วัน"
            });
        }else{
            return res.json({
                message: 'คำนวณจำนวนจำนวนวันลาทั้งหมดสำเร็จ',
                status: true,
                data: employeemodel.first_name + " " + employeemodel.last_name + " " + leavetype.leavetype_name + " ทั้งหมด " + stats + " วัน"
            });
        }
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'เกิดข้อผิดพลาดในการคำนวณจำนวน '+ err.message,
            status: false
        });
    }
};

//อนุมัติใบลา
exports.approveleave = async (req, res) => {
    try {
        const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!leave) {
            return res.status(404).json({
                message: 'leave not found',
                status: false,
                data: null
            });
        }
        return res.json({
            message: 'Update leave successfully!',
            status: true,
            data: leave
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Can not update leave: ' + errorMessage,
            status: false,
            data: null
        });
    }
}

exports.getFlow = async(req, res)=>{
    try{
        const role = req.decoded.role
        const position = req.decoded.position
        // console.log(role, position)
        const roleAll = await roleEmployee.findOne({role:role, position:position})
        console.log(roleAll)
            if(roleAll.length == 0){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่สามารถค้นหา role employee ได้"})
            }
        let get
        if(role != 'ผู้บริหาร'){
            get = await Leave.find({status_document:`รอ${roleAll.thai_role}${roleAll.thai_position}อนุมัติ`}).sort({createdAt:-1})
            
            if(!get){
                return res
                        .status(404)
                        .send({status:true, data:'ไม่สามารถหาข้อมูลได้'})
            }
        }else{
            get = await Leave.find({status_document:'รอผู้บริหารอนุมัติ'}).sort({createdAt:-1})
            if(!get){
                return res
                        .status(404)
                        .send({status:true, data:'ไม่สามารถหาข้อมูลได้'})
            }
        }
        return res
                .status(200)
                .send({status:true, data:get})
        
    }catch(err){
        return res
                .status(500)
                .send({status:false, message:err.message})
    }
}

exports.getFlowScope = async(req, res)=>{
    try{
        const role = req.decoded.role
        const position = req.decoded.position
        const roleAll = await roleEmployee.findOne({role:role, position:position})
            if(roleAll.length == 0){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่สามารถค้นหา role employee ได้"})
            }
        // Ensure roleAll.scope is an array of strings
        const scopes = Array.isArray(roleAll.scope) ? roleAll.scope : [roleAll.scope];
        // console.log(scopes)
        let findLeave
        if(role != 'owner'){
            findLeave = await Leave.find({
                [`status_detail.0.position`]: { $in: scopes }
            }).sort({createdAt:-1})
                if(findLeave.length == 0){
                    return res
                            .status(404)
                            .send({status:true, data:'ไม่สามารถหาข้อมูลได้'})
                }
        }else{
            findLeave = await Leave.find().sort({createdAt:-1})
            if(findLeave.length == 0){
                return res
                        .status(404)
                        .send({status:true, data:'ไม่สามารถหาข้อมูลได้'})
            }
        }
        
        return res
                .status(200)
                .send({status:true, data:findLeave})
    }catch(err){
        console.log(err)
        return res
                .status(500)
                .send({status:false, message:err.message})
    }
}

exports.getLeaveMe = async(req, res)=>{
    try{
        const id = req.decoded.id
        const get = await Leave.find({employees_id:id}).sort({createdAt:-1})
        if(get){
            return res
                    .status(200)
                    .send({status: true, data:get})
        }else{
            return res
                    .status(400)
                    .send({status: false, message:"ไม่สามารถเรียกดูข้อมูลได้"})
        }
    }catch(err){
        return res  
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}