const Exam = require ('../../model/Exam/Exam')
const multer = require('multer');
const upload = multer();

const {
    uploadFileCreate,
    deleteFile,
    } = require("../../funtion/uploadfilecreate");

const storage = multer.diskStorage({
        filename: function (req, file, cb) {
          cb(null, Date.now() + "-" + file.originalname);
          //console.log(file.originalname);
        },
});

//Get Exam
exports.getExam = async (req, res, next) => {
    try {
        const department = req.body.department
        const position = req.body.position
        const exams = await Exam.find({extype_id:department, position:position})
            if(exams.length == 0){
                return res
                        .status(200)
                        .send({status:false, data:[]})
            }
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        const shuffledExams = shuffleArray(exams);
        const selectedExams = shuffledExams.slice(0, 5);

        return res.json({
            message: 'Get exam data successfully!',
            status: true,
            data: selectedExams
        });
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'Can not get exam data: ' + err.message,
            status: false,
            data: null
        });
    }
}

//Get Exam By Id
exports.getExamById = async (req, res, next) => {
    try {
        const exam = await Exam.findById(req.params.id);
        return res.json({
            message: 'Get exam by id successfully!',
            status : true,
            data : exam
        })
    }
    catch (err){
        console.log(err)
        return res.json({
            message: 'Can not get exam by id : '+ err.message,
            status: false,
            data : null
        })
    }
}

//Insert Exam
exports.InsertExam = async (req, res, next) => {
    try {
        let upload = multer({ storage: storage }).array("image", 20);
        upload(req, res, async function (err) {
        const {
            extype_id, 
            question_1, 
            question_2, 
            question_3, 
            c1, 
            c1_point, 
            c2, 
            c2_point, 
            c3, 
            c3_point, 
            c4, 
            c4_point, 
            cr_answer, 
            em_id, 
            statusquestion
        } = req.body;
        const reqFiles = [];
        const result = [];
        if (err) {
            return res.status(500).send(err);
        }
        let image = '' // ตั้งตัวแปรรูป
        //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
      
        if (req.files) {
            const url = req.protocol + "://" + req.get("host");
            for (var i = 0; i < req.files.length; i++) {
                const src = await uploadFileCreate(req.files, res, { i, reqFiles });
                result.push(src);
                //   reqFiles.push(url + "/public/" + req.files[i].filename);
            }
            image = reqFiles[0]
        }
        const exam = new Exam({
            extype_id : extype_id,
            question_1 : question_1,
            question_2 : question_2,
            question_3 : question_3,
            c1: c1,
            c1_point : c1_point,
            c2: c2,
            c2_point : c2_point,
            c3: c3,
            c3_point : c3_point,
            c4: c4,
            c4_point : c4_point,
            cr_answer : cr_answer,
            em_id : em_id,
            statusquestion : statusquestion,
            image : image
        });
 
        const saved_exam = await exam.save();
       
        if (!saved_exam) {
            return res.json({
                message: 'can not save exam',
                status: false,
                data: null
            });
        }
        // console.log("test")
        return res.json({
            message: 'Insert exam successfully!',
            status: true,
            data: saved_exam,
            image : image
        });
    });
    } catch (err) {
        console.log(err);
        return res.json({
            message: err.message,
            status: false,
            data: null
        });
    }
}

//Update Exam
exports.UpdateExam = async (req, res, next) => {
    try {
        const exam = await Exam.findByIdAndUpdate(req.params.id, req.body);
        return res.json({
            message: 'Update exam successfully!',
            status: true,
            data: exam
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            message: 'Can not Update exam : '+err.message,
            status: false,
            data: null
        })
    }
}

//Delete Exam
exports.DeleteExam = async (req, res, next) => {
    try {
        const exam = await Exam.findByIdAndDelete(req.params.id);
        res.json({
            message: 'Delete exam successfully!',
            status: true,
            data: exam
        });
    } catch (err) {
        console.log(err);
        return({
            message : 'Can not delete exam : '+err.message,
            status : false,
            data : null
        })
    }
}

exports.getpost = async (req, res, next) => {
    try {
        const posts = await Post.find();
        console.log('TEST')
        const formattedPosts = posts.map(post => {
            return {
                ...post._doc,
                Update_date: moment(post.Update_date).format('DD/MM/YYYY HH:mm:ss'),
                post_date: moment(post.post_date).format('DD/MM/YYYY HH:mm:ss'),
                // แปลงเวลาให้อยู่ในรูปแบบ "วัน เดือน ปี เวลา" ตามต้องการ
            };
        });
        return res.json({
            message: 'Get Post data successfully!',
            status: true,
            data: formattedPosts
        });
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'Can not get Post data',
            status: false,
            data: null
        });
    }
}