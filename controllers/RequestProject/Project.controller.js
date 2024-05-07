// controller.js
const ProjectType = require('../../model/ProjectType/ProjectType.model');
const RequestProject = require('../../model/RequestProject/RequestProject.model');
const { Employees } = require('../../model/employee/employee');
const Type = require('../../model/ProjectType/ProjectType.model');


// เรียกใช้ข้อมูล RequestProject
exports.getRequestProject = async (req, res, next) => {
    try {
        const requestproject = await RequestProject.find().populate('type');
        return res.json({
            message: 'Get RequestProject data successfully!',
            status: true,
            data: requestproject
        });
    } catch (err) {
        console.log(err)
        return res.json({
            message: ('Can not get RequestProject data', err.message),
            status: false,
            data: null
        })
    }
}

//เพิ่มข้อมูล
exports.InsertRequestProject = async (req, res, next) => {
    try {
        // รับข้อมูลจาก req.body
        const { type } = req.body;

        // หา ProjectType จาก type_code
        const projectType = await ProjectType.findOne({ id: type });
        if (!projectType) {
            return res.status(400).json({
                message: 'ไม่พบประเภทโครงการที่ระบุ',
                status: false,
                data: null
            });
        }

        // หา Project ล่าสุดเพื่อสร้าง ProjectNumber ใหม่
        const latestProject = await RequestProject.findOne().sort({ project_id: -1 }).limit(1);
        let ProjectNumber = 1;
        if (latestProject && latestProject.project_id) {
            ProjectNumber = parseInt(latestProject.project_id.slice(7)) + 1;
        }

        // สร้าง ProjectNumberString
        const ProjectNumberString = projectType.type_code + ProjectNumber.toString().padStart(6, '0');

        // สร้างข้อมูลใหม่ของ RequestProject
        const project = new RequestProject({
            project_id: ProjectNumberString,
            ...req.body
        });

        // บันทึกข้อมูลเอกสาร
        const saved_project = await project.save();
        if (!saved_project) {
            return res.status(400).json({
                message: 'ไม่สามารถบันทึกข้อมูลเอกสารได้',
                status: false,
                data: null
            });
        }
        return res.status(200).json({
            message: 'เพิ่มข้อมูลเอกสารสำเร็จ!',
            status: true,
            data: saved_project
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลเอกสาร: ' + err.message,
            status: false,
            data: null
        });
    }
}

// อัพเดตข้อมูล RequestProject
exports.updateRequestProject = async (req, res, next) => {
    try {
        const requestId = req.params.id; // รับ id ของ RequestProject ที่ต้องการอัพเดตจาก URL parameters
        const updateData = req.body; // ข้อมูลที่ต้องการอัพเดต

        // รับข้อมูล customer_name จาก req.body
        const { customer_name } = req.body;

        // ตรวจสอบข้อมูลที่ได้รับ
        if (!updateData) {
            return res.status(400).json({
                message: 'ไม่มีข้อมูลที่ต้องการอัพเดต',
                status: false,
                data: null
            });
        }

        // ตรวจสอบว่ามี ProjectType ที่ระบุในข้อมูลที่ต้องการอัพเดต
        if (updateData.type_code) {
            const projectType = await ProjectType.findOne({ type_code: updateData.type_code });
            if (!projectType) {
                return res.status(400).json({
                    message: 'ไม่พบประเภทโครงการที่ระบุ',
                    status: false,
                    data: null
                });
            }
            updateData.type = projectType._id; // ใช้ ObjectId ของ projectType
        }

        // อัพเดตข้อมูล รวมถึง customer_name
        const updatedRequestProject = await RequestProject.findByIdAndUpdate(requestId, { ...updateData, customer: customer_name }, { new: true });

        if (!updatedRequestProject) {
            return res.status(404).json({
                message: 'ไม่พบ RequestProject ที่ต้องการอัพเดต',
                status: false,
                data: null
            });
        }

        return res.status(200).json({
            message: 'อัพเดตข้อมูล RequestProject สำเร็จ!',
            status: true,
            data: updatedRequestProject
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการอัพเดต RequestProject',
            status: false,
            data: null
        });
    }
}

// ฟังก์ชั่นเพื่อลบข้อมูล RequestProject จากฐานข้อมูล
exports.deleteRequestProject = async (req, res, next) => {
    try {
        const requestId = req.params.id; // รับ id ของ RequestProject ที่ต้องการลบจาก URL parameters
        const deletedRequestProject = await RequestProject.findByIdAndDelete(requestId); // ลบ RequestProject จากฐานข้อมูล

        if (!deletedRequestProject) {
            return res.status(404).json({
                message: 'ไม่พบ RequestProject ที่ต้องการลบ',
                status: false,
                data: null
            });
        }

        return res.status(200).json({
            message: 'ลบ RequestProject สำเร็จ!',
            status: true,
            data: deletedRequestProject
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการลบ RequestProject',
            status: false,
            data: null
        });
    }
}

//Update Accept
exports.Accept = async (req, res, next) => {
    try {

        const employee = req.decoded.id
        console.log(employee)
        if (!employee) {
            return res.json({
                message: 'ไม่พบพนักงาน',
                status: false,
                data: null
            })
        }

        const accept = await RequestProject.findByIdAndUpdate(req.params.id, req.body); //แก้ไขสถาณะ

        const employeeaccept = {
            employee_id: req.decoded.id,
            time: Date.now()
        };

        accept.status = "อยู่ระหว่างกำลังดำเนินการ"
        accept.employee.push(employeeaccept);

        await accept.save();

        return res.json({
            message: 'Accept successfully!',
            status: true,
            data: accept
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            message: err.message,
            status: false,
            data: null
        })
    }
};

// ดึงข้อมูลตาม types
exports.getProjectType = async (req, res, next) => {
    try {
        em_id = req.decoded.id

        const getEmployee = await Employees.findById({ _id: req.decoded.id })

        console.log(req.decoded.position)

        const projectdata = await RequestProject.find();

        console.log('aaa',projectdata)

        const projecttypes = await Type.findById(projectdata.type);

        console.log(projecttypes)

        return res.json({
            message: 'Get data successfully!',
            status: true,
            data: projectdata
        });
    } catch (err) {
        console.log(err)
        return res.json({
            message: ('Can not get data', err.message),
            status: false,
            data: null
        })
    }
}