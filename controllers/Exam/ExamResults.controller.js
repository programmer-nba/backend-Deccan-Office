const ExamResults = require ('../../model/Exam/ExamResults')
const Post = require('../../model/Post/Post')
const Userinfo =require ('../../model/Userinfo/Userinfo')

//Get ExamResults
exports.getExamResults = async (req, res, next) => {
    try {
        const examresults = await ExamResults.find({"Meeting.meeting_date": { $ne: null } });
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
        const extype = await ExamResults.find(
            {User_id:req.params.id,
            "Meeting.meeting_date": { $ne: null } }
        );
        if (!extype) {
            return res.status(404).json({
                message: 'ExamResults not found',
                status: false,
                data: null
            });
        }
        return res.json({
            message: 'Get ExamResults by id successfully!',
            status: true,
            data: extype
        });
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'Can not get ExamResults by id : ' + err.message,
            status: false,
            data: null
        });
    }
};

//Insert ExamResults
exports.InsertExamResults = async (req, res, next) => {
    try {
        const { Position_applied, Score, Result, position, postid } = req.body

        const checkdata = await ExamResults.findOne({ 
            $and: [
                { 'User_id': req.decoded.id },
                { 'postid': postid }
            ]
        });
        if(checkdata) {
            return res.json({
                message: 'ไม่สามารถสมัครตำแหน่งเดิมได้',
                status: false,
                data: null
            })
        }
        const postdata = await Post.findById(postid)
        if (!postdata) {
            return res.json({
                message: 'ไม่พบ ID ประกาศ',
                status: false,
                data: null
            })
        }

        const pushuserdata = {
            user_id : req.decoded.id,
        }
        postdata.applicants.push(pushuserdata);

        const examresults = new ExamResults({
            User_id : req.decoded.id,
            Position_applied : Position_applied,
            Score : Score,
            Result : Result,
            Position: position,
            postid : postid
        })
        
        const saved_user = await examresults.save()  
        if (!saved_user) {
            return res.json({
                message: 'can not save user',
                status: false,
                data: null
            })
        }

        const saved_post = await postdata.save();
        if (!saved_post) {
            return res.json({
                message: 'can not save post',
                status: false,
                data: null
            })
        }

        await Userinfo.findByIdAndUpdate(req.decoded.id, { neworold: "Old" });

        return res.json({
            message: 'Insert examresults successfully!',
            status: true,
            data: saved_user
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
        const examresults = await ExamResults.findByIdAndUpdate(req.params.id,{...req.body},{new:true});
        if (!examresults) {
            return res.json({
                message: 'ExamResults not found',
                status: true,
                data: examresults
            })
        }
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
        const examresults = await ExamResults.findByIdAndDelete(req.params.id);
        if (!examresults) {
            return res.json({
                message: 'ExamResults not found',
                status: true,
                data: examresults
            })
        }
        res.json({
            message: 'Delete ExamResults successfully!',
            status: true,
            data: examresults
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

exports.getExamResultsByIdAll = async (req, res, next) => {
    try {
        const extype = await ExamResults.find(
            {User_id:req.params.id}
        );
        if (!extype) {
            return res.status(404).json({
                message: 'ExamResults not found',
                status: false,
                data: null
            });
        }
        return res.json({
            message: 'Get ExamResults by id successfully!',
            status: true,
            data: extype
        });
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'Can not get ExamResults by id : ' + err.message,
            status: false,
            data: null
        });
    }
};
