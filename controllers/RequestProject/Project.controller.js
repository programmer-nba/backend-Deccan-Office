// controller.js
const ProjectType = require('../../model/ProjectType/ProjectType.model');
const RequestProject = require('../../model/RequestProject/RequestProject.model');

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

// ตัวอย่างการใช้งานในฟังก์ชัน
exports.InsertRequestProject = async (req, res, next) => {
    try {
        // รับข้อมูลจาก req.body
        const { typeid, sub_type, due_date, refs, remark, customer, employee_number , status_name} = req.body;

        // หา ProjectType จาก type_code
        const projectType = await ProjectType.findOne({type_code: typeid });
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
        const ProjectNumberString = typeCode + ProjectNumber.toString().padStart(6, '0');

        // สร้างข้อมูลใหม่ของ RequestProject
        const project = new RequestProject({
            project_id: ProjectNumberString,
            type: projectType._id, // ใช้ _id ของ projectType ที่คุณหามา
            sub_type: sub_type,
            detail: remark || '',
            start_date: new Date(),
            due_date: due_date,
            refs: refs,
            remark: remark,
            customer: customer,
            employee_number: employee_number,
            status: {
                status_name: status_name,
            }
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
            message: err.message,
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