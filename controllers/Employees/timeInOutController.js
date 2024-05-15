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


module.exports = { timeInMorning, getMe, updateTime, deleteTime, getTimeDay, approveTime, getAll, getTimeDayAll, getTimeByEmployee, getAllOT, getOTByEmployeeId, getTimeAll}
