const { timeInOut } = require("../../model/employee/timeInOutEmployee");
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

//เมื่อใช้ dayjs และ ทำการใช้ format จะทำให้ค่าที่ได้เป็น String อัตโนมันติ
 function updateRealTime() {
    dayjsTimestamp = dayjs().tz('Asia/Bangkok');
    dayTime = dayjsTimestamp.format('HH:mm:ss');
}
// เรียกใช้ฟังก์ชัน updateRealTime() ทุก 1 วินาที
setInterval(updateRealTime, 500);

timeInMorning = async (req, res)=>{
    try{       
        const id = req.decoded.id
        const day = dayjs(Date.now()).format('DD')
        const mount = dayjs(Date.now()).format('MM')
        const year = dayjs(Date.now()).format('YYYY')
        let time_line
          if(dayTime >= '08:00:00' && dayTime <= '11:59:59'){
            time_line = "เข้างานช่วงเช้า"
          }else if(dayTime >= '12:00:00' && dayTime <= '12:29:59'){
            time_line = "พักเที่ยง"
          }else if(dayTime >= '12:30:00' && dayTime <= '17:59:59'){
            time_line = "เข้างานช่วงบ่าย"
          }else if(dayTime >= '18:00:00' && dayTime <= '23:59:59'){
            time_line = "ลงเวลาออกงาน"
          }else{
              return res
                      .status(400)
                      .send({status:false, message:"ยังไม่ถึงเวลาใช้งาน"})
          }
 
        const checkTime = await timeInOut.findOne(
            {employee_id:id,
            day:day,
            mount:mount,
            year:year,
            time_line:time_line
            })
          if(checkTime){
              if(time_line == 'พักเที่ยง'){
                  return res
                          .status(400)
                          .send({status:false, message:`ท่านได้ลงเวลา ${time_line} วันนี้ไปแล้ว กรุณารอลงเวลาเข้าช่วงบ่ายตั้งแต่ 12.30 น. เป็นต้นไป`})
              }else if(time_line == 'ลงเวลาออกงาน'){
                  return res
                          .status(400)
                          .send({status:false, message:`ท่านได้ ${time_line} วันนี้ไปแล้ว`})
              }
              return res
                      .status(400)
                      .send({status:false, message:`ท่านได้ลงเวลา ${time_line} วันนี้ไปแล้ว`})
          }else if(!checkTime){
              if(time_line == 'พักเที่ยง'){
                  const findMorning = await timeInOut.findOne(
                    {
                      employee_id:id,
                      day:day,
                      mount:mount,
                      year:year,
                      time_line:'เข้างานช่วงเช้า'
                    }
                  )
                  if(!findMorning){
                      return res
                              .status(400)
                              .send({status:false, message:"ท่านยังไม่ได้ลงเวลาเข้างานช่วงเช้า กรุณารอเข้างานช่วงบ่าย ตั้งแต่ 12.30 น. เป็นต้นไป"})
                  }
              }else if(time_line == 'ลงเวลาออกงาน'){
                  const findTime = await timeInOut.findOne(
                    {
                      employee_id:id,
                      day:day,
                      mount:mount,
                      year:year,
                      $or:[
                        {time_line:'เข้างานช่วงเช้า'},
                        {time_line:'เข้างานช่วงบ่าย'}
                      ]
                    }
                  )
                  if(!findTime){
                      return res
                              .status(400)
                              .send({status:false, message:"ท่านยังไม่ได้ลงเวลาเข้างานช่วงเช้าและช่วงบ่าย จึงไม่สามารถลงเวลาออกงานได้"})
                  }
              }
          }
        const createTime = await timeInOut.create(
          {
            employee_id:id,
            time:dayTime,
            time_line:time_line
          });
          // console.log(createTime)
          if (createTime){
              return res
                      .status(200)
                      .send({status:true, data: createTime})
          }
    } catch(err) {
        console.log(err);
        return res
                .status(500)
                .send({ status:false, maessage: err.message });
    }
}

