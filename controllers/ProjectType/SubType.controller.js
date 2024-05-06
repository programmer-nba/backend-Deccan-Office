const SubType = require('../../model/ProjectType/SubType.model');

// เพิ่มประเภทงานใหม่
exports.InsertSubType = async (req, res) => {
  try {
    const { min_type , sub_type_name} = req.body;
    if (!min_type || !sub_type_name) {
        res.status(500).json({
            message: 'กรอกข้อมูลให้ครบ',
            status: false,
        });
    }
    const newSubType = new SubType({ 
        min_type : min_type,
        sub_type_name : sub_type_name
    });
    await newSubType.save();
    res.status(201).json({
        message: 'ประเภทงานย่อยถูกเพิ่มเรียบร้อยแล้ว',
        status: true,
        data : newSubType
    });
  } catch (error) {
    res.status(500).json({ 
        status: false, 
        message: 'เกิดข้อผิดพลาดในการเพิ่มประเภทย่อย', 
        error: error.message 
    });
  }
};

// แก้ไขข้อมูลประเภทงาน
exports.updateType = async (req, res) => {
    try {
        const type = await SubType.findByIdAndUpdate(req.params.id, req.body);
        if (!type) {
            return res.json({
                message: err.message,
                status: false,
                data: null
            })
        }
        return res.json({
            message: 'Update Project Sub Type successfully!',
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
exports.getSubTypes = async (req, res) => {
  try {
    const subtypes = await SubType.find();
    res.status(200).json({
        message : 'ดึงประเภทงานย่อยทั้งหมดสำเร็จ',
        status : true, 
        data : subtypes 
    });
  } catch (error) {
    res.status(500).json({ 
        message : 'เกิดข้อผิดพลาดในการดึงข้อมูลประเภทงาน : ' + err.message,
        status : false, 
        data : null
    });
  }
};

// ดึงข้อมูลประเภทงานทั้งหมดโดย ID min_type
exports.getSubTypesByMain = async (req, res) => {
  try {
    const min_type = req.params.min_type;
    const subtypes = await SubType.find({ min_type });
    if (!subtypes) {
        res.status(500).json({ 
            message : 'ไม่พบประเภทหลัก',
            status : false, 
            data : null
        });
    }
    res.status(200).json({
        message : 'ดึงประเภทงานย่อยทั้งหมดสำเร็จ',
        status : true, 
        data : subtypes 
    });
  } catch (err) {
    res.status(500).json({ 
        message : 'เกิดข้อผิดพลาดในการดึงข้อมูลประเภทงาน : ' + err.message,
        status : false, 
        data : null
    });
  }
};