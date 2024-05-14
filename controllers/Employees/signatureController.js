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

//Insert
exports.Insert = async (req, res, next) => {
    try {
        const {terms_id, signature} = req.body

        const signaturedata = new Signature({
            user_id : req.decoded.id,
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

// //Update
exports.Update = async (req, res, next) => {
    try {
        const signature = await Signature.findByIdAndUpdate(req.params.id, req.body);
        return res.json({
            message: 'Update successfully!',
            status: true,
            data: signature
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

// Delete
exports.Delete = async (req, res, next) => {
    try {
        const signature = await Signature.findByIdAndDelete(req.params.id);
        res.json({
            message: 'Delete successfully!',
            status: true,
            data: signature
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