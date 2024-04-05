const { trusted } = require("mongoose");
const Leave = require("../../model/leave/Leave");
const dayjs = require('dayjs');

//ดึงข้อมูลทั้งหมด
exports.getAll = async (req, res) => {
    try {
      const getAllLeave = await Leave.find();
      if (getAllLeave.length > 0) {
        return res.send({ status: true, data: getAllLeave });
      } else {
        return res.status(400).send({ status: false, message: "ไม่พบข้อมูลใบลา" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "มีบางอย่างผิดพลาด" });
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
                  $expr: { $eq: [{ $year: '$Leave_date' }, parseInt(year)] } // กรองเอกสารที่ year ของ Date_Start_leave เท่ากับ year ที่ระบุ
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

//เพิ่มข้อมู,ใบลา
exports.InsertLeave = async (req, res, next) => {
    try {
        const latestleave = await Leave.findOne().sort({ Leave_id: -1 }).limit(1);

        let leaveid = 1; // ค่าเริ่มต้นสำหรับ leaveid
        if (latestleave) {
            leaveid = parseInt(latestleave.Leave_id.slice(2)) + 1; // เพิ่มค่า leaveid
        }   
        const leaveidString = leaveid.toString().padStart(6, '0'); // แปลง leaveid เป็นสตริงพร้อมเติมเลข 0 ข้างหน้า

        const { Employees_id, Leave_date, Leave_head, Leave_Type, Details, Date_Start_leave, Date_End_leave, Contact, Tel, } = req.body;

        const startDate = dayjs(Date_Start_leave);
        const endDate = dayjs(Date_End_leave);
        
        const daysDiff = endDate.diff(startDate, 'day');

        const leave = new Leave({
            Leave_id: leaveidString,

            Employees_id : Employees_id,
            Leave_date: Leave_date,
            Leave_head: Leave_head,

            Leave_Type: Leave_Type,
            Details: Details,

            Date_Start_leave: Date_Start_leave,
            Date_End_leave: Date_End_leave,

            Contact: Contact,
            Tel: Tel,

            Set_Day: daysDiff,
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

//ดึงข้อมูลทั้งหมดตาม id ใบลา
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
        const leave = await Leave.find({ Employees_id: req.params.Employees_id });
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

//คำนวนวันที่ลาป่วยตาม id พนักงาน
exports.calculateSick = async (req, res) => {
    try {
        const { Employees_id } = req.params;
    
        const stats = await Leave.aggregate([
            {
            $match: {
                Employees_id: Employees_id,
                Leave_Type: "Sick",
                "Status.Status_name": "Allow"
            }
            },
            {
            $group: {
                _id: "$Employees_id",
                totalSetDay: { $sum: "$Set_Day" }
            }
            }
        ]);
        if (stats.length === 0 || stats[0].totalSetDay <= 0) {
            return res.json({
                message: 'ผู้ใช้นี้ไม่มีวันที่เคยลาป่วย',
                status: false,
                data: Employees_id + " ลาทั้งหมด " + 0 + " วัน"
            });
        } else {
            return res.json({
                message: 'คำนวณจำนวนจำนวนวันลาทั้งหมดสำเร็จ',
                status: true,
                data: stats
            });
        }
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'เกิดข้อผิดพลาดในการคำนวณจำนวน Set_Day Sick',
            status: false
        });
    }
};

//คำนวนวันที่ลากิจตาม id พนักงาน
exports.calculateBusinecss = async (req, res) => {
    try {
        const { Employees_id } = req.params;
        const stats = await Leave.aggregate([
            {
                $match: {
                  Employees_id: Employees_id,
                  Leave_Type: "Business",
                  "Status.Status_name": "Allow"
                }
              },
            {
              $group: {
                _id: "$Employees_id",
                totalSetDay: { $sum: "$Set_Day" }
              }
            }
        ]);
        if (stats.length === 0 || stats[0].totalSetDay <= 0) {
            return res.json({
                message: 'ผู้ใช้นี้ไม่มีวันที่เคยลากิจ',
                status: false,
                data: Employees_id + " ลาทั้งหมด " + 0 + " วัน"
            });
        } else {
            return res.json({
                message: 'คำนวณจำนวนจำนวนวันลาทั้งหมดสำเร็จ',
                status: true,
                data: stats
            });
        }
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'เกิดข้อผิดพลาดในการคำนวณจำนวน Set_Day Businecss',
            status: false
        });
    }
};

//คำนวนวันที่ลาคลอดตาม id พนักงาน
exports.calculateMaternity = async (req, res) => {
    try {
        const { Employees_id } = req.params;
        const stats = await Leave.aggregate([
            {
                $match: {
                    Employees_id: Employees_id,
                    Leave_Type: "Maternity",
                    "Status.Status_name": "Allow"
                }
            },
            {
                $group: {
                    _id: "$Employees_id",
                    totalSetDay: { $sum: "$Set_Day" }
                }
            }
        ]);
        if (stats.length === 0 || stats[0].totalSetDay <= 0) {
            return res.json({
                message: 'ผู้ใช้นี้ไม่มีวันที่เคยลาคลอด',
                status: false,
                data: Employees_id + " ลาทั้งหมด " + 0 + " วัน"
            });
        } else {
            return res.json({
                message: 'คำนวณจำนวนจำนวนวันลาทั้งหมดสำเร็จ',
                status: true,
                data: stats
            });
        }
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'เกิดข้อผิดพลาดในการคำนวณจำนวน Set_Day Maternity',
            status: false
        });
    }
};

//คำนวนวันที่ลาบวชตาม id พนักงาน
exports.calculateOrdination = async (req, res) => {
    try {
        const { Employees_id } = req.params;
        const stats = await Leave.aggregate([
        {
            $match: {
                Employees_id: Employees_id,
                Leave_Type: "Ordination",
                "Status.Status_name": "Allow"
            }
        },
        {
            $group: {
                _id: "$Employees_id",
                totalSetDay: { $sum: "$Set_Day" }
            }
        }
    ]);
        if  (stats.length === 0 || stats[0].totalSetDay <= 0) {
            return res.json({
                message: 'ผู้ใช้นี้ไม่มีวันที่เคยลาบวช',
                status: false,
                data: Employees_id + " ลาทั้งหมด 0 วัน"
            });
        }else{
            return res.json({
                message: 'คำนวณจำนวนจำนวนวันลาทั้งหมดสำเร็จ',
                status: true,
                data: stats
            });
        }
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'เกิดข้อผิดพลาดในการคำนวณจำนวน Set_Day Ordination',
            status: false
        });
    }
}; 