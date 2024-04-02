const { trusted } = require("mongoose");
const Leave = require("../../model/leave/Leave");
const dayjs = require('dayjs');

exports.getAll = async (req, res) => {
  try {
    const getAllLeave = await Leave.find();
    if (getAllLeave.length > 0) {
      return res.status(200).send({ status: true, data: getAllLeave });
    } else {
      return res.status(400).send({ status: false, message: "ไม่พบข้อมูลใบลา" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "มีบางอย่างผิดพลาด" });
  }
};

exports.InsertLeave = async (req, res, next) => {
    try {
        const latestleave = await Leave.findOne().sort({ Leave_id: -1 }).limit(1);

        let leaveid = 1; // ค่าเริ่มต้นสำหรับ leaveid
        if (latestleave) {
            leaveid = parseInt(latestleave.Leave_id.slice(2)) + 1; // เพิ่มค่า leaveid
        }
        const leaveidString = leaveid.toString().padStart(6, '0'); // แปลง leaveid เป็นสตริงพร้อมเติมเลข 0 ข้างหน้า

        const { Employees_id, Leave_date, Head_Leave_type, Leave_head, Employees_name, Employees_position, Department, Leave_Type, Details, Date_Start_leave, Date_End_leave, Last_Leave_Type, Last_Start_Date_Leave, Last_End_Date_Leave, Contact, Tel, Name_again, Commander, Commander_Date, Inspector, Inspector_Date, Status, Approver, Approver_Date } = req.body;

        const startDate = dayjs(Date_Start_leave);
        const endDate = dayjs(Date_End_leave);
        
        const daysDiff = endDate.diff(startDate, 'day');

        const laststartDate = dayjs(Last_Start_Date_Leave);
        const lastendDate = dayjs(Last_End_Date_Leave);
        
        const lastdaysDiff = lastendDate.diff(laststartDate, 'day')

        const leave = new Leave({
            Leave_id: leaveidString,
            Employees_id: Employees_id,
            Year: (new Date().getFullYear() + 543).toString(), // เพิ่มฟิลด์ Year เข้าไปและใส่ค่าปีปัจจุบันในรูปแบบพ.ศ.

            Leave_date: Leave_date,
            Head_Leave_type: Head_Leave_type,
            Leave_head: Leave_head,

            Employees_name: Employees_name,
            Employees_position: Employees_position,
            Department: Department,

            Leave_Type: Leave_Type,
            Details: Details,

            Date_Start_leave: Date_Start_leave,
            Date_End_leave: Date_End_leave,

            Last_Leave_Type: Last_Leave_Type,

            Last_Start_Date_Leave: Last_Start_Date_Leave,
            Last_End_Date_Leave: Last_End_Date_Leave,

            Contact: Contact,
            Tel: Tel,

            Name_again: Name_again,

            Commander: Commander,
            Commander_Date: Commander_Date,
            Inspector: Inspector,
            Inspector_Date: Inspector_Date,

            Status: Status,

            Approver: Approver,
            Approver_Date: Approver_Date,

            Set_Day: daysDiff,
            Last_Set_Day : lastdaysDiff
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
}

exports.Update = async (req, res, next) => {
  try {
      // Validate req.body here if needed

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

exports.calculateSick = async (req, res) => {
  try {
      const { Employees_id } = req.params;

      const stats = await Leave.aggregate([
          {
              $match: {
                  Employees_id: Employees_id,
                  $and: [
                    { Leave_Type: "Sick" },
                    { Status: "Allow" }
                  ]
              }
          },
          {
              $group: {
                  _id: '$Employees_id',
                  totalSetDay: { $sum: '$Set_Day' }
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

exports.calculateBusinecss = async (req, res) => {
    try {
        const { Employees_id } = req.params;
        const stats = await Leave.aggregate([
            {
              $match: {
                  Employees_id: Employees_id,
                  $and: [
                    { Leave_Type: "Business" },
                    { Status: "Allow" }
                  ]
              }
            },
            {
                $group: {
                    _id: '$Employees_id',
                    totalSetDay: { $sum: '$Set_Day' }
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
  
exports.calculateMaternity = async (req, res) => {
  try {
      const { Employees_id } = req.params;

      const stats = await Leave.aggregate([
          {
              $match: {
                  Employees_id: Employees_id,
                  $and: [
                    { Leave_Type: "Maternity" },
                    { Status: "Allow" }
                  ]
              }
          },
          {
              $group: {
                  _id: '$Employees_id',
                  totalSetDay: { $sum: '$Set_Day' }
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