const { timeInOut, Validate } = require("../../model/employee/timeInOutEmployee");
const { Employees } = require("../../model/employee/employee")

timeIn = async (req, res)=>{
    try{
       
        const timein = req.body
        const findEmployees = await Employees.findOne({employee_number:timein.employee_number})
        if (!findEmployees){
            return res
                .status(400)
                .send({status:false, message:"ไม่พบรหัสสมาชิกของท่านในระบบ"})
        }    
        const createTime = await timeInOut.create(timein)
        if (createTime){
            return res
                .status(200)
                .send({data: createTime})
            }
    } catch(err) {
        console.log(err);
        return res.status(500).send({ message: "มีบางอย่างผิดพลาด" });
    }
}
module.exports = { timeIn }
