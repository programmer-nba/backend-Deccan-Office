const RequestProject = require('../../model/project/RequestProject.model')
const dayjs = require("dayjs");

//Get Projects
exports.getProjects = async (req, res, next) => {
    try {
        const projects = await RequestProject.find()
        return res.json({
            message: `have: ${projects.length}`,
            status: true,
            data: projects
        })
    } catch (err) {
        console.log(err)
        return res.json({
            message: err.message
        })
    }
}

//Insert a new Project
exports.createProject = async (req, res) => {
    try {
        const { code, title, qty, unit, projectType, projectSubType, dueDate, refs, remark, customer, status, permisses, billNo, startDate, detail, employees, sendAddress } = req.body
        const projects = await RequestProject.find()
        let projectNumber = 0
        if (!projects.length) {
            projectNumber = 1
        } else {
            const latestProject = projects[projects.length - 1]
            projectNumber = parseInt(latestProject.code.slice(7)) + 1
        }

        const projectNumberString = code + projectNumber.toString().padStart(6, '0')
        const defaultPermiss = []
        const permiss = permisses && permisses.length ? [...permisses] : defaultPermiss
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
                customerTel: ""
            },
            status: status,
            permisses: permiss,
            employees: employees,
            sendAddress: sendAddress,
            qty: qty,
            unit: unit
        });

        // บันทึกเอกสาร
        const saved_project = await project.save()
        if (!saved_project) {
            return res.status(400).json({
                message: 'can not save new project'
            })
        }
        return res.status(200).json({
            message: 'success!',
            status: true,
            data: saved_project
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.updateProject = async (req, res) => {
    try {
        const { code, title, projectType, qty, unit, projectSubType, dueDate, refs, remark, customer, status, permisses, billNo, startDate, detail, employees, sendAddress } = req.body
        const { id } = req.params
        const project = await RequestProject.findByIdAndUpdate(id, {
            $set: {
                code: code,
                title: title,
                projectType: projectType,
                projectSubType: projectSubType,
                dueDate: dueDate,
                refs: refs,
                remark: remark,
                customer: customer,
                status: status,
                permisses: permisses,
                billNo: billNo,
                startDate: startDate,
                detail: detail,
                employees: employees,
                sendAddress: sendAddress,
                qty: qty,
                unit: unit
            }
        }, { new: true })

        // บันทึกเอกสาร
        if (!project) {
            return res.status(400).json({
                message: 'can not save project'
            })
        }
        return res.status(200).json({
            message: 'success!',
            status: true,
            data: project
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.getProject = async (req, res) => {
    try {
        const { id } = req.params
        const project = await RequestProject.findById(id)

        if (!project) {
            return res.status(404).json({
                message: 'can not find project'
            })
        }
        return res.status(200).json({
            message: 'success!',
            status: true,
            data: project
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params
        const project = await RequestProject.findByIdAndDelete(id)

        if (!project) {
            return res.status(404).json({
                message: 'can not delete project'
            })
        }
        return res.status(200).json({
            message: 'success!',
            status: true,
            data: project.deletedCount
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports.createProjectShop = async (req, res) => {
    try {
        const ProjectNumber = await GenerateProjectNumber();
        const data = {
            code: ProjectNumber,
            detail: req.body.detail,
            customer: req.body.customer,
            refs: req.body.product_detail,
            billNo: req.body.receiptnumber,
            status: {
                name: 'รอรับงาน',
                timestamp: dayjs(Date.now()).format(""),
            },
        };
        const new_project = new RequestProject(data);
        if (!new_project)
            return res.status(403).send({ status: false, message: "ไม่สามารถเพิ่มงานในระบบได้" });
        new_project.save();
        return res.status(200).send({ status: true, message: "เพิ่มงานในระบบสำเร็จ" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

async function GenerateProjectNumber() {
    const project = await RequestProject.find();
    const count = project.length == null ? 0 : 1;
    const data = `DWG${count.toString().padStart(6, "0")}`;
    return data;
};