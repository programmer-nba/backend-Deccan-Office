const RequestProject = require ('../../model/project/RequestProject.model')

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
        const { code, title, projectType, projectSubType, dueDate, refs, remark, customer, status, permisses, billNo, startDate, detail, employees } = req.body
        const projects = await RequestProject.find()
        let projectNumber = 0
        if (!projects.length) {
            projectNumber = 1
        } else {
            const latestProject = projects[projects.length - 1]
            projectNumber = parseInt(latestProject.code.slice(7)) + 1
        }

        const projectNumberString = code + projectNumber.toString().padStart(6, '0')

        const project = new RequestProject({
            code: projectNumberString,
            title : title,
            projectType : projectType,
            projectSubType : projectSubType,
            detail : detail,
            startDate : startDate,
            dueDate : dueDate,
            refs : refs,
            billNo : billNo,
            remark : remark,
            customer : customer || {
                _id : "",
                name : "",
                customerType : "",
                customerTel : ""
            },
            status : status,
            permisses : permisses,
            employees: employees
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
        const { code, title, projectType, projectSubType, dueDate, refs, remark, customer, status, permisses, billNo, startDate, detail, employees } = req.body
        const { id } = req.params
        const project = await RequestProject.findByIdAndUpdate( id, {
            $set: {
                code : code, 
                title: title, 
                projectType : projectType, 
                projectSubType : projectSubType, 
                dueDate : dueDate, 
                refs : refs, 
                remark : remark, 
                customer : customer, 
                status : status, 
                permisses : permisses, 
                billNo : billNo, 
                startDate : startDate, 
                detail : detail,
                employees: employees
            }
        }, { new : true } )

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
        const project = await RequestProject.findById( id )

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
        const project = await RequestProject.findByIdAndDelete( id )

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
