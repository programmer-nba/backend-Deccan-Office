const { breakTime } = require("../../model/employee/breakTIme");
const { Employees } = require("../../model/employee/employee");

break_time = async (req, res)=>{
    try{
        const id = req.decoded.user_id
        const findId = await Employees.findOne({_id:id})
        if(findId){
            const createTime = breakTime.create({employee_id:id})
            return res 
                    .status(200)
                    .send({status:true, data: createTime})
        }else{
            return res  
                    .status(400)
                    .send({status:false, message:"หาไอดีพาร์ทเนอร์ของท่านไม่เจอ"})
        }
    }catch(err){
        return res
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}
module.exports = { break_time }