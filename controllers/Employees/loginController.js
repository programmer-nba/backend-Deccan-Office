const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { Employees } = require("../../model/employee/employee");

const loginController = async (req, res) => {
  try {
    const UserID = req.body.userid;
    const Password = req.body.password;

    console.log("🔍 Received UserID:", UserID);
    console.log("🔍 Received Password:", Password);

    const employee = await Employees.findOne({
      $or: [{ userid: UserID }, { iden_number: UserID }],
    });

    if (!employee) {
      console.log("❌ No Matching Account Found");
      return res.status(400).send({ status: false, message: "ไม่มีบัญชีที่ท่านใช้" });
    }

    console.log("✅ Found Employee:", employee);

    // 🔐 เปรียบเทียบรหัสผ่านโดยใช้ bcrypt
    const isPasswordValid = await bcrypt.compare(Password, employee.password);
    if (!isPasswordValid) {
      console.log("❌ Password Mismatch");
      return res.status(400).send({ status: false, message: "รหัสผิดพลาด" });
    }

    console.log("✅ Password Matched!");
    
    const secretKey = process.env.JWTPRIVATEKEY;
    const payload = {
      id: employee._id,
      user_id: employee.userid,
      role: employee.role,
      position: employee.position,
      firstname: employee.first_name,
      lastname: employee.last_name,
    };
    const token = jwt.sign(payload, secretKey, { expiresIn: "7D" }); // ลดอายุ Token

    return res.status(200).send({
      status: true,
      message: "เข้าสู่ระบบสำเร็จ",
      token: token,
      id: employee._id,
      user_id: employee.userid,
      role: employee.role,
      position: employee.position,
      firstname: employee.first_name,
      lastname: employee.last_name,
    });

  } catch (err) {
    console.log("❌ Error:", err);
    return res.status(500).send({ message: "มีบางอย่างผิดพลาด" });
  }
};

module.exports = { loginController };

