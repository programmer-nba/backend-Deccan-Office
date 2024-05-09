const Post = require('../../model/Post/Post')
const Userinfo =require ('../../model/Userinfo/Userinfo')
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

// Get Post
exports.getpost = async (req, res, next) => {
    try {
        // ดึงวันที่ปัจจุบันในรูปแบบ 'DD/MM/YYYY'
        const today = new Date()

        // ค้นหาโพสต์ทั้งหมด
        const posts = await Post.find();

        // จัดรูปแบบวันที่ในแต่ละโพสต์
        const formattedPosts = posts.map(post => {
            return {
                ...post._doc,
                Update_date: moment(post.Update_date).format('DD/MM/YYYY HH:mm:ss'),
                post_date: moment(post.post_date).format('DD/MM/YYYY HH:mm:ss'),
                end_date: moment(post.end_date).format('DD/MM/YYYY'),
            };
        });

        // ตรวจสอบว่าวันสุดท้ายของโพสต์ใดโพสต์หนึ่งเป็นวันนี้หรือผ่านไปแล้วและอัปเดตสถานะให้ปิดรับสมัคร
        formattedPosts.forEach(post => {
            const postEndDate = moment(post.end_date, 'DD/MM/YYYY');
            
            // if (postEndDate.isSameOrBefore(today) && post.post_status === "เปิดรับสมัคร") {
            //     post.post_status = "ปิดรับสมัคร";
            // }
        });
        let new_data = []
        const data = await Post.find();
        for(const newData of data){
            const postEndDate = new Date(newData.end_date);
            // console.log("endDay",postEndDate)
            // console.log("today", today)
            if (postEndDate <= today && newData.post_status === "เปิดรับสมัคร") {
                let post_status = "ปิดรับสมัคร";
                const update = await Post.findOneAndUpdate(
                    {_id:newData._id},
                    {
                        post_status:post_status
                    },
                    {new:true})
                    if(!update){
                        return res
                                .status(404)
                                .send({status:false, message:"ไม่มีการอัพเดท"})
                    }
            }
        }
        const dataAgian = await Post.find();
            if(dataAgian.length == 0){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่พบข้อมูล"})
            }
        return res.json({
            message: 'ดึงข้อมูลโพสต์สำเร็จ!',
            status: true,
            data: dataAgian
        });
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'ไม่สามารถดึงข้อมูลโพสต์ได้',
            status: false,
            data: null
        });
    }
};

//Get Post By Id
exports.getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.json({
                message: 'Post not found',
                status: false,
                data: null
            });
        }
        const userinfodata = await Userinfo.findById(req.decoded.id);
        
        const check = await Post.findOne({ 'views.user_id': req.decoded.id });

        let status_user;
        if (userinfodata.status === 'New') {
            status_user = 'New';
        } else {
            status_user = 'Old';
        }

        const pushuserdata = {
            user_id : req.decoded.id,
            user_status : status_user
        }
        if(!check) {
            post.views.push(pushuserdata);
        }
        await post.save();
        return res.json({
            message: 'Get post by id successfully!',
            status: true,
            data: post
        });

    } catch (err) {
        console.log(err);
        return res.json({
            message: 'Cannot get post by id: ' + err.message,
            status: false,
            data: null
        });
    }
};

//Insert Post
exports.Insertpost = async (req, res, next) => {
    try {
        let upload = multer({ storage: storage }).array("image", 20);
        upload(req, res, async function (err) {
        const { 
            company, 
            header, 
            description, 
            department,
            amount,// จำนวนคนที่รับ
            start_age,// อายุที่รับเข้าทำงาน
            end_age,
            salary,
            sex,
            experience, // ประสบการณ์
            education, // ระดับการศึกษา
            feature, // คุณสมบัติ (เพิ่มได้หลายอัน)
            working, // ลักษณะงาน (เพิ่มได้หลายอัน)
            welfare, // สวัสดิการ (เพิ่มได้หลายอัน)
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
            company : company,
            header : header,
            description : description,
            department : department,
            amount : amount,
            age : { start_age, end_age },
            salary : salary,
            sex : sex, 
            experience : experience,
            education : education,
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

        if (Array.isArray(working) && working.length > 0) { //เมื่อไม่มีการส่งค่าของ Working มาจะไม่ทำขั้นตอนนี้
            working.forEach(item => {
                post.working.push({
                    working: item.working
                });
            });
        }

        if (Array.isArray(welfare) && welfare.length > 0) { //เมื่อไม่มีการส่งค่าของ Welfare มาจะไม่ทำขั้นตอนนี้
            welfare.forEach(item => {
                post.welfare.push({
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

// On / Off
exports.OnOff = async (req, res, next) => {
    try {
        const getdata = await Post.findById(req.params.id);
        if (!getdata) {
            return res.json({
                message: 'Error: Post not found',
                status: false,
                data: null
            });
        }
        if (getdata.Post_status === "เปิดรับสมัคร") {
            getdata.Post_status = "ปิดรับสมัคร";
        }
        else if (getdata.Post_status === "ปิดรับสมัคร") {
            getdata.Post_status = "เปิดรับสมัคร";
        }

        await getdata.save();
        console.log(getdata);
        return res.json({
            message: 'Update post successfully!',
            status: true,
            data: getdata
        });
    }
    catch (err) {
        console.log(err);
        return res.json({
            message: 'Can not Update post : ' + err.message,
            status: false,
            data: null
        });
    }
};
