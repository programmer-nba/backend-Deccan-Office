const DraftDocument = require('../../model/document/DraftDocument')

//Get Draft Document
exports.getallDraftDocument = async (req, res, next) => {
    try {
        const draft = await DraftDocument.find();
        return res.json({
            message: 'Get draft document data successfully!',
            status: true,
            data: draft
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

//ดึงข้อมูลตามผู้ใช้คนนั้น
exports.getdraftByMe = async (req, res, next) => {
    try {
        const user_id = req.decoded.id
        const draft = await DraftDocument.find({ 'user': user_id });
        return res.json({
            message: 'Get draft documents by Me successfully!',
            status: true,
            data: draft
        });
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'Can not get draft documents by Me : ' + err.message,
            status: false,
            data: null
        });
    }
};

//Insert Draft Document
exports.InsertDraftDocument = async (req, res, next) => {
    const id = req.decoded.id;
    try {
        const savedDraft = await DraftDocument.create({ ...req.body, user: id });

        if (!savedDraft) {
            return res.status(400).json({
                message: 'Failed to save Draft Document',
                status: false,
                data: null,
            });
        }

        return res.status(200).json({
            message: 'Insert Draft Document successfully!',
            status: true,
            data: savedDraft,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal server error',
            status: false,
            data: null,
        });
    }
};

//Update Draft Document
exports.UpdateDraftDocument = async (req, res, next) => {
    try {
        const draftdocument = await DraftDocument.findByIdAndUpdate(req.params.id, req.body);
        if (!draftdocument) {
            return res.json({
                message: 'Draft document not found',
                status: false,
                data: null
            });
        }
        return res.json({
            message: 'Update draft document successfully!',
            status: true,
            data: req.body
        });
    }
    catch (err) {
        console.log(err);
        return res.json({
            message: err.message,
            status: false,
            data: null
        });
    }
}

//Delete Draft Document
exports.DeleteDraftDocument = async (req, res, next) => {
    try {
        const draftdocument = await DraftDocument.findByIdAndDelete(req.params.id);
        res.json({
            message: 'Delete employees successfully!',
            status: true,
            data: draftdocument
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