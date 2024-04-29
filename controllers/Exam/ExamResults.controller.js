const ExamResults = require ('../../model/Exam/ExamResults')

//Get ExamResults
exports.getExamResults = async (req, res, next) => {
    try {
        const examresults = await ExamResults.find();
        return res.json({
            message: 'Get ExamResults data successfully!',
            status: true,
            data: examresults
        });
    } catch (err) {
        console.log(err)
        return res.json({
            message: ('Can not get ExamResults data', err.message),
            status: false,
            data: null
        })
    }
}

//Get ExamResults By Id
exports.getExamResultsById = async (req, res, next) => {
    try {
        const extype = await ExamResults.findById(req.params.id);
        return res.json({
            message: 'Get ExamResults by id successfully!',
            status: true,
            data: extype
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            message: 'Can not get ExamResults by id : ' + err.message,
            status: false,
            data: null
        })
    }
}

//Insert ExamResults
exports.InsertExamResults = async (req, res, next) => {
    try {
        const { User_id, Position_applied, Score, Result } = req.body
        const examresults = new ExamResults({
            User_id : User_id,
            Position_applied : Position_applied,
            Score : Score,
            Result : Result
        })
        const saved_examresults = await examresults.save()  
        if (!saved_examresults) {
            return res.json({
                message: 'can not save examresults',
                status: false,
                data: null
            })
        }
        return res.json({
            message: 'Insert examresults successfully!',
            status: true,
            data: saved_examresults
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

//Update ExamResults
exports.UpdateExamResults = async (req, res, next) => {
    try {
        const examresults = await ExamResults.findByIdAndUpdate(req.params.id, req.body);
        return res.json({
            message: 'Update ExamResults successfully!',
            status: true,
            data: examresults
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

// Update ExamResults By User_id
exports.UpdateExamResultsByID = async (req, res, next) => {
    try {
        const examresults = await ExamResults.findOneAndUpdate(
            { User_id: req.params.User_id },
            req.body,
            { new: true }
        );
        return res.json({
            message: 'Update ExamResults by User_id successfully!',
            status: true,
            data: examresults
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Failed to update ExamResults by User_id',
            status: false,
            data: null
        });
    }
};


//Delete ExamResults
exports.DeleteExamResults = async (req, res, next) => {
    try {
        const exam = await ExamResults.findByIdAndDelete(req.params.id);
        res.json({
            message: 'Delete ExamResults successfully!',
            status: true,
            data: exam
        });
    } catch (err) {
        console.log(err);
        return({
            message : 'Can not delete ExamResults : '+err.message,
            status : false,
            data : null
        })
    }
}