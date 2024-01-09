const {Employees,Validate} = require("../model/employee/employee");
const jwt = require("jsonwebtoken");

postRegister = async (req, res) => {
  try {
    const {error} = Validate(req.body); //ตรวจสอบความถูกต้องของข้อมูลที่เข้ามา
    if (error)
       return res
         .status(403)
         .send({status: false, message: error.details[0].message})
       
    const duplicate = await Employees.findOne({ //ตรวจสอบบัตรประชาชนพนักงานว่ามีซ้ำกันหรือไม่
          iden_number: req.body.iden_number,
    });
    if (duplicate) 
      return res
        .status(401)
        .send({status: false, message: "มีรายชื่อพนักงานภายในบริษัทแล้ว"});

    const employee = await Employees.create(req.body) //เพิ่มพนักงานเข้าระบบ
    if (employee){
      return res
        .status(201)
        .send({status: true, message:"เพิ่มรายชื่อพนักงานเสร็จสิ้น"})
    }

    const count = Employees.length;
    let data = null;
    const employee_number = `DDSC000${count}`;
    console.log(employee_number)

  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};
module.exports = {postRegister};