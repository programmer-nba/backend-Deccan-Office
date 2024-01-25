const { recordReport, Validate } = require("../../model/record_report");

create = async (req, res)=>{
    try{
        const {error} = Validate(req.body); //ตรวจสอบความถูกต้องของข้อมูลที่เข้ามา
            if (error){
                return res
                        .status(403)
                        .send({ status: false, message: error.details[0].message });
            }
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
    }catch(err){
        return res  
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}
module.exports = { create }