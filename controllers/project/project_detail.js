const { object } = require("joi");
const { Employees } = require("../../model/employee/employee");
const { projectTime } = require("../../model/project/project");

createProject = async (req, res)=>{
    try{
        
        // req.body.employee เป็น Array ของ employee_number
        const employeeNumbers = req.body.employee_yoyo
        // สร้าง Array เพื่อเก็บข้อมูลของแต่ละพนักงาน
        const employeesData = [];
        
        // สำหรับแต่ละ employee_number ทำการค้นหาและเพิ่มข้อมูลเข้า Array
        for (const employeeNumber of employeeNumbers) {
        const employee = await Employees.findOne({ employee_number: employeeNumber });
            if (!employee) {
                // ถ้าไม่พบข้อมูล employee จะส่ง response ว่าไม่อยู่ในระบบ
                return res
                        .status(404)
                        .json({ status: false, message: `พนักงานหมายเลข ${employeeNumber} ไม่อยู่ในระบบ` });
            }else{
                // ถ้าพบข้อมูล employee จาก findOne
                    employeesData.push({
                        employee_number: employee.employee_number || '',
                        department: employee.role.department || '',
                        job_position: employee.role.job_position || '',
                        name: employee.first_name + ' ' + employee.last_name
                    });
            }
        }
       
        const Data = {
            project_name: req.body.project_name,
            date: req.body.date,
            dead_line: req.body.dead_line,
            employee: employeesData,
            ...req.body
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

getAll = async(req, res)=>{
    try{
        const get = await projectTime.find()
        if(get){
            return res
                    .status(200)
                    .send({status:false, data: get})
        }else{
            return res
                    .status(400)
                    .send({status:false, message:"ไม่สามารถค้นหาโปรเจ็คได้"})
        }
    }catch(err){
        console.log(err)
        return res
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}

updateTOR = async(req, res)=>{
    try{
        const id = req.params.id
        const { title, newDetail } = req.body
        // ใช้ findByIdAndUpdate เพื่ออัปเดตข้อมูล
        const upArray = await projectTime.findOneIdAndUpdate(
        { _id:id, 'TOR.title': title },
        { $push: { 'TOR.$.detail': newDetail } },
        { new: true });
        if(upArray){
            return res
                    .status(200)
                    .send({status:true, data:upArray})
        }else{
            return res 
                    .status(400)
                    .send({status:false, message:"ไม่สามารถอัพเดทได้"})
        }
    }catch(err){
        console.log(err)
        return res
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}

deleteTOR = async(req, res)=>{
    try{
        const id = req.params.id
        const title = req.body.title
        // ใช้ findByIdAndUpdate เพื่ออัปเดตข้อมูล
        const upArray = await projectTime.findOneAndUpdate(
        { _id:id, 'TOR.title': title },
        { $pull: { 'TOR.$.detail': { $exists: true } } }, //{$exists: true} ใช้เพื่อให้แน่ใจว่าฟิลด์ที่ต้องการทำการ $pull อยู่ในเอกสารนั้น ๆ และไม่มีการกำหนดค่าเป็น null หรือไม่มีอยู่เลย.
        { new: true });
        if(upArray){
            const updatedArray = []
            for(const index of req.body.index){
                const removedItem = upArray.TOR[index].detail.pop();// ลบข้อมูลที่ต้องการ
                updatedArray.push({index, removedItem})
            } 
            await upArray.save();  // บันทึกการเปลี่ยนแปลง
            return res
                    .status(200)
                    .send({status:true, data:updatedArray})
        }else{
            return res 
                    .status(400)
                    .send({status:false, message:"ไม่สามารถอัพเดทได้"})
        }
    }catch(err){
        console.log(err)
        return res
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}

module.exports = { createProject, getAll, updateTOR, deleteTOR }

// ยิง Req ใน postman คือ 
// employee[
//     {
//         employee_number:"78", (req.body.employee.map(emp => emp.employee_number))
//         department:"ggex",
//         job_position: "ezzee"
//     }
// ]
//.map() ถูกใช้เพื่อทำการวนลูปผ่านทุก ๆ object ใน Array นี้. ส่วนที่สำคัญคือ emp => emp.employee_number ซึ่งเป็นฟังก์ชันลัด (arrow function) ที่ให้ผลลัพธ์เป็น employee_number ของแต่ละ object.
// const employeeNumbersFull = req.body.employee.map(function(emp) {
//   return emp.employee_number;
// });
// const fixName = await Promise.all(req.body.employee.map(async (employee) => {
        //     const find = await Employees.findOne({ employee_number: employee.employee_number });
        //     if (find) {
        //       ถ้าพบข้อมูล employee จาก findOne
        //       return {
        //         employee_number: find.employee_number || '',
        //         department: find.role.department || '',
        //         job_position: find.role.job_position || '',
        //         name: find.first_name + ' ' + find.last_name
        //       };
        //     } else {
        //       console.log("ไม่สามารถดึงข้อมูลได้")
        //     }
        //   }));