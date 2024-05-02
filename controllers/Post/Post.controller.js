const Post = require('../../model/Post/Post')
const multer = require('multer');
const upload = multer();
const moment = require('moment');

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

//Get Post
exports.getpost = async (req, res, next) => {
    try {
        const posts = await Post.find();
        console.log(posts)
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

//Get Post By Id
exports.getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        return res.json ({
            message: 'get post by id successfully!',
            status: true,
            data: post
        })
    }
    catch (err) {
        console.log (err)
        return res.json ({
            message: 'Can not get post by id : '+err.message,
            status: false,
            data: null
        })
    }
}

//Insert Post
exports.Insertpost = async (req, res, next) => {
    try {
        let upload = multer({ storage: storage }).array("image", 20);
        upload(req, res, async function (err) {
        const { 
            Company, 
            Header, 
            Description, 
            department,
            amount,// จำนวนคนที่รับ
            start_age,// อายุที่รับเข้าทำงาน
            end_age,
            salary, 
            sex, 
            experience, //ประสบการณ์
            Education, //ระดับการศึกษา
             //สาขาวิชา
            feature, //คุณสมบัติ (เพิ่มได้หลายอัน)
            Working, //ลักษณะงาน (เพิ่มได้หลายอัน)
            Welfare, //สวัสดิการ (เพิ่มได้หลายอัน)
            end_date
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
        const post = new Post({
            Company : Company,
            Header : Header,
            Description : Description,
            department : department,
            amount : amount,
            age : { start_age, end_age },
            salary : salary,
            sex : sex, 
            experience : experience,
            Education : Education,
            end_date : end_date,
            image : image
        });

        if (Array.isArray(feature) && feature.length > 0) { //เมื่อไม่มีการส่งค่าของ feature มาจะไม่ทำขั้นตอนนี้
            feature.forEach(item => {
                post.feature.push({
                    feature_detail: item.feature_detail
                });
            });
        }

        if (Array.isArray(Working) && Working.length > 0) { //เมื่อไม่มีการส่งค่าของ Working มาจะไม่ทำขั้นตอนนี้
            Working.forEach(item => {
                post.Working.push({
                    working: item.working
                });
            });
        }

        if (Array.isArray(Welfare) && Welfare.length > 0) { //เมื่อไม่มีการส่งค่าของ Welfare มาจะไม่ทำขั้นตอนนี้
            Welfare.forEach(item => {
                post.Welfare.push({
                    welfare: item.welfare
                });
            });
        }
        const saved_post = await post.save();
        if (!saved_post) {
            return res.json({
                message: 'can not save post',
                status: false,
                data: null
            });
        }
        // console.log("test")
        return res.json({
            message: 'Insert post successfully!',
            status: true,
            data: saved_post,
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
};

//Update Post
exports.Updatepost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {...req.body, Update_date: Date.now()});
        if (!post) {
            return res.json({
                message: 'Eror do not have value',
                status: false,
                data: null
            })
        }
        return res.json({
            message: 'Update post successfully!',
            status: true,
            data: post
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            message: 'Can not Update post : '+err.message,
            status: false,
            data: null
        })
    }
}

//Delete Post
exports.Deletepost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        res.json({
            message: 'Delete employees successfully!',
            status: true,
            data: post
        });
    } catch (err) {
        console.log(err)
        return res.json({
            message: err.message,
            status: false,
            data: null
        })
    }
}
