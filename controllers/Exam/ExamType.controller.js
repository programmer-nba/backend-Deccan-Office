const ExamType = require('../../model/Exam/ExamType')

//Get ExamType
exports.getExamType = async (req, res, next) => {
    try {
        const examtypes = await ExamType.find();
        return res.json({
            message: 'Get type data successfully!',
            status: true,
            data: examtypes
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

//Get ExamType By Id
exports.getExamTypeById = async (req, res, next) => {
    try {
        const extype = await ExamType.findById(req.params.id);
        return res.json({
            message: 'Get exam by id successfully!',
            status: true,
            data: extype
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            message: 'Can not get examtype by id : ' + err.message,
            status: false,
            data: null
        })
    }
};

//Insert ExamType
exports.InsertExamType = async (req, res, next) => {
    try {
        const { extype_id, extype_name } = req.body
        const type = new ExamType({
            extype_id: extype_id,
            extype_name: extype_name
        })
        const saved_extype = await type.save()
        if (!saved_extype) {
            return res.json({
                message: 'can not save examtype',
                status: false,
                data: null
            })
        }
        return res.json({
            message: 'Insert examtype successfully!',
            status: true,
            data: saved_extype
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