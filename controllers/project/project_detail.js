const { Employees } = require("../../model/employee/employee");
const { projectTime, Validate} = require("../../model/project/project");

createProject = async (req, res)=>{
    try{
        const Data = {
            project_name: req.body.project_name,
            date: req.body.date,
            dead_line: req.body.dead_line,
            ...req.body,
        }
        const validationResult = Validate(Data);
        if (validationResult.error) {
            //console.error(validationResult.error.details);
            return res
                    .status(400)
                    .send({status:false, detail: validationResult.error.details})
          } else {
            console.log("Validation passed successfully!");
          }
        //.map() ถูกใช้เพื่อทำการวนลูปผ่านทุก ๆ object ใน Array นี้. ส่วนที่สำคัญคือ emp => emp.employee_number ซึ่งเป็นฟังก์ชันลัด (arrow function) ที่ให้ผลลัพธ์เป็น employee_number ของแต่ละ object.
        const employeeNumbers = req.body.employee.map(emp => emp.employee_number);

        for (const employeeNumber of employeeNumbers) {
        const employee = await Employees.findOne({ employee_number: employeeNumber });
            if (!employee) {
                // ถ้าไม่พบข้อมูล employee จะส่ง response ว่าไม่อยู่ในระบบ
                return res
                        .status(404)
                        .json({ status: false, message: `พนักงานหมายเลข ${employeeNumber} ไม่อยู่ในระบบ` });
            }
        }
        const createData = await projectTime.create(Data)
        if(createData){
            return res
                    .status(200)
                    .send({status:true, data: createData})
        }else{
            return res
                    .status(400)
                    .send({status:false, message:"ไม่สามารถสร้างข้อมูลได้"})
        }
    }catch(err){
        console.log(err)
        return res
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}

module.exports = { createProject }