const StatusProject = require('../../model/ProjectStatus/StatusProject'); // ตรงกับที่อยู่ของโมเดล StatusProject

// Method สำหรับดึงข้อมูล
exports.getStatusProject = async (req, res) => {
    try {
        const statusProjects = await StatusProject.find();
        if (statusProjects.length > 0) {
            res.status(200).send({ message: 'พบข้อมูล', data: statusProjects });
        } else {
            res.status(200).send({ message: 'ไม่พบข้อมูล' });
        }
    } catch (error) {
        res.status(400).send({ message: 'เกิดข้อผิดพลาด', error: error });
    }
};

// Method สำหรับดึงข้อมูลตาม ID
exports.getStatusProjectById = async (req, res) => {
    try {
        const statusProject = await StatusProject.findById(req.params.id);
        if (statusProject) {
            res.status(200).send({ message: 'พบข้อมูล', data: statusProject });
        } else {
            res.status(404).send({ message: 'ไม่พบข้อมูล' });
        }
    } catch (error) {
        res.status(400).send({ message: 'เกิดข้อผิดพลาด', error: error });
    }
};

// Method สำหรับเพิ่มข้อมูล
exports.createStatusProject = async (req, res) => {
    try {
        const statusProject = new StatusProject(req.body);
        await statusProject.save();
        res.status(201).send({ message: 'เพิ่มข้อมูลสำเร็จ', data: statusProject });
    } catch (error) {
        res.status(400).send({ message: 'เกิดข้อผิดพลาด', error: error });
    }
};

// Method สำหรับลบข้อมูล
exports.deleteStatusProject = async (req, res) => {
    try {
        await StatusProject.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'ลบข้อมูลสำเร็จ' });
    } catch (error) {
        res.status(400).send({ message: 'เกิดข้อผิดพลาด', error: error });
    }
};

// Method สำหรับแก้ไขข้อมูล
exports.updateStatusProject = async (req, res) => {
    try {
        const statusProject = await StatusProject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (statusProject) {
            res.status(200).send({ message: 'แก้ไขข้อมูลสำเร็จ', data: statusProject });
        } else {
            res.status(404).send({ message: 'ไม่พบข้อมูล' });
        }
    } catch (error) {
        res.status(400).send({ message: 'เกิดข้อผิดพลาด', error: error });
    }
};
