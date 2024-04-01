const { Employees } = require("../../model/employee/employee");
const { recordReport } = require("../../model/record_report");

create = async (req, res)=>{
    try{
        const record = await recordReport.create(req.body)
            if(record){
                return res
                        .status(200)
                        .send({status: true, data: record})
            }
    }catch(err){
        return res  
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}

getAll = async (req, res)=>{
    try{
        const get = await recordReport.find()
        if(get){
            return res 
                    .status(200)
                    .send({status: true, data:get})
        }else{
            return res
                    .status(400)
                    .send({status: false, message:"ไม่สามารถเรียกดูข้อมูลได้"})
        }
    }catch(err){
        return res  
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}

delend = async (req, res)=>{
    try{
        const id = req.params.id
        const del = await recordReport.findByIdAndDelete(id)
        if(del){
            return res
                    .status(200)
                    .send({status:false, message:"ทำการลบบันทึกแล้ว"})
        }else{
            return res
                    .status(400)
                    .send({status:true, message:"ไม่มีบันทึกที่ท่านต้องการลบ"})
        }
    }catch(err){
        return res  
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}

update = async (req, res)=>{
    try{
        const id = req.params.id
        const update = await recordReport.findByIdAndUpdate(id,req.body, {new:true})
        if(update){
            return res
                    .status(200)
                    .send({status:true, data:update})
        }else{
            return res
                    .status(400)
                    .send({status:false, message:"ไม่สามารถอัพเดทได้"})
        }
    }catch(err){
        return res 
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}

module.exports = { create, getAll, delend, update }