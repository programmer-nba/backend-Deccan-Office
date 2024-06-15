const { Employees, Validate } = require("../../model/employee/employee");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const multer = require('multer');
const upload = multer();
const { roleEmployee } = require("../../model/employee/role");

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

    //const refRole = await roleEmployee.findById(req.body.role_id)

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.iden_number, salt);

    const employee = await Employees.create({
      ...req.body,
      password: hashPassword,
      role: req.body.role,
      role_id: req.body.role_id,
      position: req.body.position,
      permissioins: req.body.permissions
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
    const upID = req.params.id; //รับไอดีที่ต้องการอัพเดทad
    const upload = multer({ storage: storage }).array("image", 20);
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).send(err);
      }
      let image = ''; // ตั้งตัวแปรรูป
      if (req.files) {
        //const url = req.protocol + "://" + req.get("host");
        const reqFiles = [];
        for (let i = 0; i < req.files.length; i++) {
          const src = await uploadFileCreate(req.files, res, { i, reqFiles });
          reqFiles.push(src); // แก้ไขจาก result เป็น reqFiles
        }
        image = reqFiles[0];
      }

      let employee = await Employees.findOne({ _id: upID });
      if (!employee) return res.status(404).json({
        message: 'employee id not founded'
      })

      const currentYear = new Date().getFullYear();
      const birthDate = new Date(employee.birthday);
      console.log('employee.birthday', employee.birthday)
      const birthYear = birthDate.getFullYear();
      let age = currentYear - birthYear;

      // Adjust age if the birthday hasn't occurred yet this year
      const currentMonth = new Date().getMonth();
      const currentDay = new Date().getDate();
      const birthMonth = birthDate.getMonth();
      const birthDay = birthDate.getDate();

      if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
        age--;
      }

      const hashPassword = req.body.password ? await bcrypt.hash(req.body.password, 10) : null

      //const refRole = await roleEmployee.findById(req.body.role_id)

      employee.password = hashPassword || employee.password
      employee.employee_number = req.body.employee_number || employee.employee_number
      employee.userid = req.body.userid || employee.userid
      employee.name_title = req.body.name_title || employee.name_title
      employee.first_name = req.body.first_name || employee.first_name
      employee.last_name = req.body.last_name || employee.last_name
      employee.nick_name = req.body.nick_name || employee.nick_name
      employee.iden_number = req.body.iden_number || employee.iden_number
      employee.role = req.body.role || employee.role
      employee.position = req.body.position || employee.position
      employee.tel = req.body.tel || employee.tel
      employee.address = req.body.address || employee.address
      employee.subdistrict = req.body.subdistrict || employee.subdistrict
      employee.district = req.body.district || employee.district
      employee.provice = req.body.provice || employee.provice
      employee.postcode = req.body.postcode || employee.postcode
      employee.birthday = req.body.birthday || employee.birthday
      employee.age = age
      employee.email = req.body.email || employee.email
      employee.blacklist = req.body.blacklist || employee.blacklist
      employee.salary = req.body.salary || employee.salary
      employee.image = image || employee.image
      employee.leave = {
        business_leave: req.body.leave?.business_leave || employee.leave.business_leave,
        sick_leave: req.body.leave?.sick_leave || employee.leave.sick_leave,
        annual_leave: req.body.leave?.annual_leave || employee.leave.annual_leave,
        maternity_leave: req.body.leave?.maternity_leave || employee.leave.maternity_leave,
        ordination_leave: req.body.leave?.ordination_leave || employee.leave.ordination_leave,
        disbursement: req.body.leave?.disbursement || employee.leave.disbursement,
      }
      employee.role_id = req.body.role_id || employee.role_id
      employee.permissions = req.body.permissions || employee.permissions || []

      const saved_employee = await employee.save()
      if (!saved_employee) return res.status(500).json({
        message: 'can not save data!'
      })

      return res.status(201).json({
        message: 'update success!',
        status: true,
        data: saved_employee
      })
    })

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