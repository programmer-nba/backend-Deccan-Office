const Userinfo = require('../../model/Userinfo/Userinfo.js');
const User = require('../../model/User/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

// const upload = multer();

const {
    uploadFileCreate,
    deleteFile,
    } = require("../../uploadfilecreate.js");

const storage = multer.diskStorage({
        filename: function (req, file, cb) {
          cb(null, Date.now() + "-" + file.originalname);
          //console.log(file.originalname);
        },
});

const upload = multer({ storage: storage }).single('image'); // กำหนดให้อัปโหลดไฟล์เพียงหนึ่งไฟล์

// ตัวอย่างโค้ดที่ส่ง response หลายครั้ง เพิ่ม try-catch block ในฟังก์ชัน getUser
exports.getUser = async (req, res, next) => {
    try {
        // ใช้ .populate() เพื่อเติมข้อมูลจาก User ลงใน Userinfo
        const users = await Userinfo.find().populate('user');
        // ส่ง response ครั้งที่ 1
        return res.json({
            message: 'Get user data successfully!',
            status: true,
            data: users
        });
    } catch (err) {
        console.error('Error getting user data:', err);
        return res.status(500).json({
            message: 'Failed to get user data',
            status: false,
            error: err.message
        });
    }
};

// ดึงข้อมูลผู้ใช้ด้วยไอดี
exports.getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id; // รับ _id จาก URL parameters
        if (!userId) {
            return res.status(400).json({
                message: 'ไม่มี _id ที่ถูกส่งมา',
                status: false,
                data: null
            });
        }

        // ใช้ .populate() เพื่อเติมข้อมูลจาก User ลงใน Userinfo
        const user = await Userinfo.findById(userId).populate('user');

        if (!user) {
            return res.status(404).json({
                message: 'ไม่พบข้อมูล user ที่ต้องการ',
                status: false,
                data: null
            });
        }

        return res.status(200).json({
            message: 'ดึงข้อมูล user สำเร็จ!',
            status: true,
            data: user
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err.message,
            status: false,
            data: null
        });
    }
}

