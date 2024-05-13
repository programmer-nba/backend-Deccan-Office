const { Employees, Validate } = require("../../model/employee/employee");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const multer = require('multer');
const upload = multer();

const {
  uploadFileCreate,
  deleteFile,
} = require("../../funtion/uploadfilecreate");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
    //console.log(file.originalname);
  },
});

exports.Post = async (req, res) => {
  try {
    const duplicate = await Employees.findOne({
      $or: [
        { iden_number: req.body.iden_number },
        { userid: req.body.userid }
      ]
    });
    if (duplicate) {
      if (duplicate.iden_number === req.body.iden_number) {
        return res
          .status(409)
          .json({ status: false, message: 'มีผู้ใช้บัตรประชาชนนี้ในระบบแล้ว' });
      } else if (duplicate.userid === req.body.userid) {
        return res
          .status(200)
          .json({ status: false, message: 'มีผู้ใช้ยูสเซอร์ไอดีนี้ในระบบแล้ว' });
      }
    }
    

    const salt = await bcrypt.genSalt(Number(process.env.SALT)); 
    const hashPassword = await bcrypt.hash(req.body.iden_number, 10);
    
    const employee = await Employees.create({
      ...req.body,
      password: hashPassword,
      role: req.body.role,
      position: req.body.position
    });

    if (employee) {
      return res
        .status(201)
        .send({
          status: true,
          data: employee,
          message: 'เพิ่มพนักงานในระบบสำเร็จแล้ว !!'
        });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    // console.log(req.decoded.role.role.role)
    const getAllEmployee = await Employees.find(); //ดึงข้อมูลพนักงานทุกคนออกมา
    if (getAllEmployee) {
      return res
        .status(200)
        .send({ status: true, data: getAllEmployee });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ message: "มีบางอย่างผิดพลาด" });
  }
};

exports.getByID = async (req, res) => {
  try {
    //const iden = req.body.iden_number //ดึงเฉพาะข้อมูลบัตรประชาชน
    const getId = req.params.id;
    const getBy = await Employees.findById({ _id: getId }, { _id: 0, __v: 0 }) // 1 คือให้แสดงข้อมูล 0 คือไม่ให้แสดงข้อมูล
    if (getBy) {
      return res
        .status(200)
        .send({ status: true, data: getBy })
    } else {
      return res
        .status(400)
        .send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "มีบางอย่างผิดพลาด" });
  }
}

exports.getMe = async (req, res) => {
  try {
    //const iden = req.body.iden_number //ดึงเฉพาะข้อมูลบัตรประชาชน
    const getId = req.decoded.id
    console.log(getId)
    const findId = await Employees.findById(getId) // 1 คือให้แสดงข้อมูล 0 คือไม่ให้แสดงข้อมูล
    if (findId) {
      return res
        .status(200)
        .send({ status: true, data: findId })
    } else {
      return res
        .status(400)
        .send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "มีบางอย่างผิดพลาดใน getMe" });
  }
}

