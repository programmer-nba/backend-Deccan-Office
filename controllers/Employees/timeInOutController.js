const { timeInOut } = require("../../model/employee/timeInOutEmployee");
const { Employees } = require("../../model/employee/employee");
const dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { date } = require("joi");
const { requestTime } = require("../../model/employee/requestTime");


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
};

updateTimeEasy = async(req, res)=>{
  try{
    const { employee_id, day, mount, year, time_line, time, remark, id } = req.body
    if(time_line != "เข้างานช่วงเช้า" && time_line != "พักเที่ยง" && time_line != "เข้างานช่วงบ่าย" && time_line != "ลงเวลาออกงาน" ){
        return res
                .status(400)
                .send({status:false, message:"กรุณากรอก Time line ให้ถูกต้อง"})
    }
    const checkTime = await timeInOut.findOne(
      {
          employee_id:employee_id,
          day:day,
          mount:mount,
          year:year,
          time_line:time_line
      })
      if(checkTime){
        return res
                .status(200)
                .send({status:true, message:"ท่านได้ลงเวลางานช่วงนั้นไปแล้ว"})
      }
    const createTime = await timeInOut.create({...req.body})
      if(!createTime){
        return res
                .status(400)
                .send({status:false, message:"ไม่สามารถสร้างข้อมูลการลงเวลางานได้"})
      }
    // const update = await requestTime.findByIdAndUpdate(id, 
    //       {
    //         status:"อนุมัติ"
    //       },
    //       {
    //         new:true
    //       })
    //   if(!update){
    //     return res
    //             .status(404)
    //             .send({status:false, message:"ไม่สามารถอัพเดทคำขอแก้ไขเวลาได้"})
    //   }
    return res
            .status(200)
            .send({
              status:true, 
              data:createTime,
              update:update
            })
  }catch(err){
    return res
            .status(500)
            .send({status:false, message:err.message})
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
};

getTimeDay = async (req, res) => {
  try {
    const id = req.decoded.id
    const [day, mount, year] = await Promise.all([
      dayjs(Date.now()).format('DD'),
      dayjs(Date.now()).format('MM'),
      dayjs(Date.now()).format('YYYY')
    ]);

    const findId = await timeInOut.find(
      { employee_id: id, day: day, mount: mount, year: year }
    );

    if (findId.length > 0) {
      const data = {
        day: `${year}/${mount}/${day}`,
        morningIn: null,
        morningOut: null,
        afterIn: null,
        afterOut: null,
        time_in: null,
        time_out: null,
        total_ot: null
      };
      findId.forEach((item) => {
        if (item.time_line === 'เข้างานช่วงเช้า') {
          data.morningIn = item.time;

        } else if (item.time_line === 'พักเที่ยง') {
          data.morningOut = item.time;

        } else if (item.time_line === 'เข้างานช่วงบ่าย') {
          data.afterIn = item.time;

        } else if (item.time_line === 'ลงเวลาออกงาน') {
          data.afterOut = item.time;

        } else if (item.time_line === 'OT') {
          const totalOtInSeconds = item.total_ot;
          const hours = Math.floor(totalOtInSeconds / 3600);
          const minutes = Math.floor((totalOtInSeconds % 3600) / 60);
          const seconds = totalOtInSeconds % 60;

          data.time_in = item.time_in;
          data.time_out = item.time_out;
          data.total_ot = `${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`;
        }
      });

      return res
        .status(200)
        .send({ status: true, data: data });
    } else {
      return res
        .status(400)
        .send({ status: true, message: "วันนี้ท่านยังไม่ได้ลงเวลางาน" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: err.message });
  }
};

updateTime = async (req, res)=>{
    try{
      const upID = req.params.id; //รับไอดีที่ต้องการอัพเดท
      let update = await timeInOut.findByIdAndUpdate(upID,{...req.body}, {new:true})
        if(!update){
          return res
                  .status(400)
                  .send({status:false, message:"ไม่สามารถอัพเดทข้อมูล / ไม่พบไอดีที่ท่านต้องการแก้ไข"})
        }
      return res
              .status(200)
              .send({status:true, data:update})
  }catch(err){
      console.log(err);
      return res.status(500).send({ maessage: err.message });
    }
};

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
};

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
};

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

