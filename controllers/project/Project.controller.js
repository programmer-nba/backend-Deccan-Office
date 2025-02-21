const { default: axios } = require("axios");
const RequestProject = require("../../model/project/RequestProject.model");
const dayjs = require("dayjs");

//Get Projects
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await RequestProject.find();
    return res.json({
      message: `have: ${projects.length}`,
      status: true,
      data: projects,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      message: err.message,
    });
  }
};

//Insert a new Project
exports.createProject = async (req, res) => {
  try {
    const {
      code,
      title,
      qty,
      unit,
      projectType,
      projectSubType,
      dueDate,
      refs,
      remark,
      customer,
      status,
      permisses,
      billNo,
      startDate,
      detail,
      employees,
      sendAddress,
    } = req.body;
    const projects = await RequestProject.find();
    let projectNumber = 0;
    if (!projects.length) {
      projectNumber = 1;
    } else {
      const latestProject = projects[projects.length - 1];
      projectNumber = parseInt(latestProject.code.slice(7)) + 1;
    }

    const projectNumberString =
      code + projectNumber.toString().padStart(6, "0");
    const defaultPermiss = [];
    const permiss =
      permisses && permisses.length ? [...permisses] : defaultPermiss;
    const project = new RequestProject({
      code: projectNumberString,
      title: title,
      projectType: projectType,
      projectSubType: projectSubType,
      detail: detail,
      startDate: startDate,
      dueDate: dueDate,
      refs: refs,
      billNo: billNo,
      remark: remark,
      customer: customer || {
        _id: "",
        name: "",
        customerType: "",
        customerTel: "",
      },
      status: status,
      permisses: permiss,
      employees: employees,
      sendAddress: sendAddress,
      qty: qty,
      unit: unit,
      status: {
        name: "รอรับงาน",
        timestamp: dayjs(Date.now()).format(""),
      },
    });

    // บันทึกเอกสาร
    const saved_project = await project.save();
    if (!saved_project) {
      return res.status(400).json({
        message: "can not save new project",
      });
    }
    return res.status(200).json({
      message: "success!",
      status: true,
      data: saved_project,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.acceptProjectOffice = async (req, res) => {
  try {
    const id = req.params.id;
    const { employees } = req.body;
    const project = await RequestProject.findByIdAndUpdate(
      id,
      {
        $set: {
          employees: employees,
        },
        $push: {
          status: {
            name: "กำลังดำเนินการ",
            timestamp: dayjs(Date.now()).format(""),
          },
        },
      },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({
        message: "not found",
      });
    }

    return res.status(201).json({
      message: "success",
      status: true,
      data: project,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.updateProjectOffice = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await RequestProject.findByIdAndUpdate(
      id,
      {
        $push: {
          status: {
            name: req.body.status,
            timestamp: dayjs(Date.now()).format(""),
          },
        },
      },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({
        message: "not found",
      });
    }

    return res.status(201).json({
      message: "success",
      status: true,
      data: project,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await RequestProject.findOne({ _id: id });

    // 🔍 ตรวจสอบว่าเจอโปรเจคหรือไม่
    if (!project) {
      return res
        .status(404)
        .json({ status: false, message: "Project not found" });
    }

    // 🔍 ป้องกันค่า undefined
    if (!project.status) project.status = [];
    if (!project.employees) project.employees = [];

    // 🔍 อัพเดทสถานะและพนักงาน
    project.status.push({
      name: "กำลังดำเนินการ",
      timestamp: dayjs(Date.now()).format(""),
    });

    project.employees.push(req.body.employees);

    // 🔍 บันทึกลง MongoDB
    await project.save();

    console.log("✅ อัพเดทโปรเจคสำเร็จ");
    return res
      .status(200)
      .json({ status: true, message: "อัพเดทโปรเจคสำเร็จ", data: project });
  } catch (err) {
    console.error("❌ Server Error:", err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.acceptProject = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await RequestProject.findOne({ _id: id });
    const resp = await axios.put(
      `${process.env.URL_TOSSAGUN}/order/service/submit/${project.billNo}`
    );
    if (resp.data.status) {
      const status = {
        name: "ดำเนินการสำเร็จ",
        timestamp: dayjs(Date.now()).format(""),
      };
      project.status.push(status);
      project.save();
      console.log("อัพเดทสถานะสำเร็จ");
      return res
        .status(200)
        .send({ status: true, message: "ยืนยันรับงานทำเสร็จ" });
    }
    if (!resp.response.data.staus) {
      return res
        .status(403)
        .send({ status: false, message: resp.response.data.message });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.getProject = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 ดึงโปรเจค และรวมข้อมูลพนักงาน (`populate`)
    const project = await RequestProject.findById(id).populate("employees");
    
    if (!project) {
      return res.status(404).json({
        message: "not found",
      });
    }

    return res.status(200).json({
      message: "success",
      status: true,
      data: project,
    });


  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await RequestProject.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        message: "can not delete project",
      });
    }
    return res.status(200).json({
      message: "success!",
      status: true,
      data: project.deletedCount,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.createProjectShop = async (req, res) => {
  try {
    const ProjectNumber = await GenerateProjectNumber();
    const data = {
      code: ProjectNumber,
      title: "งานจากทศกัณฐ์",
      projectType: "tossagun",
      detail: req.body.detail,
      customer: req.body.customer,
      refs: req.body.product_detail,
      billNo: req.body.receiptnumber,
      status: {
        name: "รอรับงาน",
        timestamp: dayjs(Date.now()).format(""),
      },
    };
    const new_project = new RequestProject(data);
    if (!new_project)
      return res
        .status(403)
        .send({ status: false, message: "ไม่สามารถเพิ่มงานในระบบได้" });
    new_project.save();
    return res
      .status(200)
      .send({ status: true, message: "เพิ่มงานในระบบสำเร็จ" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports.cancelProjectShop = async (req, res) => {
  try {
    const project = await RequestProject.findOne({ billNo: req.body.invoice });
    console.log(project);
    const status = {
      name: "งานถูกยกเลิก",
      timestamp: dayjs(Date.now()).format(""),
    };
    project.status.push(status);
    project.save();
    console.log("อัพเดทสถานะสำเร็จ");
    return res.status(200).send({ status: true, message: "ยกเลิกงานสำเร็จ" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

async function GenerateProjectNumber() {
  const pipelint = [
    {
      $group: { _id: 0, count: { $sum: 1 } },
    },
  ];
  const count = await RequestProject.aggregate(pipelint);
  const countValue = count.length > 0 ? count[0].count + 1 : 1;
  const data = `DWG${dayjs(Date.now()).format("YYMMDD")}${countValue
    .toString()
    .padStart(3, "0")}`;
  return data;
}
