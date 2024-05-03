const Leave = require("../../model/leave/Leave");
const LeaveType = require("../../model/leave/LeaveType")
const { Employees } = require("../../model/employee/employee");

const dayjs = require('dayjs');

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

        let leaveid = 1; // ค่าเริ่มต้นสำหรับ leaveid
        if (latestleave) {
            leaveid = parseInt(latestleave.leave_id.slice(2)) + 1; // เพิ่มค่า leaveid
        }   
        const leaveidString = leaveid.toString().padStart(6, '0'); // แปลง leaveid เป็นสตริงพร้อมเติมเลข 0 ข้างหน้า

        const {  leave_date, leave_head, leave_type, details, date_start_leave, date_end_leave, contact, tel, } = req.body;

        const startDate = dayjs(date_start_leave);
        const endDate = dayjs(date_end_leave);
        
        const daysDiff = endDate.diff(startDate, 'day');

        const leave = new Leave({
            leave_id: leaveidString,

            employees_id : employee_id,
            leave_date: leave_date,
            leave_head: leave_head,

            leave_type: leave_type,
            details: details,

            date_start_leave: date_start_leave,
            date_end_leave: date_end_leave,

            contact: contact,
            tel: tel,

            set_day: daysDiff,
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
};

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