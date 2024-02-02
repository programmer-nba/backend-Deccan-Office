const { projectPartner } = require("../../model/project/projectPartner");

create = async (req, res)=>{
    try{
        const Data = { 
            type: req.body.type,
            project_name: req.body.project_name,
            price: req.body.price,
            detail: req.body.detail
        }
        const createProject = await projectPartner.create(Data)
        if(createProject){
            return res
                    .status(200)
                    .send({status:true, data:createProject})
        }else{
            return res
                    .status(400)
                    .send({status:false, message:"ไม่สามารถสร้างโปรเจ็คได้"})
        }
    }catch(err){
        console.log(err)
        return res
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}

delend = async (req, res)=>{
    try{
        const id = req.params.id
        const del = await projectPartner.findByIdAndDelete(id)
        if(del){
            return res
                    .status(200)
                    .send({status:true, data:del})
        }else{
            return res
                    .status(400)
                    .send({status:false, message:"ไม่สามารถหาข้อมูลได้"})
        }
    }catch(err){
        console.log(err)
        return res
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}

module.exports = {create, delend}