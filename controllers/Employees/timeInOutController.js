const { timeInOut, Validate } = require("../../model/employee/timeInOutEmployee");
const { Employees } = require("../../model/employee/employee");
const dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { date } = require("joi");

// เพิ่มปลั๊กอินสำหรับ UTC และ timezone ใน dayjs
dayjs.extend(utc);
dayjs.extend(timezone);

let dayjsTimestamp
let dayTime
let dayTimePlusOneHour

//เมื่อใช้ dayjs และ ทำการใช้ format จะทำให้ค่าที่ได้เป็น String อัตโนมันติ
 function updateRealTime() {
    dayjsTimestamp = dayjs().tz('Asia/Bangkok');
    dayTime = dayjsTimestamp.format('HH:mm:ss');
}
// เรียกใช้ฟังก์ชัน updateRealTime() ทุก 1 วินาที
setInterval(updateRealTime, 1000);

timeInMorning = async (req, res)=>{
    try{       
        const id = req.decoded.id
        const day = dayjs(Date.now()).format('DD')
        const mount = dayjs(Date.now()).format('MM')
        const year = dayjs(Date.now()).format('YYYY')

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
                      .send({status:false, message:"ท่านได้ลงเวลาเข้างานช่วงเช้าวันนี้ไปแล้ว"})
          }
        const createTime = await timeInOut.create({employee_id:id});
          if (createTime){
              return res
                      .status(200)
                      .send({status:true, data: createTime})
          }
    } catch(err) {
        console.log(err);
        return res
                .status(500)
                .send({ status:false, message: "มีบางอย่างผิดพลาด" });
    }
}

timeOutMorning = async (req, res)=>{
  try{       
      const id = req.params.id
    
      const checkTime = await timeInOut.findOne(
            {
              _id:id,
              status_morningOut: true
            })
        if(checkTime){
            return res
                    .status(400)
                    .send({status:false, message:"ท่านได้ลงเวลาออกงานช่วงเช้าไปแล้ว"})
        }
      const timeOutMN = await timeInOut.findOneAndUpdate(
          {_id:id},
          {
            morning_timeOut:dayTime,
            status_morningOut: true
          },{new:true})
          if(!timeOutMN){
            return res
                    .status(404)
                    .send({status:false, message:"ไม่สามารถลงเวลาออกตอนเช้าได้"})
        }
      return res
              .status(200)
              .send({status:true, data:timeOutMN})
  } catch(err) {
      console.log(err);
      return res
              .status(500)
              .send({ status:false, message: "มีบางอย่างผิดพลาด" });
  }
}

timeInAfternoon = async (req, res)=>{
  try{       
      const id = req.params.id
 
      const checkTime = await timeInOut.findOne(
            {
              _id:id,
              status_afterIn: true
            })
        if(checkTime){
            return res
                    .status(400)
                    .send({status:false, message:"ท่านได้ลงเวลาออกงานช่วงเช้าไปแล้ว"})
        }
      const timeInAT = await timeInOut.findOneAndUpdate(
          {_id:id},
          {
            after_timeIn:dayTime,
            status_afterIn: true
          },{new:true})
          if(!timeInAT){
            return res
                    .status(404)
                    .send({status:false, message:"ไม่สามารถลงเวลาออกตอนเช้าได้"})
        }
      return res
              .status(200)
              .send({status:true, data:timeInAT})
  } catch(err) {
      console.log(err);
      return res
              .status(500)
              .send({ status:false, message: "มีบางอย่างผิดพลาด" });
  }
}

timeOutAfternoon = async (req, res)=>{
  try{       
      const id = req.params.id
    
      const checkTime = await timeInOut.findOne(
            {
              _id:id,
              status_afterOut: true
            })
        if(checkTime){
            return res
                    .status(400)
                    .send({status:false, message:"ท่านได้ลงเวลาออกงานช่วงเช้าไปแล้ว"})
        }
      const timeOutAT = await timeInOut.findOneAndUpdate(
          {_id:id},
          {
            after_timeOut:dayTime,
            status_afterOut: true
          },{new:true})
          if(!timeOutAT){
            return res
                    .status(404)
                    .send({status:false, message:"ไม่สามารถลงเวลาออกตอนเช้าได้"})
        }
      return res
              .status(200)
              .send({status:true, data:timeOutAT})
  } catch(err) {
      console.log(err);
      return res
              .status(500)
              .send({ status:false, message: "มีบางอย่างผิดพลาด" });
  }
}

getMe = async (req, res)=>{
    try{
      const time = req.decoded.id
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

getTimeDay = async (req, res)=>{
  try{
    const id = req.decoded.id
    const day = dayjs(Date.now()).format('DD')
    const mount = dayjs(Date.now()).format('MM')
    const year = dayjs(Date.now()).format('YYYY')

    const findId = await timeInOut.findOne(
      {employee_id:id,
      day:day,
      mount:mount,
      year:year})
    if(findId){
      return res
              .status(200)
              .send({status:true, data: findId})
    }else{
      return res
              .status(400)
              .send({status:true, message:"วันนี้ท่านยังไม่ได้ลงเวลางาน"})
    }
  }catch(err){
    return res
            .status(500)
            .send({status: false, message:"มีบางอย่างผิดพลาด"})
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

module.exports = { timeInMorning,timeOutMorning, timeInAfternoon, timeOutAfternoon, getMe, updateTime, deleteTime, getTimeDay }
