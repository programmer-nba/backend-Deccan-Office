const { roleEmployee } = require("../../model/employee/role");
const { Employees } = require("../../model/employee/employee");

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

updateRole = async(req, res)=>{
    const { id } = req.params
    const {
        role,
        thai_role,
        position,
        thai_position,
        Abbreviation,
        number_role,
    } = req.body
    try{
        let thisRole = await roleEmployee.findById(id)
        if (!thisRole) return res.status(404).json({status:false, message:"not found"})

        thisRole.role = role || thisRole.role
        thisRole.thai_role = thai_role || thisRole.thai_role
        thisRole.position = position || thisRole.position
        thisRole.thai_position = thai_position || thisRole.thai_position
        thisRole.Abbreviation = Abbreviation || thisRole.Abbreviation
        thisRole.number_role = number_role || thisRole.number_role 

        const saved_role = await thisRole.save()
        if (!saved_role) return res.status(500).json({ message: 'can not save data' })
        
        return res
                .status(200)
                .send({status:true, message: "update success", data:role})
    }catch(err){
        return res
                .status(500)
                .send({status:false, message:err})
    }
}

deleteRole = async (req, res) => {
    const { id } = req.params
    
    try{
        let thisRole = await roleEmployee.findById(id)
        if (!thisRole) return res.status(404).json({status:false, message:"not found"})

        const employees = await Employees.find( { role_id: thisRole._id } )
        if (employees.length) {
            await Employees.deleteMany( { role_id: thisRole._id } )
        }

        await roleEmployee.findByIdAndDelete(id)
        
        return res
                .status(200)
                .send({status:true, message: "delete success"})
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


getPosition = async (req, res) => {
    try {
        const role = req.body.role
        const data = await roleEmployee.find({role: role},{position:1, thai_position:1, number_role:1}).exec();
            if(data.length == 0){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่มีข้อมูลของ role"})
            }
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

module.exports = { create , getall, updateRole, deleteRole, getPosition}