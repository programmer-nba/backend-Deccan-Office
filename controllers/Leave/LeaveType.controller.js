const LeaveType = require('../../model/leave/LeaveType')

//Get Leave Type
exports.getLeaveType = async (req, res, next) => {
    try {
        const leavetype = await LeaveType.find();
        return res.json({
            message: 'Get leave type data successfully!',
            status: true,
            data: leavetype
        });
    } catch (err) {
        console.log(err)
        return res.json({
            message: ('Can not get types data', err.message),
            status: false,
            data: null
        })
    }
}

//Get Leave Type By Id
exports.getLeaveTypeById = async (req, res, next) => {
    try {
        const leavetype = await LeaveType.findById(req.params.id);
        return res.json({
            message: 'Get leave type by id successfully!',
            status: true,
            data: leavetype
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            message: 'Can not get leave type by id : ' + err.message,
            status: false,
            data: null
        })
    }
};

//Insert Leave Type
exports.InsertLeaveType = async (req, res, next) => {
    try {
        const { leavetype_name_eng, leavetype_name_thai } = req.body
        const leavetype = new LeaveType({
            leavetype_name_eng: leavetype_name_eng,
            leavetype_name_thai: leavetype_name_thai
        })
        const saved_leavetype = await leavetype.save()
        if (!saved_leavetype) {
            return res.json({
                message: 'can not save leave type',
                status: false,
                data: null
            })
        }
        return res.json({
            message: 'Insert leave type successfully!',
            status: true,
            data: saved_leavetype
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

//Update ExamType
exports.UpdateExamType = async (req, res, next) => {
    try {
        const examtype = await ExamType.findByIdAndUpdate(req.params.id, req.body);
        return res.json({
            message: 'Update examtype successfully!',
            status: true,
            data: examtype
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
}

//Delete ExamType
exports.DeleteExamType = async (req, res, next) => {
    try {
        const examtype = await ExamType.findByIdAndDelete(req.params.id);
        res.json({
            message: 'Delete employees successfully!',
            status: true,
            data: examtype
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