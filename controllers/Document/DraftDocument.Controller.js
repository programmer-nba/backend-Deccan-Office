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

//Insert Draft Document
exports.InsertDraftDocument = async (req, res, next) => {
    try {
        const savedDraft = await DraftDocument.create(req.body);

        if (!savedDraft) {
            return res.json({
                message: 'Failed to save Draft Document',
                status: false,
                data: null,
            });
        }

        return res.json({
            message: 'Insert Draft Document successfully!',
            status: true,
            data: savedDraft,
        });
    } catch (err) {
        console.log(err);
        return res.json({
            message: err.message,
            status: false,
            data: null,
        });
    }
};

//Update Draft Document
