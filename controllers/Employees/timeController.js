const { timeInOut, Validate } = require("../../model/employee/timeInOutEmployee");
const { Employees } = require("../../model/employee/employee")

getTimeByOne = async (req, res)=>{
    try{
        const getTime = await timeInOut.find({
            employee_number: req.body.employee_number,
            //time_out: req.body.time_out
        }).select('time_in time_out') //find หา รหัสพนักงาน เลือก feild timein(ตย. การต้องการมากกว่า 1 field = .select('time_in time_out) ก็จะได้ 2 field) 
        res.send({status:true,
            data: getTime})

    } catch(err) {
        console.log(err);
        return res.status(500).send({ message: "มีบางอย่างผิดพลาด" });
    }
}
module.exports = { getTimeByOne }