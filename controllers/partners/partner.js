const {Partner} = require('../../model/partners/partners')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const axios = require('axios')
//เรียกใช้ function เช็คชื่อซ้ำ

//สร้างไอดี Partner
module.exports.register = async (req, res) => {
    try {
        console.log(req.body)
        const duplicate = await Partner.findOne({ //ตรวจสอบบัตรประชาชนพนักงานว่ามีซ้ำกันหรือไม่
            username: req.body.username,
          });
          if (duplicate){
            return res
                    .status(400)
                    .send({ status: false, message: "มีรายชื่อพนักงานภายในบริษัทแล้ว" });
          }
        const data = new Partner({
            _id: req.body._id,
            username: req.body.username, 
            password: req.body.password,
            antecedent:req.body.antecedent,
            partner_name: req.body.partner_name,
            partner_phone: req.body.partner_phone,
            partner_email:req.body.partner_email,
            partner_iden_number: req.body.partner_iden_number,
            partner_address: req.body.partner_address,
            partner_district: req.body.partner_district,
            partner_amphure: req.body.partner_amphure,
            partner_province: req.body.partner_province,
            partner_postcode: req.body.partner_postcode,
            // partner_company_name: req.body.partner_company_name,
            // partner_company_number: req.body.partner_company_name,
            // partner_company_address: req.body.partner_company_name,
            // partner_company_district: req.body.partner_company_name,
            // partner_company_amphure: req.body.partner_company_name,
            // partner_company_province: req.body.partner_company_name,
            // partner_company_postcode: req.body.partner_company_name,
            // partner_company_phone: req.body.partner_company_name,
        })
        const add = await data.save()
        res.status(200).send({status:true,message:"คุณได้สร้างไอดี Partner เรียบร้อย",data:add});
      } catch (error) {
        return res.status(500).send({status:false,error:error.message});
      }    
};