exports.Update = async (req, res) => {
  try {
    const upID = req.params.id; //รับไอดีที่ต้องการอัพเดท
    if (!req.body.password) { //กรณีที่ไม่ได้ยิง password
      const upload = multer({ storage: storage }).array("image", 20);
      upload(req, res, async function (err) {
        if (err) {
          return res.status(500).send(err);
        }
        let image = ''; // ตั้งตัวแปรรูป
        if (req.files) {
          const url = req.protocol + "://" + req.get("host");
          const reqFiles = [];
          for (let i = 0; i < req.files.length; i++) {
            const src = await uploadFileCreate(req.files, res, { i, reqFiles });
            reqFiles.push(src); // แก้ไขจาก result เป็น reqFiles
          }
          image = reqFiles[0];
        }
        Employees.findByIdAndUpdate(
          upID,
          {
            ...req.body,
            image: image,
            "leave.business_leave": req.body.business_leave,
            "leave.sick_leave": req.body.sick_leave,
            "leave.annual_leave": req.body.annual_leave,
            "leave.disbursement": req.body.disbursement,
          },
          { new: true }
        ).then((data) => {
          if (!data) {
            res.status(400).send({ status: false, message: "ไม่สามารถแก้ไขผู้ใช้งานนี้ได้" });
          } else {
            res.status(200).send({ status: true, message: "อัพเดทข้อมูลแล้ว", data: data });
          }
        }).catch((err) => {
          res.status(500).send({ status: false, message: "มีบางอย่างผิดพลาด" });
        });
      });
    } else { //กรณีที่ได้ยิง password
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      const updateEmployee = await Employees.findByIdAndUpdate(
        upID,
        {
          ...req.body,
          password: hashPassword,
          image: req.body.image,
          "leave.business_leave": req.body.business_leave,
          "leave.sick_leave": req.body.sick_leave,
          "leave.annual_leave": req.body.annual_leave,
          "leave.disbursement": req.body.disbursement,
        },
        { new: true }
      );

      if (updateEmployee) {
        return res.status(200).send({ status: true, data: updateEmployee });
      } else {
        return res.status(400).send({ status: false, message: "อัพเดทข้อมูลไม่สำเร็จ" });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err });
  }
}

exports.Delete = async (req, res) => {
  try {
    const employees = await Employees.findByIdAndDelete(req.params.id);
    res.json({
      message: 'Delete employees successfully!',
      status: true,
      data: employees
    });
  } catch (err) {
    next(err);
  }
}

exports.Delete = async (req, res) => {
  try {
    const employees = await Employees.findByIdAndDelete(req.params.id);
    res.json({
      message: 'Delete employees successfully!',
      status: true,
      data: employees
    });
  } catch (err) {
    next(err);
  }
}

exports.getMember = async (req, res) => {
  try {
    const position = req.decoded.position
    const role = req.decoded.role
    if (role != 'head_department') {
      return res
        .status(404)
        .send({ status: false, message: "ไม่สามารถใช้งานได้" })
    }
    const findMember = await Employees.find(
      {
        role: 'employee',
        position: position
      }
    )
    if (!findMember || findMember.length === 0) {
      return res.status(400).send({
        status: false,
        message: "ไม่สามารถค้นหาสมาชิกได้"
      });
    }
    return res
      .status(200)
      .send({ status: true, message: "สำเร็จ", data: findMember })
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: err })
  }
}

exports.UpdateImage = async (req, res) => {
  try {
    const upID = req.params.id; //รับไอดีที่ต้องการอัพเดท
    console.log(req.body);

    const upload = multer({ storage: storage }).array("image", 20);
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).send(err);
      }
      let image = ''; // ตั้งตัวแปรรูป
      if (req.files) {
        const url = req.protocol + "://" + req.get("host");
        const reqFiles = [];
        for (let i = 0; i < req.files.length; i++) {
          const src = await uploadFileCreate(req.files, res, { i, reqFiles });
          reqFiles.push(src); // แก้ไขจาก result เป็น reqFiles
        }
        image = reqFiles[0];
      }
      Employees.findByIdAndUpdate(
        upID,
        {
          image: image,
        },
        { new: true }
      ).then((data) => {
        if (!data) {
          res.status(400).send({ status: false, message: "ไม่สามารถแก้ไขผู้ใช้งานนี้ได้" });
        } else {
          res.status(200).send({ status: true, message: "อัพเดทข้อมูลแล้ว", data: data });
        }
      }).catch((err) => {
        res.status(500).send({ status: false, message: "มีบางอย่างผิดพลาด" });
      });
    });

  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err });
  }

}

exports.Update_token = async (req, res) => {
  try {
    const update = await Employees.findByIdAndUpdate(req.params.id, req.body);
    if (!update) {
      return res.status(404).json({
          message: 'ไม่มีการแก้ไข',
          status: false,
          data: null
      });
    }
    return res.json({
      message: 'Update successfully!',
      status: true,
      data: update
    });
  }
  catch (err) {
      console.log(err);
      return res.status(500).send({ message: err });
  }
}