const Signature = require('../../model/employee/signature.model')

//Get signature
exports.getall = async (req, res, next) => {
    try {
        const signature = await Signature.find();

        if(!signature) {
            return res.json({
                message: 'not found signature',
                status: false,
            });
        }
        return res.json({
            message: 'Get signature data successfully!',
            status: true,
            data: signature
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

//Get By Id
exports.getById = async (req, res, next) => {
    try {
        const data = await Signature.findById(req.params.id);
        if (!data) {
            return res.json({
                message: 'can not find data : ' + err.message,
                status: false,
                data: null
            })
        }
        return res.json({
            message: 'Get by id successfully!',
            status: true,
            data: data
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            message: 'Can not get by id : ' + err.message,
            status: false,
            data: null
        })
    }
};

//Insert ExamType
exports.Insert = async (req, res, next) => {
    try {
        const {terms_id, signature} = req.body

        const signaturedata = new Signature({
            terms_id : terms_id,
            signature: signature
        })

        const create = await signaturedata.save()
        if (!create) {
            return res.json({
                message: 'can not create new data : ' + err.message,
                status: false,
                data: null
            })
        }
        return res.json({
            message: 'Insert successfully!',
            status: true,
            data: create
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

// //Update ExamType
// exports.UpdateExamType = async (req, res, next) => {
//     try {
//         const examtype = await ExamType.findByIdAndUpdate(req.params.id, req.body);
//         return res.json({
//             message: 'Update examtype successfully!',
//             status: true,
//             data: examtype
//         })
//     }
//     catch (err) {
//         console.log(err)
//         return res.json({
//             message: err.message,
//             status: false,
//             data: null
//         })
//     }
// }

// //Delete ExamType
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