//login
module.exports.login = async (req,res) =>{
    try {

        if(req.body.username === undefined || req.body.username ==='')
        {
            return res.status(200).send({ status: false, message: "กรุณากรอก username" })
        }
        if(req.body.password === undefined || req.body.password ==='')
        {
            return res.status(200).send({ status: false, message: "กรุณากรอก password" })
        }

        const username = req.body.username
        const password = req.body.password
        
        //เช็คว่า user นี้มีในระบบไหม
        const login = await Partner.findOne({username:username})
        if(login)
        {
            //เช็ค password
            bcryptpassword = await bcrypt.compare(password,login.password)
            if(bcryptpassword)
            {
                //สร้าง signaturn
                const payload = {
                    _id:login._id,
                    username:login.username,
                    firstname:login.firstname,
                    lastname:login.lastname,
                    name:login.name,
                    position:login.position
                }
                const secretKey = process.env.SECRET_KEY
                const token = jwt.sign(payload,secretKey,{expiresIn:"10D"})
                return res.status(200).send({ status: true, data: payload, token: token})

            }else{
                return res.status(200).send({ status: false, message: "คุณกรอกรหัสไม่ถูกต้อง" })
            }
        }
        else{
            return res.status(200).send({ status: false, message: "ไม่มี user นี้ในระบบ" })
        }

       
    } catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
}
//getme
module.exports.me  =async (req,res)=>{
    try{
        const token = req.headers['token'];
        if(!token){
            return res.status(403).send({status:false,message:'Not authorized'});
        }
        const decodded =jwt.verify(token,process.env.JWTPRIVATEKEY)
        const dataResponse = {
            _id:decodded._id,
            username:decodded.username,
            firstname:decodded.firstname,
            lastname:decodded.lastname,
            nickname:decodded.nickname,
            position:decodded.position
        }  
        return res.status(200).send({status:true,data:dataResponse});
    } catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
}

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req,res) =>{
    try{    
        const partnerdata = await Partner.find()
        if(!partnerdata){
            return res.status(404).send({status:false,message:"ไม่มีข้อมูล"})
        }
        return res.status(200).send({status:true,data:partnerdata})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
}

//ดึงข้อมูล by id
module.exports.getbyid = async (req,res) =>{
    try{    
        const partnerdata = await Partner.findOne({_id:req.params.id})
        if(!partnerdata){
            return res.status(404).send({status:false,message:"ไม่มีข้อมูล"})
        }
        return res.status(200).send({status:true,data:partnerdata})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
}

//แก้ไขข้อมูล partner
module.exports.edit = async (req,res) =>{
    try{    
       
        const partner = await Partner.findOne({_id:req.params.id})
        if(!partner)
        {
            return res.status(404).send({status:false,message:"ไม่มีข้อมูล"})
        }
        const data = {
            username: req.body.username,
            password: req.body.password,
            antecedent: req.body.antecedent,
            partner_name: req.body.partner_name,
            partner_address: req.body.partner_address,
            partner_phone: req.body.partner_phone,
            partner_bookbank: "", 
            partner_bookbank_name: req.body.partner_bookbank_name,
            partner_bookbank_number: req.body.partner_bookbank_number,
            partner_iden: "", // images
            partner_iden_number: req.body.partner_iden_number,
            partner_company_name: req.body.partner_company_name,
            partner_company_number: req.body.partner_company_number,
            partner_company_address: req.body.partner_company_address
        }
        const edit = await Partner.findByIdAndUpdate(req.params.id,data,{new:true})
        return res.status(200).send({status:true,data:edit,message:"แก้ไขข้อมูลสำเร็จ"})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
}

//ลบข้อมูล partner
module.exports.delete = async (req,res) =>{
    try{    
        const partnerdata = await Partner.findOne({_id:req.params.id})
        if(!partnerdata){
            return res.status(200).send({status:false,message:"ไม่มีข้อมูล"})
        }
        const deletepartner = await Partner.findByIdAndDelete(req.params.id)
        return res.status(200).send({status:true,message:"ลบข้อมูลสำเร็จ",data:deletepartner})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }

}

module.exports.logo = async (req, res)=>{
    try{
        const id = req.params.id
        const upLogo = await Partner.findByIdAndUpdate(id,
            {
                logo: req.body.logo
            },{new:true})
        if(upLogo){
            return res
                    .status(200)
                    .send({status:true, data:upLogo})
        }else{
            return res
                    .status(400)
                    .send({status:false, message:"ค้นหาพาร์ทเนอร์ไม่เจอ"})
        }
    }catch(err){
        console.log(err)
        return res
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}

module.exports.iden = async (req, res)=>{
    try{
        const id = req.params.id
        const upIden = await Partner.findByIdAndUpdate(id,
            {
                partner_iden: req.body.partner_iden
            },{new:true})
        if(upIden){
            return res
                    .status(200)
                    .send({status:true, data:upIden})
        }else{
            return res
                    .status(400)
                    .send({status:false, message:"ค้นหาพาร์ทเนอร์ไม่เจอ"})
        }
    }catch(err){
        console.log(err)
        return res
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}

module.exports.fileCompany = async (req, res)=>{
    try{
        const id = req.params.id
        const upCompany = await Partner.findByIdAndUpdate(id,
            {
                filecompany: req.body.filecompany
            },{new:true})
        if(upCompany){
            return res
                    .status(200)
                    .send({status:true, data:upCompany})
        }else{
            return res
                    .status(400)
                    .send({status:false, message:"ค้นหาพาร์ทเนอร์ไม่เจอ"})
        }
    }catch(err){
        console.log(err)
        return res
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}

module.exports.approve = async (req, res)=>{
    try{
        const Url = process.env.URL_PARTNER
        const id = req.params.id
        const response = await axios.put(`${Url}/partner/accept/${id}`,{
              headers: {
                  'Accept': 'application/json',
              }
          })
        if(!response){
            return res
                    .status(400)
                    .send({status:false, message:"ไม่สามารถเชื่อมต่อได้"})
        }else{
            const fixData = await Partner.findByIdAndUpdate(id,{status_appover:"อนุมัติแล้ว"},{new:true})
            if(!fixData){
                return res
                        .status(400)
                        .send({status:false, message:"ไม่สามารถแก้ไขข้อมูลได้"})
            }
            return res
                    .status(200)
                    .send({status:true, message:"เชื่อมต่อสำเร็จ", data:response.data, fix:fixData})
        }
    }catch(err){
        console.log(err)
        return res
                .status(500)
                .send({status:false, message:err})
    }
}

module.exports.waitStatus = async (req, res)=>{
    try{
        const id = req.params.id
        const Data = {
            username: req.body.username, 
            password: req.body.password,
            antecedent:req.body.antecedent,
            partner_name: req.body.partner_name,
            partner_phone: req.body.partner_phone,
            partner_email:req.body.partner_email,
            partner_iden_number: req.body.partner_iden_number,
            partner_address: req.body.partner_address,
            partner_district: req.body.partner_district,
            partner_amphure: req.body.partner_amphure,
            partner_province: req.body.partner_province,
            partner_postcode: req.body.partner_postcode,
            partner_company_name: req.body.partner_company_name,
            partner_company_number: req.body.partner_company_number,
            partner_company_address: req.body.partner_company_address, 
            partner_company_district: req.body.partner_company_district, 
            partner_company_amphure: req.body.partner_company_amphure,
            partner_company_province: req.body.partner_company_province,
            partner_company_postcode: req.body.partner_company_postcode,
            partner_company_phone: req.body.partner_company_phone,
        }
        const fixData = await Partner.findByIdAndUpdate(id,Data,{new:true})
        if(!fixData){
            return res
                    .status(400)
                    .send({status:false, message:"ไม่สามารถแก้ไขข้อมูลได้"})
        }
            return res
                    .status(200)
                    .send({status:true, message:"เชื่อมต่อสำเร็จ", fix:fixData})
        
    }catch(err){
        console.log(err)
        return res
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}

module.exports.updateStatus = async (req, res)=>{
    try{
        const id = req.params.id
        const Data = {
            status_appover : "รออนุมัติ",
            // บริษัท
        }
        const fixData = await Partner.findByIdAndUpdate(id,Data,{new:true})
        if(!fixData){
            return res
                    .status(400)
                    .send({status:false, message:"ไม่สามารถแก้ไขข้อมูลได้"})
        }
            return res
                    .status(200)
                    .send({status:true, message:"เชื่อมต่อสำเร็จ", fix:fixData})
        
    }catch(err){
        console.log(err)
        return res
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}

//ลายเซ็น
module.exports.addsignature = async (req, res) => {
    try {
        const partner = await Partner.findById(req.params.id)
        if(!partner)
        {
              res.status(400).send({status:false,message:"ไม่มีข้อมูล"});
        }

        const edit = await Partner.findByIdAndUpdate(req.params.id,{signature:req.body.signature},{new:true})
        return res
                .status(200)
                .send({status: true,message: "คุณได้รูปภาพเรียบร้อยแล้ว",data: edit});
    } catch (error) {
        return res
                .status(500)
                .send({ status: false, error: error.message });
    }
}

//ยืนยัน OTP
module.exports.OTP = async (req, res)=>{
    try{
        const id = req.params.id
        const upOTP = await Partner.findByIdAndUpdate(id,
            {
                status_opt: "true"
            },{new:true})
        if(upOTP){
            return res
                    .status(200)
                    .send({status:true, data:upOTP})
        }else{
            return res
                    .status(400)
                    .send({status:false, message:"ค้นหาพาร์ทเนอร์ไม่เจอ"})
        }
    }catch(err){
        console.log(err)
        return res
                .status(500)
                .send({status:false, message:"มีบางอย่างผิดพลาด"})
    }
}

//ส่งประเภทสัญญา
module.exports.contract = async (req, res)=>{
    try{
        const id = req.params.id
        const contractName = req.body.contract_type
        // const Url = process.env.PARTNER
        const UrlContract = process.env.CONTRACT
        console.log(UrlContract)
        const findPartner = await Partner.findByIdAndUpdate(
            id,
            {contract_type: contractName},
            {new:true})
        if(!findPartner){
            return res
                    .status(400)
                    .send({status:false, message:"ไม่มีพาร์ทเนอร์ไอดีที่ท่านต้องการ"})
        }
        const updatedData = { 
            _id: findPartner._id,
            antecedent: findPartner.antecedent,
            partner_name: findPartner.partner_name,
            partner_phone: findPartner.partner_phone,
            partner_email: findPartner.partner_email,
            partner_iden_number: findPartner.partner_iden_number,
            partner_address: findPartner.partner_address,
            partner_district: findPartner.partner_district,
            partner_amphure: findPartner.partner_amphure,
            partner_province: findPartner.partner_province,
            partner_postcode: findPartner.partner_postcode,
            partner_company_name: findPartner.partner_company_name,
            partner_company_number: findPartner.partner_company_number,
            partner_company_address: findPartner.partner_company_address,
            partner_company_district: findPartner.partner_company_district,
            partner_company_amphure: findPartner.partner_company_amphure,
            partner_company_province: findPartner.partner_company_province,
            partner_company_postcode: findPartner.partner_company_postcode,
            partner_company_phone: findPartner.partner_company_phone,
            contract_type: findPartner.contract_type,
            filecompany: findPartner.filecompany,
            logo: findPartner.logo,
            signature: findPartner.signature
            };
              
        const response = await axios.post(`${UrlContract}/partner/create`,updatedData,{
            headers: {
                'Accept': 'application/json',
            }
        })
        return res
                .status(200)
                .send({status:true, data: updatedData})
    }catch(err){
        console.log("testy")
        console.log(err)
        return res
                .status(500)
                .send({status:false, message:err})
    }
}

module.exports.requestProduct = async(req, res)=>{
    try{
        const url_partner = process.env.URL_PARTNER
        const token = process.env.TOKEN_PARTNER
        const response = await axios.get(`${url_partner}/requestproduct/waitapprove`,{
            headers: {
                'Accept': 'application/json',
                'token': token
            }
        })
        return res
                .status(200)
                .send({status:true, data:response.data})
    }catch(err){
        return res
                .status(500)
                .send({status:false, message:err})
    }
}

module.exports.approveproduct = async(req, res)=>{
    try {
        const url_partner = process.env.URL_PARTNER;
        const token = process.env.TOKEN_PARTNER;
        const user_id = req.decoded.id;
        const fullname = req.decoded.first_name
        const id = req.params.id;
        
        const response = await axios.put(`${url_partner}/requestproduct/approve/${id}`,
            {
              office_id: user_id,
              office_name: fullname
            } ,{
                headers: {
                  'token': token
                }
              }
            
          ).catch(err=>{ return err.message});
          if(response.status == 200)
          {
            return res.json({
                message: 'Approve Product successfully!',
                status: true,
                data: response.data
            });
          }else{
            console.log(response)
          }
       
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Can not Approve Product : ' + err.message,
            status: 500,
            data: null
        });
    }
};

module.exports.unapproveproduct = async(req, res)=>{
    try {
        const url_partner = process.env.URL_PARTNER;
        const token = process.env.TOKEN_PARTNER;
        const user_id = req.decoded.id;
        const fullname = req.decoded.first_name
        const id = req.params.id;
        
        const response = await axios.put(`${url_partner}/requestproduct/disapprove/${id}`,
            {
              office_id: user_id,
              office_name: fullname
            } ,{
                headers: {
                  'token': token
                }
              }
            
          ).catch(err=>{ return err.message});
          if(response.status == 200)
          {
            return res.json({
                message: 'Approve Product successfully!',
                status: true,
                data: response.data
            });
          }else{
            console.log(response)
          }
       
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Can not Approve Product' + err.message,
            status: 500,
            data: null
        });
    }
};

module.exports.Editproduct = async(req, res)=>{
    try {
        const url_partner = process.env.URL_PARTNER;
        const token = process.env.TOKEN_PARTNER;
        const id = req.params.id;
        
        const response = await axios.put(`${url_partner}/requestproduct/editproductbyoffice/${id}`,
            req.body,
            {
                headers: {
                  'token': token
                }
              }
            
          ).catch(err=>{ return err.message});
          if(response.status == 200)
          {
            return res.json({
                message: 'Request Edit Product successfully!',
                status: true,
                data: response.data
            });
          }else{
            console.log(response)
          }
       
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Can not Request Edit Product' + err.message,
            status: 500,
            data: null
        });
    }
};

module.exports.requestShop = async(req, res)=>{
    try{
        const url_partner = process.env.URL_PARTNER
        const token = process.env.TOKEN_PARTNER
        const response = await axios.get(`${url_partner}/requestshop/waitapprove`,{
            headers: {
                'token': token
            }
        })
        return res
                .status(200)
                .send({status:true, data:response.data})
    }catch(err){
        return res
                .status(500)
                .send({status:false, message:err})
    }
}

module.exports.GetAllShop = async(req, res)=>{
    try{
        const url_partner = process.env.URL_PARTNER
        const token = process.env.TOKEN_PARTNER
        const response = await axios.get(`${url_partner}/requestshop/getall`,{
            headers: {
                'token': token
            }
        })
        return res
                .status(200)
                .send({status:true, data:response.data})
    }catch(err){
        return res
                .status(500)
                .send({status:false, message:err})
    }
}

module.exports.ApproveRequestShop = async(req, res)=>{
    try {
        const url_partner = process.env.URL_PARTNER;
        const token = process.env.TOKEN_PARTNER;
        const user_id = req.decoded.id;
        const fullname = req.decoded.first_name
        const id = req.params.id;
        
        const response = await axios.put(`${url_partner}/requestshop/approve/${id}`,
            {
              office_id: user_id,
              office_name: fullname
            } ,{
                headers: {
                  'token': token
                }
              }
          ).catch(err=>{ return err.message});
          if(response.status == 200)
          {
            return res.json({
                message: 'Approve Request Shop successfully!',
                status: true,
                data: response.data
            });
          }else{
            console.log(response)
          }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Can not Approve Request Shop : ' + err.message,
            status: 500,
            data: null
        });
    }
};

module.exports.UnApproveRequestShop = async(req, res)=>{
    try {
        const url_partner = process.env.URL_PARTNER;
        const token = process.env.TOKEN_PARTNER;
        const user_id = req.decoded.id;
        const fullname = req.decoded.first_name
        const id = req.params.id;
        
        const response = await axios.put(`${url_partner}/requestshop/disapprove/${id}`,
            {
              office_id: user_id,
              office_name: fullname
            } ,{
                headers: {
                  'token': token
                }
              }
          ).catch(err=>{ return err.message});
          if(response.status == 200)
          {
            return res.json({
                message: 'Approve Request Shop successfully!',
                status: true,
                data: response.data
            });
          }else{
            console.log(response)
          }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Can not Approve Request Shop : ' + err.message,
            status: 500,
            data: null
        });
    }
};