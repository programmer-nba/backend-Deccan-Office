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
        if (!leavetype) {
            return res.json({
                message: 'Not Found Leave Type',
                status: false,
                data: null
            })
        }
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
        const { leavetype_name, leavetype_default } = req.body
        const leavetype = new LeaveType({
            leavetype_name: leavetype_name,
            leavetype_default: leavetype_default
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

//Update Leave Type
exports.UpdateLeaveType = async (req, res, next) => {
    try {
        const leavetype = await LeaveType.findByIdAndUpdate(req.params.id, req.body);
        if (!leavetype) {
            return res.json({
                message: 'Not Found Leave Type',
                status: false,
                data: null
            })
        }
        return res.json({
            message: 'Update leave type successfully!',
            status: true,
            data: leavetype
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

//Delete Leave Type
exports.DeleteLeaveType = async (req, res, next) => {
    try {
        const leavetype = await LeaveType.findByIdAndDelete(req.params.id);
        if (!leavetype) {
            return res.json({
                message: 'Not Found Leave Type',
                status: false,
                data: null
            })
        }
        res.json({
            message: 'Delete employees successfully!',
            status: true,
            data: leavetype
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