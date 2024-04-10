const RequestProject = require ('../../model/project/RequestProject.model')

//Get RequestProject
exports.getRequestProject = async (req, res, next) => {
    try {
        const requestproject = await RequestProject.find();
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

//Insert RequestProject
exports.InsertRequestProject = async (req, res, next) => {
    try {
        const { Title, Type, Sub_type, Due_date, Refs, Remark, Customer, Status } = req.body;
        const latestProject = await RequestProject.findOne().sort({ Project_id: -1 }).limit(1);

        let ProjectNumber = 1; // ค่าเริ่มต้นสำหรับ ProjectNumber
        if (latestProject) {
            const latestProjectNumber = parseInt(latestProject.Project_id.split("D")[1]); // แยกตัวเลข Project_id ออกมาและแปลงเป็นตัวเลขจำนวนเต็ม
            ProjectNumber = latestProjectNumber + 1; // เพิ่มค่า ProjectNumber
        }

        const ProjectNumberString = Data + ProjectNumber.toString().padStart(7, '0'); // แปลง ProjectNumber เป็นสตริงพร้อมเติมเลข 0 ข้างหน้า
        const project = new RequestProject({
            Project_id: ProjectNumberString,
            Title : Title,
            Type : Type,
            Sub_type : Sub_type,
            Detail : req.body.Detail,
            Start_date : req.body.Start_date,
            Due_date : Due_date,
            Refs : Refs,
            Remark : Remark,
            Customer : Customer,
            Status : Status
        });

        // บันทึกเอกสาร
        const saved_project = await project.save();
        if (!saved_project) {
            return res.status(400).json({
                message: 'ไม่สามารถบันทึกเอกสารได้',
                status: false,
                data: null
            });
        }
        return res.status(200).json({
            message: 'เพิ่มเอกสารสำเร็จ!',
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