getMe = async (req, res)=>{
    try{
      const id = req.decoded.id
      const data = []
      const getTime = await timeInOut.find({employee_id:id})
      if(getTime){
              const groupedData = getTime.reduce((acc, cur) => {
                const key = cur.year + '/' + cur.mount + '/' + cur.day;
                if (!acc[key]) {
                    acc[key] = {
                        day: key,
                        morningIn: null,
                        morningOut: null,
                        afterIn: null,
                        afterOut: null
                    };
                }
            
                // เช็คเวลาและกำหนดค่าให้กับแต่ละช่วงเวลา
                if (cur.time_line === "เข้างานช่วงเช้า") {
                    acc[key].morningIn = cur.time;
                } else if (cur.time_line === "พักเที่ยง") {
                    acc[key].morningOut = cur.time;
                } else if (cur.time_line === "เข้างานช่วงบ่าย") {
                    acc[key].afterIn = cur.time;
                } else if (cur.time_line === "ลงเวลาออกงาน") {
                    acc[key].afterOut = cur.time;
                }
            
                return acc;
              }, {});
              // แปลง object เป็น array โดยดึงค่าจาก property และสร้าง object ใหม่
            const data = Object.values(groupedData);

            return res
                    .status(200)
                    .send({ status: true, data: data });

      }else{
          return res
                  .status(400)
                  .send({status: false, message:"ไม่สามารถเรียกเวลาดูได้"})
      }
    } catch(err) {
        console.log(err);
        return res.status(500).send({ maessage: err.message});
    }
}

getTimeDay = async (req, res)=>{
  try{
    const id = req.decoded.id
    const day = dayjs(Date.now()).format('DD')
    const mount = dayjs(Date.now()).format('MM')
    const year = dayjs(Date.now()).format('YYYY')

    const findId = await timeInOut.find(
      {employee_id:id,
      day:day,
      mount:mount,
      year:year})
      // console.log(findId)
    if(findId){
        const data = {
            day: `${findId[0].year}/${findId[0].mount}/${findId[0].day}`,
            morningIn: null,
            morningOut: null,
            afterIn: null,
            afterOut: null
        }
          findId.forEach(item => {
            // ทำสิ่งที่ต้องการกับแต่ละรายการ (item)
            if (item.time_line === 'เข้างานช่วงเช้า') {
                data.morningIn = item.time;
            } else if (item.time_line === 'พักเที่ยง') {
                data.morningOut = item.time;
            } else if (item.time_line === 'เข้างานช่วงบ่าย') {
                data.afterIn = item.time;
            } else if (item.time_line === 'ลงเวลาออกงาน') {
                data.afterOut = item.time;
            }
          });
        return res
                .status(200)
                .send({status:true, data: data})
    }else{
      return res
              .status(400)
              .send({status:true, message:"วันนี้ท่านยังไม่ได้ลงเวลางาน"})
    }
  }catch(err){
    return res
            .status(500)
            .send({status: false, maessage: err.message})
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
            .send({status: false, maessage: err.message})
        })
  
  }catch(err){
      console.log(err);
      return res.status(500).send({ maessage: err.message });
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
      return res.status(500).send({ maessage: err.message });
    }
}

approveTime = async(req, res)=>{
  try{
    const { day, mount, year, time, id } = req.body
      let time_line
      if(time >= '08:00:00' && time <= '11:59:59'){
        time_line = "เข้างานช่วงเช้า"
      }else if(time >= '12:00:00' && time <= '12:30:00'){
        time_line = "พักเที่ยง"
      }else if(time >= '12:31:00' && time <= '18:00:00'){
        time_line = "เข้างานช่วงบ่าย"
      }else if(time >= '18:01:00' && time <= '23:59:59'){
        time_line = "ลงเวลาออกงาน"
      }
      console.log(time_line)
    const checkTime = await timeInOut.findOne(
        {
          employee_id:id,
          day:day,
          mount:mount,
          year:year,
          time_line:time_line
        })
      if(checkTime){
          return res
                  .status(400)
                  .send({status:false, message:`ท่านได้ลงเวลา ${time_line} วันนี้ไปแล้ว`})
      }
    const createTime = await timeInOut.create(
        {
          employee_id:id,
          day:day,
          mount:mount,
          year:year,
          time:time,
          time_line:time_line
        });
      // console.log(createTime)
      if (createTime){
          return res
                  .status(200)
                  .send({status:true, data: createTime})
      }
  }catch(err){
    console.log(err)
    return res
            .status(500)
            .send({status:false, message:err})
  }
}

getAll = async (req, res) => {
  try {
    const timeinouts = await timeInOut.find();
    return res.json({
        message: 'Get Time data successfully!',
        status: true,
        data: timeinouts
    });
} catch (err) {
    console.log(err)
    return res.json({
        message: ('Can not get Time data', err.message),
        status: false,
        data: null
    })
}
};

module.exports = { timeInMorning, getMe, updateTime, deleteTime, getTimeDay, approveTime, getAll}