//Insert user
exports.Insertimage = async (req, res, next) => {
    try {
        let upload = multer({ storage: storage }).array("image", 20);
        upload(req, res, async function (err) {
            const { citizen_id, 
                user_password,
                name,
                lastname, 
                email, 
                gender, 
                birth, 
                tel, 
                country, 
                religion, 
                height, 
                weight, 
                marry, 
                soldier, 
                address, 
                province, 
                postal_code, 
                line_id, 
                job_title, 
                desired_salary
            } = req.body;
            const reqFiles = [];
            const result = [];
            if (err) {
                return res.status(500).send(err);
            }
            let image = ''; // ตั้งตัวแปรรูป
            //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
          
            if (req.files) {
                const url = req.protocol + "://" + req.get("host");
                for (var i = 0; i < req.files.length; i++) {
                    const src = await uploadFileCreate(req.files, res, { i, reqFiles });
                    result.push(src);
                    //   reqFiles.push(url + "/public/" + req.files[i].filename);
                }
                image = reqFiles[0];
            }
            
            // สร้าง User ในส่วนของลงทะเบียน
            const newUser = new User({
                citizen_id: citizen_id,
                user_password : bcrypt.hashSync( req.body.user_password, 10), // แปลงรหัสผ่านเป็นแบบเข้ารหัส
            });
     
            // บันทึก User ลงในฐานข้อมูล
            const savedUser = await newUser.save();
            
            // ตรวจสอบว่า User ถูกบันทึกเรียบร้อยหรือไม่
            if (!savedUser) {
                return res.json({
                    message: 'can not save user',
                    status: false,
                    data: null
                });
            }
            
            // สร้าง Userinfo
            const userinfo = new Userinfo({
                _id : savedUser._id,
                citizen_id : citizen_id,
                user_password : user_password,
                name : name,
                lastname : lastname,
                email : email,
                gender : gender,
                birth : birth,
                tel : tel,
                country: country,
                religion: religion,
                height: height,
                weight: weight,
                marry: marry,
                soldier: soldier,
                address: address,
                province: province,
                postal_code: postal_code,
                line_id: line_id,
                job_title: job_title,
                desired_salary: desired_salary,
                image: image,
                user: savedUser._id // เพิ่ม user ที่เชื่อมโยงกับ User ที่ถูกสร้าง
            });
     
            // บันทึก Userinfo ลงในฐานข้อมูล
            const savedInfo = await userinfo.save();
            
            if (!savedInfo) {
                return res.json({
                    message: 'can not save user',
                    status: false,
                    data: null
                });
            }
            
            return res.json({
                message: 'Insert user successfully!',
                status: true,
                data: savedUser, // ส่งข้อมูล User ที่ถูกบันทึกไป
                userinfo: savedInfo // ส่งข้อมูล Userinfo ที่ถูกบันทึกไป
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

// อัปเดตข้อมูลส่วนตัวของผู้ใช้
exports.updateUserinfo = async (req, res, next) => {
    try {
        // อัปโหลดรูปภาพโดยใช้ multer
        await new Promise((resolve, reject) => {
            upload(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    // เกิดข้อผิดพลาดจาก multer
                    return reject(res.status(500).json({
                        message: 'Multer error occurred',
                        status: false,
                        error: err.message
                    }));
                } else if (err) {
                    // เกิดข้อผิดพลาดอื่น ๆ
                    return reject(res.status(500).json({
                        message: 'Error occurred during file upload',
                        status: false,
                        error: err.message
                    }));
                }
                resolve();
            });
        });

        const userinfoId = req.params.id; // รหัส ID ของข้อมูลส่วนตัวของผู้ใช้ที่ต้องการอัปเดต
        console.log(userinfoId)
        let userinfoData = req.body; // ข้อมูลใหม่ที่จะใช้ในการอัปเดต
        if (!userinfoId) {
            return res.status(404).json({
                message : "User not found",
                status : false
            })
        }

        // ตรวจสอบว่ามีการอัปโหลดไฟล์รูปภาพหรือไม่
        if (req.file) {
            // ถ้ามี กำหนดชื่อรูปภาพใหม่ในข้อมูลผู้ใช้
            userinfoData.image = req.file.filename;
        }

        // เพิ่ม user_password ในข้อมูลผู้ใช้
        if (req.body.user_password) {
            userinfoData.user_password = req.body.user_password;
        }

        // อัปเดตข้อมูลส่วนตัวของผู้ใช้
        const updatedUserinfo = await Userinfo.findByIdAndUpdate(userinfoId, userinfoData, { new: true });

        if (!updatedUserinfo) {
            return res.status(404).json({
                message: 'User information not found',
                status: false,
                data: null
            });
        }

        return res.status(200).json({
            message: 'User information updated successfully!',
            status: true,
            data: updatedUserinfo // ข้อมูลผู้ใช้ที่ถูกอัปเดต
        });
    } catch (error) {
        console.error('Error updating user information:', error);
        return res.status(500).json({
            message: ('Failed to update user information: ' + error.message),
            status: false,
        });
    }
};

// ลบข้อมูลส่วนตัวของผู้ใช้
exports.deleteUserinfo = async (req, res, next) => {
    try {
        const userinfoId = req.params.id; // รหัส ID ของข้อมูลส่วนตัวของผู้ใช้ที่ต้องการลบ

        // ลบข้อมูล Userinfo
        const deletedUserinfo = await Userinfo.findByIdAndDelete(userinfoId); 

        if (!deletedUserinfo) {
            return res.status(404).json({
                message: 'User information not found',
                status: false,
                data: null
            });
        }

        // ลบข้อมูล User โดยใช้ citizen_id ของ Userinfo ที่ถูกลบ
        const deletedUser = await User.findOneAndDelete({ citizen_id: deletedUserinfo.citizen_id });

        if (!deletedUser) {
            return res.status(404).json({
                message: 'User not found',
                status: false,
                data: null
            });
        }

        return res.status(200).json({
            message: 'User information and associated User deleted successfully!',
            status: true,
            data: {
                userinfo: deletedUserinfo, // ข้อมูลของ Userinfo ที่ถูกลบ
                user: deletedUser // ข้อมูลของ User ที่ถูกลบ
            }
        });
    } catch (error) {
        console.error('Error deleting user information:', error);
        return res.status(500).json({
            message: ('Failed to delete user information: ' + error.message),
            status: false,
        });
    }
};

// Get logged-in user details
exports.getme = async (req, res) => {
    try {
        const id = req.headers['token'];
        const secretKey = "loginload";
        const decoded = jwt.verify(id, secretKey);
        console.log(decoded)
        const user = await Userinfo.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                status: false,
                data: null
            });
        }
        return res.json({
            message: 'Logged-in user details retrieved successfully!',
            status: true,
            data: user
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Failed to get logged-in user details: ' + err.message,
            status: false,
            data: null
        });
    }
};
