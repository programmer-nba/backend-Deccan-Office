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

exports.create = async(req, res)=>{
    try{
        const body = req.body
        const create = await requestTime.create({...body})
            if(!create){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่สามารถสร้างคำขอแก้ไขเวลาได้"})
            }
        return res
                .status(200)
                .send({status:true, data:create})
    }catch(err){
        return res
                .status(500)
                .send({status:false, message:err.message})
    }
}

exports.update = async(req, res)=>{
    try{
        const body = req.body
        const id = req.params.id
        const update = await requestTime.findByIdAndUpdate(id, 
            {
                ...body
            },
            {new:true})
            if(!update){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่สามารถอัพเดทคำขอแก้ไขเวลาได้"})
            }
        return res
                .status(200)
                .send({status:true, data:update})
    }catch(err){
        return res
                .status(500)
                .send({status:false, message:err.message})
    }
}

exports.delend = async(req, res)=>{
    try{
        const id = req.params.id
        const del = await requestTime.findByIdAndDelete(id)
            if(!del){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่สามารถค้นหาเอกสารที่ต้องการลบได้"})
            }
        return res
                .status(200)
                .send({status:true, data:del})
    }catch(err){
        return res
                .status(500)
                .send({status:false, message:err.message})
    }
}


exports.getAll = async(req, res)=>{
    try{
        const id = req.params.id
        const getAll = await requestTime.find()
            if(!getAll){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่สามารถเรียกข้อมูลเอกสารได้"})
            }
        return res
                .status(200)
                .send({status:true, data:getAll})
    }catch(err){
        return res
                .status(500)
                .send({status:false, message:err.message})
    }
}

exports.getById = async(req, res)=>{
    try{
        const id = req.params.id
        const getId = await requestTime.findById(id)
            if(!getId){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่สามารถเรียกข้อมูลเอกสารได้"})
            }
        return res
                .status(200)
                .send({status:true, data:getId})
    }catch(err){
        return res
                .status(500)
                .send({status:false, message:err.message})
    }
}