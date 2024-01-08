const {Employees, validate} = require("../model/employee/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.regiter = async (req, res) => {
  try {
    const {error} = validate(req.body);
    if (error)
      return res
        .status(403)
        .send({status: false, message: error.details[0].message});

    const checkiden = await Employees.findOne({
      iden_number: req.body.iden_number,
    });
    if (checkiden)
      return res
        .status(401)
        .send({status: false, message: "มีรายชื่อพนักงานภายในบริษัทแล้ว"});

    const count = Employees.length;
    let data = null;
    const employee_number = `DDSC000${count}`;
    const encrytedPassword = await bcrypt.hash(req.body.password, 10);
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: "มีบางอย่างผิดพลาด"});
  }
};
