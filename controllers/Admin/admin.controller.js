const Partner = require("../../model/partners/partners");

confirmPartner = async (req, res)=>{
    try{
        const id = req.params.id
        const confirm = await Partner.findByIdAndUpdate(id,{
            partner_status:"true",
            partner_status_promiss:"ได้รับการอนุมัติ"
        },{new:true})
        if(confirm){
            return res
                    .status(200)
                    .send({status:true, data:confirm})
        }else{
            return res
                    .status(400)
                    .send({status:false, message:"ไม่สามารถค้นหา partner id เจอ"})
        }
    }catch(err){
        console.log(err)
        return res
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}

cancelPartner = async (req, res)=>{
    try{
        const id = req.params.id
        const cancel = await Partner.findByIdAndUpdate(id,{
            partner_status:"false",
            partner_status_promiss:"ยกเลิกการเป็นพาร์ทเนอร์"
        },{new:true})
        if(cancel){
            return res
                    .status(200)
                    .send({status:true, data:cancel})
        }else{
            return res
                    .status(400)
                    .send({status:false, message:"ไม่สามารถค้นหา partner id เจอ"})
        }
    }catch(err){
        console.log(err)
        return res
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}

module.exports = { confirmPartner, cancelPartner }