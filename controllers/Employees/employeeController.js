const { Employees, Validate } = require("../../model/employee/employee");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

Post = async (req, res) => {
  try {

    console.log(req.body.userid)
    const duplicate = await Employees.findOne({ //ตรวจสอบบัตรประชาชนพนักงานว่ามีซ้ำกันหรือไม่
        $or: [
          { iden_number: req.body.iden_number },
          { userid: req.body.userid }
        ]
    });
    if (duplicate) {
      if (duplicate.iden_number === req.body.iden_number) {
        // ถ้าพบว่า iden_number ซ้ำ
        return res
                .status(200)
                .json({status:false, message: 'มีผู้ใช้บัตรประชาชนนี้ในระบบแล้ว'});
      } else if (duplicate.userid === req.body.userid) {
        // ถ้าพบว่า userid ซ้ำ
        return res
                .status(200)
                .json({status:false, message: 'มีผู้ใช้ยูสเซอร์ไอดีนี้ในระบบแล้ว'});
      }
    }
    
    const employee = await Employees.create(
      {
          ...req.body,
          role:req.body.role,
          position:req.body.position
      }); //เพิ่มพนักงานเข้าระบบ
    if (employee) {
      return res
              .status(201)
              .send({ status: true, data: employee });
    }

  } catch (err) {
      console.log(err);
      return res
              .status(500)
              .send({ message: "มีบางอย่างผิดพลาด" });
  }
};

getAll = async (req, res) => {
  try {
    // console.log(req.decoded.role.role.role)
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
    return res
            .status(500)
            .send({ message: "มีบางอย่างผิดพลาด" });
  }
};

getByID = async (req, res) => {
  try{
    //const iden = req.body.iden_number //ดึงเฉพาะข้อมูลบัตรประชาชน
    const  getId = req.params.id;
    const getBy = await Employees.findById({_id:getId},{ _id: 0,__v: 0}) // 1 คือให้แสดงข้อมูล 0 คือไม่ให้แสดงข้อมูล
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

getMe = async (req, res) => {
  try{
    //const iden = req.body.iden_number //ดึงเฉพาะข้อมูลบัตรประชาชน
    const  getId = req.decoded.id
    console.log(getId)
    const findId= await Employees.findById(getId) // 1 คือให้แสดงข้อมูล 0 คือไม่ให้แสดงข้อมูล
    if (findId){
      return res
        .status(200)
        .send({status: true, data: findId})
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
    if(!req.body.password){ //กรณีที่ไม่ได้ยิง password
      Employees.findByIdAndUpdate(
            upID,
            {
              ...req.body,
              "leave.business_leave": req.body.business_leave,
              "leave.sick_leave": req.body.sick_leave,
              "leave.annual_leave": req.body.annual_leave,
              "leave.disbursement": req.body.disbursement,
            }, 
            {new:true}).then((data) =>{
                if (!data) {
                  res
                    .status(400)
                    .send({status:false, message: "ไม่สามารถแก้ไขผู้ใช้งานนี้ได้"})
                }else {
                  res
                    .status(200)
                    .send({status:true, message: "อัพเดทข้อมูลแล้ว",data: data})
                }
            })
            .catch((err)=>{
              res
                .status(500)
                .send({status: false, message: "มีบางอย่างผิดพลาด"})
    })
  } else { //กรณีที่ได้ยิง password
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      const updateEmployee = await Employees.findByIdAndUpdate(
              upID, 
              {
                ...req.body,
                password: hashPassword,
                "leave.business_leave": req.body.business_leave,
                "leave.sick_leave": req.body.sick_leave,
                "leave.annual_leave": req.body.annual_leave,
                "leave.disbursement": req.body.disbursement,
              }, 
              {new:true}); //หา id ที่ต้องการจากนั้นทำการอัพเดท
    if(updateEmployee){
      return res
        .status(200)
        .send({status: true, data: updateEmployee})
    } else {
      return res
        .status(400)
        .send({ status: false, message: "อัพเดทข้อมูลไม่สำเร็จ" });
    }
  }
} catch(err){
    console.log(err);
    return res.status(500).send({ message: err });
  }
}

Delete = async (req, res)=>{
  try{
    const delID = req.params.id;
    const delEmployee = await Employees.findOneAndDelete(delID)
    if(delEmployee){
      return res
        .status(200)
        .send({status: true, massge: "ลบข้อมูลสำเร็จ", data:delEmployee})
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
module.exports = { Post, getAll, getByID, Update, Delete, getMe };
