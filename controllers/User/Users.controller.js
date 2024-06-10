const User = require('../../model/User/User.js');
const Userinfo = require('../../model/Userinfo/Userinfo.js')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const multer = require('multer');

const saltRounds = 10;

// Get User (ทำงานได้สมบูรณ์ไม่ต้องแก้ไข)
exports.getUser = async (req, res, next) => {
    try {
        const users = await User.find();
        return res.json({
            message: 'Get user data successfully!',
            status: true,
            data: users
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Failed to get user data',
            status: false,
            error: err.message
        });
    }
}

// Get User By Id (ทำงานได้สมบูรณ์ไม่ต้องแก้ไข)
exports.getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.json({
                message: 'User not found',
                status: false,
                data: null
            });
        }
        return res.json({
            message: 'Get user by id successfully!',
            status: true,
            data: user
        });
    } catch (err) {
        console.error(err);
        return res.json({
            message: 'Failed to get user by id: ' + err.message,
            status: false,
            data: null
        });
    }
}

// Insert User
exports.CreateRegister = async (req, res) => {
    try {
        const { citizen_id, user_password, name, gender, birth, tel, status, role } = req.body;

        // Check if the citizen ID or user email already exists in the database
        const existingUser = await User.findOne({ $or: [{ citizen_id }] });
        if (existingUser) {
            return res.status(400).json({ status: false, message: 'Citizen ID or user email already exists' });
        }

        // Hash the user password
        const hashedPassword = await bcrypt.hash(user_password, saltRounds);

        // Create the user
        const newUser = await User.create({
            citizen_id,
            user_password: hashedPassword,
            name,
            gender,
            birth,
            tel,
            status,
            role

        });

        return res.status(201).json({ status: true, message: 'User created successfully', data: newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Failed to create user', error: error.message });
    }
};

// Update User
exports.UpdateUser = async (req, res, next) => {
    // Extract fields from request body
    const {
        citizen_id,
        user_password,
        name,
        gender,
        birth,
        tel,
        status,
        role

    } = req.body;

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                status: false,
                data: null
            });
        }

        // Hash and update password if provided
        if (user_password) {
            const hashedPassword = await bcrypt.hash(user_password, saltRounds);
            user.user_password = hashedPassword;
        }

        // Update citizen ID if provided
        if (citizen_id) {
            user.citizen_id = citizen_id;
        }

        // Update other fields if provided
        user.name = name || user.name;
        user.gender = gender || user.gender;
        user.birth = birth || user.birth;
        user.tel = tel || user.tel;
        user.status = status || user.status;
        user.role = role || user.role;

        // Save updated user data
        await user.save();

        return res.json({
            message: 'Update successful!',
            status: true,
            data: user
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Update failed: ' + err.message,
            status: false,
            data: null
        });
    }
}

// Delete User (ทำงานได้สมบูรณ์ไม่ต้องแก้ไข)
exports.DeleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.json({
                message: 'User not found',
                status: false,
                data: null
            });
        }
        await User.deleteOne({ _id: user._id });
        return res.json({
            message: 'Delete successful!',
            status: true,
            data: user
        });
    } catch (err) {
        console.error(err);
        return res.json({
            message: 'Delete failed: ' + err.message,
            status: false,
            data: null
        });
    }
}

// Login User
exports.LoginUser = async (req, res, next) => {
    const { citizen_id, user_password } = req.body; // เพิ่ม tel เข้ามาในการรับข้อมูล
    try {
        // ค้นหาผู้ใช้โดยใช้ citizen_id หรือ tel
        const user = await User.findOne({ citizen_id: citizen_id });
        if (!user) {
            return res.json({
                message: 'User not found',
                status: false,
                data: null
            })
        }

        // ตรวจสอบรหัสผ่าน
        const validPassword = await bcrypt.compare(user_password, user.user_password);
        if (!validPassword) {
            return res.json({
                message: 'Invalid password',
                status: false,
                data: null
            });
        }

        // หากเข้าสู่ระบบสำเร็จ ให้ดึงข้อมูลจาก userinfo
        const userInfo = await Userinfo.findOne({ citizen_id: user.citizen_id }); // ใช้ citizen_id ของผู้ใช้จาก User model ในการค้นหาใน Userinfo model

        if (!userInfo) {
            return res.json({
                message: 'Userinfo not found',
                status: false,
                data: null
            });
        }

        // สร้าง payload สำหรับ JWT
        const payload = {
            id: user._id,
            citizen_id: user.citizen_id,
            email: user.email,
            role: user.role, // เพิ่ม role เข้าไปใน payload
            position: userInfo.position
        };

        const secretKey = "loginload";
        const token = jwt.sign(payload, secretKey, { expiresIn: "10d" });

        return res.json({
            message: 'Login successful!',
            status: true,
            data: userInfo, // ส่งข้อมูลจาก userinfo กลับไป
            token: token,
            payload: payload
        });
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'Login failed : ' + err.message,
            status: false,
            data: null
        });
    }
};


// Get logged-in user details
exports.getme = async (req, res) => {
    try {
        const idd = req.body.add
        console.log(idd)
        const id = req.decoded.id
        const user = await User.findById(id);
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
