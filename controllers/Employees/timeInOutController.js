const { timeInOut, Validate } = require("../../model/employee/timeInOutEmployee");
const { Employees } = require("../../model/employee/employee");
const dayjs = require("dayjs");
const { date } = require("joi");

timeIn = async (req, res)=>{
    try{       
        const id = req.decoded.user_id
        const day = dayjs(Date.now()).format('DD')
        const mount = dayjs(Date.now()).format('MM')
        const year = dayjs(Date.now()).format('YYYY')
        if (req.decoded.level !== "users"){
            return res
                    .status(400)
                    .send({status:false, message:"ท่านไม่มีสิทธิ์ใช้ฟังค์ชั่นนี้"})
        }else{
          const findIden = await Employees.findOne({_id:id})
          if (!findIden){
              return res
                  .status(400)
                  .send({status:false, message:"ไม่พบไอดีของท่านของท่านในระบบ"})
          }
          const checkTime = await timeInOut.findOne(
            {employee_id:id,
            day:day,
            mount:mount,
            year:year})
          if(checkTime){
              return res
                  .status(400)
                  .send({status:false, message:"ท่านได้ลงเวลาเข้างานไปแล้ว"})
          }
          
          const createTime = await timeInOut.create({employee_id:id});
          if (createTime){
              return res
                  .status(200)
                  .send({data: createTime})
          }
        }
    } catch(err) {
        console.log(err);
        return res.status(500).send({ message: "มีบางอย่างผิดพลาด" });
    }
}

timeOut = async (req, res)=>{
    try{
      const day = dayjs(Date.now()).format('DD')
      const mount = dayjs(Date.now()).format('MM')
      const year = dayjs(Date.now()).format('YYYY')
      const userid = req.decoded.user_id
      const out = await timeInOut.findOneAndUpdate(
          {employee_id:userid,
          day:day,
          mount:mount,
          year:year},
          {time_out: dayjs(Date.now()).format('HH:mm:ss')},
          {new:true})
          if(out){
            return res
                    .status(200)
                    .send({status:true, message: "ลงเวลาเลิกงานสำเร็จ", data: out})
          }else{
            return res
                    .status(400)
                    .send({status:false, message: "ไม่สามารถลงเวลางานได้"})
          }

    }catch(err){
      console.log(err);
      return res
              .status(500)
              .send({ message: "มีบางอย่างผิดพลาด" });
    }
}

getMe = async (req, res)=>{
    try{
      const time = req.decoded.user_id
      const getTime = await timeInOut.find({employee_id:time})
      if(getTime){
          return res
                  .status(200)
                  .send({status: true, data: getTime})
      }else{
          return res
                  .status(400)
                  .send({status: false, message:"ไม่สามารถเรียกเวลาดูได้"})
      }
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

module.exports = { timeIn, getMe, updateTime, deleteTime, timeOut }