getTimeDayAll = async (req, res) => {
  try {
    const [day, mount, year] = await Promise.all([
      dayjs(Date.now()).format('DD'),
      dayjs(Date.now()).format('MM'),
      dayjs(Date.now()).format('YYYY')
    ]);

    const findId = await timeInOut.find(
      { day: day, mount: mount, year: year }
    );

    if (findId.length > 0) {
      const data = {};
      findId.forEach((item) => {
        if (!data[item.employee_id]) {
          data[item.employee_id] = {
            employee_id : item.employee_id,
            day : `${year}/${mount}/${day}`,
            morningIn : "",
            morningOut : "",
            afterIn : "",
            afterOut : "",
            ot : {}
          };
        }

        if (item.time_line === 'เข้างานช่วงเช้า') {
          data[item.employee_id].morningIn = item.time;

        } else if (item.time_line === 'พักเที่ยง') {
          data[item.employee_id].morningOut = item.time;

        } else if (item.time_line === 'เข้างานช่วงบ่าย') {
          data[item.employee_id].afterIn = item.time;

        } else if (item.time_line === 'ลงเวลาออกงาน') {
          data[item.employee_id].afterOut = item.time;

        } else if (item.time_line === 'OT') {
          const totalOtInSeconds = item.total_ot;
          const hours = Math.floor(totalOtInSeconds / 3600);
          const minutes = Math.floor((totalOtInSeconds % 3600) / 60);
          const seconds = totalOtInSeconds % 60;
      
          data[item.employee_id].ot = {
              date : `${item.day}/${item.mount}/${item.year}`,
              time_in : item.time_in,
              time_out : item.time_out,
              total_ot : `${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`
          };
      }      
      });

      return res
        .status(200)
        .send({ status: true, data: Object.values(data) });
    } else {
      return res
        .status(400)
        .send({ status: true, message: "วันนี้ ยังไม่มีพนักงานลงเวลางาน" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: err.message });
  }
};

// Get Time By Employee
getTimeByEmployee = async (req, res, next) => {
  try {
    const employee_id = req.params.employee_id;
    const findId = await timeInOut.find({ employee_id: employee_id });

    const dataByDay = {};
    findId.forEach((item) => {
      const key = `${item.year}/${item.mount}/${item.day}`;
      if (!dataByDay[key]) {
        dataByDay[key] = {
          day: key,
          morningIn: null,
          morningOut: null,
          afterIn: null,
          afterOut: null,
          time_in: null,
          time_out: null,
          total_ot: null
        };
      }

      if (item.time_line === 'เข้างานช่วงเช้า') {
        dataByDay[key].morningIn = item.time;
      } else if (item.time_line === 'พักเที่ยง') {
        dataByDay[key].morningOut = item.time;
      } else if (item.time_line === 'เข้างานช่วงบ่าย') {
        dataByDay[key].afterIn = item.time;
      } else if (item.time_line === 'ลงเวลาออกงาน') {
        dataByDay[key].afterOut = item.time;
      } else if (item.time_line === 'OT') {
        const totalOtInSeconds = item.total_ot;
        const hours = Math.floor(totalOtInSeconds / 3600);
        const minutes = Math.floor((totalOtInSeconds % 3600) / 60);
        const seconds = totalOtInSeconds % 60;

        dataByDay[key].time_in = item.time_in;
        dataByDay[key].time_out = item.time_out;
        dataByDay[key].total_ot = `${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`;
      }
    });

    const data = Object.values(dataByDay);

    return res
      .status(200)
      .send({ status: true, data: data });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: err.message });
  }
};

// Get All OT
getAllOT = async (req, res) => {
  try {
    const timeinouts = await timeInOut.find({ time_line: 'OT' });

    const newData = timeinouts.map(item => {
      const newDate = `${item.day}/${item.mount}/${item.year}`;
      const totalOtInSeconds = item.total_ot;
      const hours = Math.floor(totalOtInSeconds / 3600);
      const minutes = Math.floor((totalOtInSeconds % 3600) / 60);
      const seconds = totalOtInSeconds % 60;
      return { _id : item.id, 
        employee_id : item.employee_id, 
        date : newDate,
        time_line : item.time_line,
        time_in : item.time_in, 
        time_out : item.time_out, 
        total_ot : hours + ' ชั่วโมง ' + minutes + ' นาที ' + seconds + ' วินาที',
        createdAt : item.createdAt,
        updatedAt : item.updatedAt
      };
    });

    return res.json({
      message: 'Get OT data successfully!',
      status: true,
      data: newData
    });
  } catch (err) {
    console.log(err);
    return res.json({
      message: ('Can not get OT data', err.message),
      status: false,
      data: null
    });
  }
};

