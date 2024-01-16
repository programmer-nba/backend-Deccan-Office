const { timeInOut, Validate } = require("../../model/employee/timeInOutEmployee");
const { Employees } = require("../../model/employee/employee")

timeIn = async (req, res)=>{
    try{       
        const timein = req.body
        const findIden = await Employees.findOne({iden_number:timein.iden_number})
        if (!findIden){
            return res
                .status(400)
                .send({status:false, message:"ไม่พบบัตรประชาชนของท่านในระบบ"})
        }
        const createTime = await timeInOut.create(timein);
            if (createTime){
                return res
                    .status(200)
                    .send({data: createTime})
            }
    } catch(err) {
        console.log(err);
        return res.status(500).send({ message: "มีบางอย่างผิดพลาด" });
    }
}

getAll = async (req, res)=>{
    try{
        const getTime = await timeInOut.find().select('employee_number period time_in time_out') //find หา รหัสพนักงาน เลือก feild timein(ตย. การต้องการมากกว่า 1 field = .select('time_in time_out) ก็จะได้ 2 field) 
        res.send({status:true,
            data: getTime})

    } catch(err) {
        console.log(err);
        return res.status(500).send({ message: "มีบางอย่างผิดพลาด" });
    }
}

updateTime = async (req, res)=>{
    try{
      const upID = req.params.id; //รับไอดีที่ต้องการอัพเดท
        timeInOut.findByIdAndUpdate(upID,req.body, {new:true}).then((data) =>{
          if (!data) {
            res
              .status(400)
              .send({status:false, message: "ไม่สามารถแก้ไขผู้ใช้งานนี้ได้"})
          }else {
            res
              .status(200)
              .send({status:true, message: "อัพเดทข้อมูลแล้ว",data: data})
          }
        }).catch((err)=>{
          res
            .status(500)
            .send({status: false, message: "มีบางอย่างผิดพลาด"})
        })
  
  }catch(err){
      console.log(err);
      return res.status(500).send({ message: "มีบางอย่างผิดพลาด" });
    }
  }

deleteTime = async (req, res)=>{
    try{
        delID = req.params.id
        const deltime = await timeInOut.findByIdAndDelete(delID)
        if(deltime){
            return res
              .status(200)
              .send({status: true, massge: "ลบข้อมูลสำเร็จ",Delete: deltime})
          } else {
            return res
              .status(400)
              .send({ status: false, message: "ลบข้อมูลไม่สำเร็จ" });
          }
    }catch(err){
      console.log(err);
      return res.status(500).send({ message: "มีบางอย่างผิดพลาด" });
    }
}

module.exports = { timeIn, getAll, updateTime, deleteTime }
