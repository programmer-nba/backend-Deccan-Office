const { postType } = require("../../model/Post/postType");

create = async(req, res)=>{
    try{
        const create = await postType.create({...req.body})
            if(!create){
                return res
                        .status(400)
                        .send({status:false, message:"ไม่สามารถสร้างข้อความได้"})
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

getAll = async(req, res)=>{
    try{
        const find = await postType.find()
            if(find.length == 0){
                return res
                        .status(400)
                        .send({status:false, message:"ไม่หาเอกสารได้"})
            }
        return res
                .status(200)
                .send({status:true, data:find})
    }catch(err){
        return res
                .status(500)
                .send({status:false, message:err.message})
    }
}

getById = async(req, res)=>{
    try{
        const id = req.params.id
        const find = await postType.findById(id)
            if(find.length == 0){
                return res
                        .status(400)
                        .send({status:false, message:"ไม่หาเอกสารได้"})
            }
        return res
                .status(200)
                .send({status:true, data:find})
    }catch(err){
        return res
                .status(500)
                .send({status:false, message:err.message})
    }
}

delend = async(req, res)=>{
    try{
        const id = req.params.id
        const find = await postType.findByIdAndDelete(id)
            if(!find){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่สามารถลบเอกสารได้"})
            }
        return res
                .status(200)
                .send({status:true, data:find})
    }catch(err){
        return res
                .status(500)
                .send({status:false, message:err.message})
    }
}

updateInfo = async(req, res)=>{
    try{
        const id = req.params.id
        const find = await postType.findByIdAndUpdate(id,{...req.body},{new:true})
            if(!find){
                return res
                        .status(400)
                        .send({status:false, message:"ไม่สามารถอัพเดทเอกสารได้"})
            }
        return res
                .status(200)
                .send({status:true, data:find})
    }catch(err){
        return res
                .status(500)
                .send({status:false, message:err.message})
    }
}

module.exports = {updateInfo, delend, getById, getAll, create }