//Get OT By Employee
getOTByEmployeeId = async (req, res) => {
    const { employee_id } = req.params;
    try {
      const timeinouts = await timeInOut.find({ employee_id: employee_id, time_line: 'OT' });
  
      const newData = timeinouts.map(item => {
        const newDate = `${item.day}/${item.mount}/${item.year}`;
        const totalOtInSeconds = item.total_ot;
        const hours = Math.floor(totalOtInSeconds / 3600);
        const minutes = Math.floor((totalOtInSeconds % 3600) / 60);
        const seconds = totalOtInSeconds % 60;
        return { _id : item.id, 
          employee_id : item.employee_id, 
          date : newDate,
          time_line : item.time_line,
          time_in : item.time_in, 
          time_out : item.time_out, 
          total_ot : hours + ' ชั่วโมง ' + minutes + ' นาที ' + seconds + ' วินาที',
          createdAt : item.createdAt,
          updatedAt : item.updatedAt
        };
      });
  
      return res.json({
        message: 'Get OT data successfully!',
        status: true,
        data: newData
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: ('Can not get OT data', err.message),
        status: false,
        data: null
      });
    }
};

getTimeAll = async (req, res) => {
  try {
    const [day, mount, year] = await Promise.all([
      dayjs(Date.now()).format('DD'),
      dayjs(Date.now()).format('MM'),
      dayjs(Date.now()).format('YYYY')
    ]);

    const findId = await timeInOut.find({ day: { $exists: true } });

    if (findId.length > 0) {
      const data = {};
      findId.forEach((item) => {
        if (!data[item.employee_id]) {
          data[item.employee_id] = {
            employee_id : item.employee_id,
            day : `${day}/${mount}/${year}`,
            morningIn : "",
            morningOut : "",
            afterIn : "",
            afterOut : "",
            date : "",
            time_in : "",
            time_out : "",
            total_ot : ""
          };
        }

        if (item.time_line === 'เข้างานช่วงเช้า') {
          data[item.employee_id].morningIn = item.time;

        } else if (item.time_line === 'พักเที่ยง') {
          data[item.employee_id].morningOut = item.time;

        } else if (item.time_line === 'เข้างานช่วงบ่าย') {
          data[item.employee_id].afterIn = item.time;

        } else if (item.time_line === 'ลงเวลาออกงาน') {
          data[item.employee_id].afterOut = item.time;

        } else if (item.time_line === 'OT' || item.date == day) {
          if (typeof item.total_ot === 'number') {
            const totalOtInSeconds = item.total_ot;
            const hours = Math.floor(totalOtInSeconds / 3600);
            const minutes = Math.floor((totalOtInSeconds % 3600) / 60);
            const seconds = totalOtInSeconds % 60;
        
            data[item.employee_id].date = `${item.day}/${item.mount}/${item.year}`;
            data[item.employee_id].time_in = item.time_in;
            data[item.employee_id].time_out = item.time_out;
            data[item.employee_id].total_ot = `${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`;
          } else {
            // Handle invalid total_ot value
            console.error(`Invalid total_ot value for employee ${item.employee_id}: ${item.total_ot}`);
          }
        }
      });

      return res
        .status(200)
        .send({ status: true, data: Object.values(data) });
    } else {
      return res
        .status(400)
        .send({ status: true, message: "วันนี้ท่านยังไม่ได้ลงเวลางาน" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: err.message });
  }
};

getTimemonthAll = async (req, res) => {
  try {
    const [ mount, year] = await Promise.all([
      dayjs(Date.now()).format('MM'),
      dayjs(Date.now()).format('YYYY')
    ]);

    const findId = await timeInOut.find(
      { mount: mount, year: year }
    );

    if (findId.length > 0) {
      const data = {};
      findId.forEach((item) => {
        if (!data[item.employee_id]) {
          data[item.employee_id] = {
            employee_id : item.employee_id,
            day : `${year}/${mount}/${item.day}`,
            morningIn : "",
            morningOut : "",
            afterIn : "",
            afterOut : "",
            ot : {}
          };
        }

        if (item.time_line === 'เข้างานช่วงเช้า') {
          data[item.employee_id].morningIn = item.time;

        } else if (item.time_line === 'พักเที่ยง') {
          data[item.employee_id].morningOut = item.time;

        } else if (item.time_line === 'เข้างานช่วงบ่าย') {
          data[item.employee_id].afterIn = item.time;

        } else if (item.time_line === 'ลงเวลาออกงาน') {
          data[item.employee_id].afterOut = item.time;

        } else if (item.time_line === 'OT') {
          const totalOtInSeconds = item.total_ot;
          const hours = Math.floor(totalOtInSeconds / 3600);
          const minutes = Math.floor((totalOtInSeconds % 3600) / 60);
          const seconds = totalOtInSeconds % 60;
      
          data[item.employee_id].ot = {
              date : `${item.day}/${item.mount}/${item.year}`,
              time_in : item.time_in,
              time_out : item.time_out,
              total_ot : `${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`
          };
      }      
      });

      return res
        .status(200)
        .send({ status: true, data: Object.values(data) });
    } else {
      return res
        .status(400)
        .send({ status: true, message: "เดือนนี้ ยังไม่มีพนักงานลงเวลางาน" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: err.message });
  }
};

getTimeAllEmployee = async (req, res) => {
  try {
    const mount = req.body.mount
    const year = req.body.year
    const day = req.body.day
    const findEmployees = await Employees.find()
      if(findEmployees.length == 0){
        return res
                .status(404)
                .send({status:false, data:[]})
      }

    let findId
    if(day){
      findId = await timeInOut.find(
        { day:day, mount: mount, year: year }
      )
    }else{
      findId = await timeInOut.find(
        { mount: mount, year: year }
      )
    }
  
    if (findId.length > 0) {
      const groupedData = findId.reduce((data, cur) => {
        let key = cur.employee_id + '/' + cur.day + '/' + cur.mount + '/' + cur.year;
        if (!data[key]) {
          let findEm = findEmployees.find(item => item._id.toString() == cur.employee_id)
          // console.log(findEm)
          data[key] = {
            employee_id: cur.employee_id,
            day: cur.day + '/' + cur.mount + '/' + cur.year,
            employee_number: "",
            name: "",
            morningIn: "",
            morningOut: "",
            afterIn: "",
            afterOut: "",
            date: "",
            time_in: "",
            time_out: "",
            total_ot: ""
          };
          if(findEm){
            data[key].employee_number = findEm.employee_number
            data[key].name = findEm.first_name +' '+ findEm.last_name
          }
        }
    
        if (cur.time_line === 'เข้างานช่วงเช้า') {
          data[key].morningIn = cur.time;
    
        } else if (cur.time_line === 'พักเที่ยง') {
          data[key].morningOut = cur.time;
    
        } else if (cur.time_line === 'เข้างานช่วงบ่าย') {
          data[key].afterIn = cur.time;
    
        } else if (cur.time_line === 'ลงเวลาออกงาน') {
          data[key].afterOut = cur.time;
    
        } else if (cur.time_line === 'OT') {
          if (typeof cur.total_ot === 'number') {
            const totalOtInSeconds = cur.total_ot;
            const hours = Math.floor(totalOtInSeconds / 3600);
            const minutes = Math.floor((totalOtInSeconds % 3600) / 60);
            const seconds = totalOtInSeconds % 60;
    
            data[key].date = `${cur.day}/${cur.mount}/${cur.year}`;
            data[key].time_in = cur.time_in;
            data[key].time_out = cur.time_out;
            data[key].total_ot = `${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`;
          } else {
            // Handle invalid total_ot value
            console.error(`Invalid total_ot value for employee ${cur.employee_id}: ${cur.total_ot}`);
          }
        }
        return data;
      }, {});
       // Convert groupedData to array and sort by date
      const sortedData = Object.values(groupedData).sort((a, b) => {
        const [dayA, monthA, yearA] = a.day.split('/').map(Number);
        const [dayB, monthB, yearB] = b.day.split('/').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        return dateA - dateB;
      });

      return res.status(200).send({ status: true, data: sortedData });
    } else {
      return res
        .status(400)
        .send({ status: true, message: "วันนี้ท่านยังไม่ได้ลงเวลางาน" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: err.message });
  }
};

module.exports = { timeInMorning, getMe, updateTime, deleteTime, getTimeDay, approveTime, getAll, getTimeDayAll, 
  getTimeByEmployee, getAllOT, getOTByEmployeeId, getTimeAll, getTimeAllEmployee, updateTimeEasy}
