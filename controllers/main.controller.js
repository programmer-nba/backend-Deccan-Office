const { Employees, Validate } = require("../model/employee/employee");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

Post = async (req, res) => {
  try {
    const {error} = Validate(req.body); //ตรวจสอบความถูกต้องของข้อมูลที่เข้ามา
    if (error)
      return res
        .status(403)
        .send({ status: false, message: error.details[0].message });

    const duplicate = await Employees.findOne({ //ตรวจสอบบัตรประชาชนพนักงานว่ามีซ้ำกันหรือไม่
      iden_number: req.body.iden_number,
    });
    if (duplicate)
      return res
        .status(401)
        .send({ status: false, message: "มีรายชื่อพนักงานภายในบริษัทแล้ว" });

    const employee = await Employees.create(req.body); //เพิ่มพนักงานเข้าระบบ
    if (employee) {
      return res
        .status(201)
        .send({ status: true, message: "เพิ่มรายชื่อพนักงานเสร็จสิ้น" });
    }
    /*const count = Employees.length;
    let data = null;
    const employee_number = `DDSC000${count}`;
    console.log(employee_number);*/
  } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "มีบางอย่างผิดพลาด" });
  }
};

getAll = async (req, res) => {
  try {
    const getAllEmployee = await Employees.find(); //ดึงข้อมูลพนักงานทุกคนออกมา
    if (getAllEmployee) {
      return res
        .status(200)
        .send({ status: true, data: getAllEmployee });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "มีบางอย่างผิดพลาด" });
  }
};

getByID = async (req, res) => {
  try{
    const iden = req.body.iden_number //ดึงเฉพาะข้อมูลบัตรประชาชน
    const getBy = await Employees.findOne({iden_number:iden})
    if (getBy){
      return res
        .status(200)
        .send({status: true, data: getBy})
    } else {
      return res
        .status(400)
        .send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
    }
  } catch(err){
    console.log(err);
    return res.status(500).send({ message: "มีบางอย่างผิดพลาด" });
  }
}

Update = async (req, res)=>{
  try{
    const upID = req.params.id; //รับไอดีที่ต้องการอัพเดท
        console.log(req.body);
        const hashPassword = await bcrypt.hash(req.body.password, 10) //ทำการ hash รหัสใหม่
        const updateEmployee = await Employees.findByIdAndUpdate(upID, {...req.body,password: hashPassword}, {new:true}); //หา id ที่ต้องการจากนั้นทำการอัพเดท
    if(updateEmployee){
      return res
        .status(200)
        .send({status: true, data: updateEmployee})
    } else {
      return res
        .status(400)
        .send({ status: false, message: " อัพเดทข้อมูลไม่สำเร็จ" });
    }
  } catch(err){
    console.log(err);
    return res.status(500).send({ message: "มีบางอย่างผิดพลาด" });
  }
}

Delete = async (req, res)=>{
  try{
    const delID = req.params.id;
    const delEmployee = await Employees.findOneAndDelete(delID)
    if(delEmployee){
      return res
        .status(200)
        .send({status: true, massge: "ลบข้อมูลสำเร็จ"})
    } else {
      return res
        .status(400)
        .send({ status: false, message: "ลบข้อมูลไม่สำเร็จ" });
    }
  } catch(err){
    console.log(err);
    return res.status(500).send({ message: "มีบางอย่างผิดพลาด" });
  }
}
module.exports = { Post, getAll, getByID, Update, Delete };
