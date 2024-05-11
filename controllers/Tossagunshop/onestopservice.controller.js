const axios = require('axios');

//one stop service
//ดึงข้อมูล one stop service ทั้งหมด
exports.getOneStopService = async(req, res) => {
    try{
        const Url = process.env.URL_TOSSAGUN;
       
        const response = await axios.get(`${Url}/partner/shop/`, {
            headers: {
                'Accept': 'application/json',
            }
        });
        if (!response.data) {
            return res
                .status(400)
                .send({ status: false, message: "ไม่สามารถเชื่อมต่อได้" });
        }
        let data = response.data.data;
        if (data.length > 0) {
            data = data.filter((item) => item.shop_type === "One Stop Service");
        }
        return res.status(200).send({ status: true, data: data });

    }catch(err){
        return res.status(500).json({message: err.message,status: false})
    }
};
//ดึงข้อมูล one stop service ตาม id
exports.getOneStopServiceById = async(req, res) => {
    try{
        const Url = process.env.URL_TOSSAGUN;
        const id = req.params.id;
        const response = await axios.get(`${Url}/partner/shop/${id}`, {
            headers: {
                'Accept': 'application/json',
            }
        });
        if (!response.data) {
            return res
                .status(400)
                .send({ status: false, message: "ไม่สามารถเชื่อมต่อได้" });
        }
        return res.status(200).send({ status: true, data: response.data.data });

    }catch(err){
        return res.status(500).json({message: err.message,status: false})
    }
};

//แก้ไขข้อมูล one stop service ตาม id
exports.updateOneStopService = async(req, res) => {
    try{
        const Url = process.env.URL_TOSSAGUN;
        const id = req.params.id;
        const response = await axios.put(`${Url}/partner/shop/shop/${id}`, req.body, {
            headers: {
                'Accept': 'application/json',
            }
        });
        if (!response.data) {
            return res
                .status(400)
                .send({ status: false, message: "ไม่สามารถเชื่อมต่อได้" });
        }
        return res.status(200).send({ status: true, message: "แก้ไขสำเร็จ"});

    }catch(err){
        return res.status(500).json({message: err.message,status: false})
    }
};

// อนุมัติ one stop service
exports.approveOneStopService = async(req, res) => {
    try{
        const Url = process.env.URL_TOSSAGUN;
        const id = req.params.id;
        const data ={
            shop_status:true
        }
        const response = await axios.put(`${Url}/partner/shop/shop/${id}`, data, {
            headers: {
                'Accept': 'application/json',
            }
        });
        if (!response.data) {
            return res
                .status(400)
                .send({ status: false, message: "ไม่สามารถเชื่อมต่อได้" });
        }
        
        return res.status(200).send({ status: true, message: "อนุมัติสำเร็จ"});

    }catch(err){
        return res.status(500).json({message: err.message,status: false})
    }
};


//พนักงาน
//ดึงข้อมูลพนักงาน by shop id
exports.getEmployeeByShopId = async(req, res) => {
    try{
        const Url = process.env.URL_TOSSAGUN;
        const id = req.params.shopid;
        const response = await axios.get(`${Url}/partner/shop/employee/${id}`, {
            headers: {
                'Accept': 'application/json',
            }
        });
        if (!response.data) {
            return res
                .status(400)
                .send({ status: false, message: "ไม่สามารถเชื่อมต่อได้" });
        }
        return res.status(200).send({ status: true, data: response.data.data });

    }catch(err){
        return res.status(500).json({message: err.message,status: false})
    }
};

