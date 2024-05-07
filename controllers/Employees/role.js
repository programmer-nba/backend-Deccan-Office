const { roleEmployee } = require("../../model/employee/role");

create = async(req, res)=>{
    try{
        const create = await roleEmployee.create(req.body)
            if(!create){
                return res
                        .status(400)
                        .send({status:false, message:"ไม่สามารถสร้างตำแหน่งได้"})
            }
        return res
                .status(200)
                .send({status:true, data:create})
    }catch(err){
        return res
                .status(500)
                .send({status:false, message:err})
    }
}

getall = async (req, res, next) => {
    try {
        const data = await roleEmployee.find();
        return res.json({
            message: 'Get data successfully!',
            status: true,
            data: data
        });
    } catch (err) {
        console.log(err)
        return res.json({
            message: ('Can not get data', err.message),
            status: false,
            data: null
        })
    }
}

module.exports = { create , getall}