const Type = require('../../model/ProjectType/ProjectType.model');
const SubType = require('../../model/ProjectType/ProjectType.model');

// เพิ่มประเภทงานใหม่
exports.createType = async (req, res) => {
  try {
    const { name , code} = req.body;
    if (!name || !code) {
        return res.status(500).json({
            message: 'กรอกข้อมูลให้ครบ',
            status: false,
        });
    }
    const newType = new Type({ 
        name : name,
        code : code
    });
    await newType.save();
    res.status(201).json({
        message: 'ประเภทงานถูกเพิ่มเรียบร้อยแล้ว',
        status: true,
        data : newType
    });
  } catch (error) {
    res.status(500).json({ status: false, message: 'เกิดข้อผิดพลาดในการเพิ่มประเภทงาน', error: error.message });
  }
};

// แก้ไขข้อมูลประเภทงาน
exports.updateType = async (req, res) => {
    try {
        const type = await Type.findByIdAndUpdate(req.params.id, req.body);
        if (!type) {
            return res.json({
                message: err.message,
                status: false,
                data: null
            })
        }
        return res.json({
            message: 'Update Project Type successfully!',
            status: true,
            data: req.body
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

// ลบประเภทงาน
exports.deleteType = async (req, res) => {
    try {
        const projecttype = await Type.findByIdAndDelete(req.params.id);
        if (!projecttype) {
            return res.json({
                message: err.message,
                status: false,
                data: null
            })
        }
        res.json({
            message: 'Delete Project Type successfully!',
            status: true,
            data: projecttype
        });
    } catch (err) {
        console.log(err)
        return res.json({
            message: err.message,
            status: false,
            data: null
        })
    }
};

// ดึงข้อมูลประเภทงานทั้งหมด
exports.getTypes = async (req, res) => {
  try {
    const types = await Type.find();
    res.status(200).json({
        message : 'ดึงประเภทงานทั้งหมดสำเร็จ',
        status : true, 
        data : types 
    });
  } catch (error) {
    res.status(500).json({ 
        message : 'เกิดข้อผิดพลาดในการดึงข้อมูลประเภทงาน : ' + err.message,
        status : false, 
        data : null
    });
  }
};