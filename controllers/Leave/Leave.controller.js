const { trusted } = require("mongoose");
const Leave = require("../../model/leave/Leave");

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
    const leaveidString = leaveid.toString().padStart(4, '0'); // แปลง leaveid เป็นสตริงพร้อมเติมเลข 0 ข้างหน้า

    const { Employees_id, Leave_date, Leave_type, Leave_head, Employees_name, Employees_position, Department, Sick, Business, Maternity, Details, Day_Start_leave, Month_Start_leave, Year_Start_leave, Day_End_leave, Month_End_leave, Year_End_leave, Set_Day, Last_Sick, Last_Business, Last_Maternity, Last_Start_Day_Leave, Last_Start_Month_Leave, Last_Start_Year_Leave, Last_End_Day_Leave, Last_End_Month_Leave, Last_End_Year_Leave, Last_Set_Day, Contact, Tel, Name_again, Commander, Commander_Date, Inspector, Inspector_Date, Allow, Not_Allowed, Approver, Approver_Date } = req.body

    const leave = new Leave({
        Leave_id : leaveidString,
        Employees_id : Employees_id,
        Leave_date : Leave_date,
        Leave_type : Leave_type,
        Leave_head : Leave_head,

        Employees_name : Employees_name,
        Employees_position:  Employees_position,
        Department : Department,

        Sick : Sick,
        Business : Business,
        Maternity : Maternity,

        Details : Details,
        
        Day_Start_leave : Day_Start_leave,
        Month_Start_leave : Month_Start_leave,
        Year_Start_leave : Year_Start_leave,

        Day_End_leave : Day_End_leave,
        Month_End_leave : Month_End_leave,
        Year_End_leave : Year_End_leave,

        Set_Day : Set_Day,

        Last_Sick : Last_Sick,
        Last_Business : Last_Business,
        Last_Maternity : Last_Maternity,
        
        Last_Start_Day_Leave : Last_Start_Day_Leave,
        Last_Start_Month_Leave : Last_Start_Month_Leave,
        Last_Start_Year_Leave : Last_Start_Year_Leave,

        Last_End_Day_Leave : Last_End_Day_Leave,
        Last_End_Month_Leave : Last_End_Month_Leave,
        Last_End_Year_Leave : Last_End_Year_Leave,

        Last_Set_Day : Last_Set_Day,

        Contact : Contact,
        Tel : Tel,
        Name_again : Name_again,
        Commander : Commander,
        Commander_Date : Commander_Date,
        Inspector : Inspector,
        Inspector_Date : Inspector_Date,
        Allow : Allow,
        Not_Allowed : Not_Allowed,
        Approver : Approver,
        Approver_Date : Approver_Date,
        Year: (new Date().getFullYear() + 543).toString() // เพิ่มฟิลด์ Year เข้าไปและใส่ค่าปีปัจจุบันในรูปแบบพ.ศ.

    })
    const saved_leave = await leave.save()
    if (!saved_leave) {
        return res.json({
            message: 'ไม่สามารถบันทึกข้อมูลพนักงานได้',
            status: false,
            data: null
        })
    }
    return res.json({
        message: 'บันทึกข้อมูลพนักงานสำเร็จ!',
        status: true,
        data: saved_leave
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
                  Sick : true,
                  Allow: true
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
                  Businecss : true,
                  Allow: true
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
                  Maternity : true,
                  Allow: true
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