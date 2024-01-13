const { timeInOut, Validate } = require("../../model/employee/timeInOutEmployee");

timeIn = async (req, res)=>{
    try{
    const {error} = Validate(req.body); //ตรวจสอบความถูกต้องของข้อมูลที่เข้ามา
    if (error){
      return res
        .status(403)
        .send({ status: false, message: error.details[0].message });
    }
    const timein = req.body
    if (timein){
        console.log(timein)
        res.send({data: timein})
    }
    
    } catch(err) {
        console.log(err);
        return res.status(500).send({ message: "มีบางอย่างผิดพลาด" });
    }
}
module.exports = { timeIn }
