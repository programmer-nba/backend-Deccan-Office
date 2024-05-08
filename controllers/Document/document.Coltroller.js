const Document = require('../../model/document/Document')
// const {timeInOut} = require ('../../model/employee/timeInOutEmployee')
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { roleEmployee } = require('../../model/employee/role');
const { required } = require('joi');
const { timeInOut } = require('../../model/employee/timeInOutEmployee');
const multer = require('multer');
const upload = multer();

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

dayjs.extend(utc);
dayjs.extend(timezone);

dayjsTimestamp = dayjs().tz('Asia/Bangkok');
dayTime = dayjsTimestamp.format('YYYY-MM-DD HH:mm:ss');

//Get Document
exports.getdocument = async (req, res, next) => {
    try {
        const document = await Document.find();
        return res.json({
            message: 'Get document successfully!',
            status: true,
            data: document
        });
    } catch (err) {
        console.log(err)
        return res.json({
            message: ('Can not get document data', err.message),
            status: false,
            data: null
        })
    }
}

//Get Document By Id
exports.getdocumentById = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id);
        return res.json({
            message: 'Get document by id successfully!',
            status : true,
            data : document
        })
    }
    catch (err){
        console.log(err)
        return res.json({
            message: 'Can not get document by id : '+ err.message,
            status: false,
            data : null
        })
    }
};

// Get Document By Requester
exports.getdocumentByRequester = async (req, res, next) => {
    try {
        const documents = await Document.find({ 'Employee.employee_id': req.params.employee_id });
        return res.json({
            message: 'Get documents by employee_id successfully!',
            status: true,
            data: documents
        });
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'Can not get documents by employee_id: ' + err.message,
            status: false,
            data: null
        });
    }
};//ใช้งานได้

// Get Document By Me
exports.getdocumentByMe = async (req, res, next) => {
    try {
        const user_id = req.decoded.id
        const documents = await Document.find({ 'status_detail.0.employee_id': user_id });
        return res.json({
            message: 'Get documents by Me successfully!',
            status: true,
            data: documents
        });
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'Can not get documents by Me : ' + err.message,
            status: false,
            data: null
        });
    }
};//ใช้งานได้

//ดึงเอกสารที่เคยอนุมัติ
exports.getDocumentApproveByMe = async (req, res, next) => {
    try {
        const user_id = req.decoded.id
        const documents = await Document.find({
            'status_detail': {
                $elemMatch : {
                    "employee_id" : user_id
                }
            } 
        });
        return res.json({
            message: 'ดึงเอกสารที่เคยอนุมัติ สำเร็จ !!',
            status: true,
            data: documents
        });
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'Can not get documents by Me : ' + err.message,
            status: false,
            data: null
        });
    }
};

// Get Document By Status
exports.getdocumentByStatus = async (req, res, next) => {
    try {
        const documents = await Document.find({ Status_document: req.params.Status_document });
        return res.json({
            message: 'Get documents by Status successfully!',
            status: true,
            data: documents
        });
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'Can not get documents by Status: ' + err.message,
            status: false,
            data: null
        });
    }
};//ใช้งานได้

//Insert Document   
exports.InsertDocument = async (req, res, next) => {
    try {
        let upload = multer({ storage: storage }).array("image", 20);
        upload(req, res, async function (err){
            if (req.body.type != "OT" && req.body.type != "Normal") {
                return res.json({
                    message: 'it not OT or Normal',
                    status: false,
                    data: null
                })
            }
            if(req.body.document_true != "ฉบับจริง" && req.body.document_true != "ฉบับร่าง"){
                return res.json({
                    message: 'กรุณาใส่ ฉบับจริง หรือ ฉบับร่าง ที่ document_true',
                    status: false,
                    data: null
                });
            }
            if(req.body.document_true === "ฉบับร่าง") {
                if (req.body.type === "Normal") {
                    if (req.body.ot) {
                        return res.json({
                            message: 'ไม่สามารถเพิ่ม OT หาก Type เป็น Normal',
                            status: false,
                            data: null
                        });
                    }
                }

                const { headers, type, to, document_true} = req.body;
                const employee_id = req.decoded.id

                const reqFiles = [];
                const result = [];
                if (err) {
                    return res.status(500).send(err);
                }
                let image = ''
                if (req.files) {
                    const url = req.protocol + "://" + req.get("host");
                    for (var i = 0; i < req.files.length; i++) {
                        const src = await uploadFileCreate(req.files, res, { i, reqFiles });
                        result.push(src);
                        //   reqFiles.push(url + "/public/" + req.files[i].filename);
                    }
                    
                    image =reqFiles.map(item=>{
                        return {
                            file_doc:item
                        }
                    });
               
                }
                
                const document = new Document({
                    headers : headers,
                    type : type,
                    to : to,
                    detail : req.body.detail,
                    document_true : document_true,
                    file : image,
                    status_detail: [{
                        employee_id: employee_id,
                    }]
                });

                if (req.body.type === "OT") {
                    if (!req.body.ot || !req.body.ot.timein || !req.body.ot.timeout) {
                        return res.json({
                            message: 'คุณจำเป็นต้องกรอก เวลา ขอทำ OT',
                            status: false,
                            data: null
                        });
                    }

                    const timein = dayjs(req.body.ot.timein);
                    const timeout = dayjs(req.body.ot.timeout);
                    const totalHours = timeout.diff(timein, 'hour');
                    const totalMinutes = timeout.diff(timein, 'minute') % 60;
                    const totalSeconds = timeout.diff(timein, 'second') % 60;
                    const totalOTInSeconds = totalHours * 3600 + totalMinutes * 60 + totalSeconds;

                    document.ot = {
                        timein: timein,
                        timeout: timeout,
                        total_ot: {
                            totaltime: (totalHours + " ชั่วโมง " + totalMinutes + " นาที " + totalSeconds + " วินาที"),
                            totalseconds: totalOTInSeconds
                        }
                    };
                }

                const saved_document = await document.save();
                if (!saved_document) {
                    return res.json({
                        message: 'ไม่สามารถเพิ่มฉบับร่างได้',
                        status: false,
                        data: null
                    });
                }
                return res.json({
                    message: 'เพิ่มฉบับร่างสำเร็จ',
                    status: true,
                    data: saved_document,
                });
            }

            const latestDoc = await Document.findOne({document_true : "ฉบับจริง"}).sort({ document_id: -1 }).limit(1);
            const employee_id = req.decoded.id
            const role = req.decoded.role
            const position = req.decoded.position

            if (req.body.type === "Normal") {
                if (req.body.ot) {
                    return res.json({
                        message: 'ไม่สามารถเพิ่ม OT หาก Type เป็น Normal',
                        status: false,
                        data: null
                    });
                }
            }

            let docid = 1; // ค่าเริ่มต้นสำหรับ docid
            if (latestDoc) {
                docid = parseInt(latestDoc.document_id.slice(2)) + 1; // เพิ่มค่า docid
            }

            const docidString = docid.toString().padStart(5, '0');
            const { doc_date, headers, type, to, document_true } = req.body;
            const reqFiles = [];
                const result = [];
                if (err) {
                    return res.status(500).send(err);
                }
                let image = ''
                if (req.files) {
                    const url = req.protocol + "://" + req.get("host");
                    for (var i = 0; i < req.files.length; i++) {
                        const src = await uploadFileCreate(req.files, res, { i, reqFiles });
                        result.push(src);
                        //   reqFiles.push(url + "/public/" + req.files[i].filename);
                    }
                    image =reqFiles.map(item=>{
                        return {
                            file_doc:item
                        }
                    });
                }

            let status = "รอหัวหน้าแผนกอนุมัติ"
                if(role == 'head_department'){
                    status = 'รอผู้จัดการอนุมัติ'
                }else if (role == 'manager'){
                    status = 'รอผู้บริหารอนุมัติ'
                }

            const document = new Document({
                document_id: docidString,
                doc_date: doc_date,
                headers: headers,
                type : type,
                to: to,
                detail: req.body.detail,
                document_true : document_true,
                file : image,
                status_document: status,
                status_detail: [{
                    employee_id: employee_id,
                    role: role,
                    position: position,
                    date: dayjsTimestamp,
                    status: status
                }]
            });

            if (req.body.type === "OT") {
                if (!req.body.ot || !req.body.ot.timein || !req.body.ot.timeout) {
                    return res.json({
                        message: 'คุณจำเป็นต้องกรอก เวลา ขอทำ OT',
                        status: false,
                        data: null
                    });
                }

                const timein = dayjs(req.body.ot.timein);
                const timeout = dayjs(req.body.ot.timeout);
                const totalHours = timeout.diff(timein, 'hour');
                const totalMinutes = timeout.diff(timein, 'minute') % 60;
                const totalSeconds = timeout.diff(timein, 'second') % 60;
                const totalOTInSeconds = totalHours * 3600 + totalMinutes * 60 + totalSeconds;
            
                document.ot = {
                    timein: timein,
                    timeout: timeout,
                    total_ot: {
                        totaltime: (totalHours + " ชั่วโมง " + totalMinutes + " นาที " + totalSeconds + " วินาที"),
                        totalseconds: totalOTInSeconds
                    }
                };
            }

            const saved_document = await document.save();
            if (!saved_document) {
                return res.json({
                    message: 'can not save document',
                    status: false,
                    data: null
                });
            }
            return res.json({
                message: 'Insert document successfully!',
                status: true,
                data: saved_document,
            });
        })
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'Can not insert document : ' + err.message,
            status: false,
            data: null
        });
    }
};

//Update Document
exports.UpdateDocument = async (req, res, next) => {
    const trueorfalse = req.body.document_true
    try {
        console.log(trueorfalse)
        if(req.body.document_true != "ฉบับจริง" && req.body.document_true != "ฉบับร่าง"){
            return res.json({
                message: 'กรุณาใส่ ฉบับจริง หรือ ฉบับร่าง ที่ document_true',
                status: false,
                data: null
            });
        }

        const { id } = req.params; // รับ ID ของเอกสารที่ต้องการอัปเดต
        const employee_id = req.decoded.id
        const role = req.decoded.role
        const position = req.decoded.position

        // ทำการอัปเดตเอกสารโดยไม่ระบุชื่อตัวแปร
        let findDocument = await Document.findOne({_id:id})
            let statusDocs = findDocument.status_document
            if(statusDocs == 'ไม่อนุมัติ'){
                return res
                    .status(400)
                    .send({status:false, message:"เอกสารนี้ไม่อนุมัติเป็นที่เรียบร้อยแล้ว"})
            }else if (statusDocs == 'อนุมัติ'){
                return res
                    .status(400)
                    .send({status:false, message:"เอกสารนี้อนุมัติเป็นที่เรียบร้อยแล้ว"})
            }
        
        if( findDocument.document_true === "ฉบับร่าง" && req.body.document_true === "ฉบับจริง" ){

            const latestDoc = await Document.findOne({document_true : "ฉบับจริง"}).sort({ document_id: -1 }).limit(1);
            let docid = 1; // ค่าเริ่มต้นสำหรับ docid
            if (latestDoc) {
                docid = parseInt(latestDoc.document_id.slice(2)) + 1; // เพิ่มค่า docid
            }
            const docidString = docid.toString().padStart(5, '0');

            const reqFiles = [];
            const result = [];
            let image = ''
            if (req.files) {
                const url = req.protocol + "://" + req.get("host");
                for (var i = 0; i < req.files.length; i++) {
                    const src = await uploadFileCreate(req.files, res, { i, reqFiles });
                    result.push(src);
                    //   reqFiles.push(url + "/public/" + req.files[i].filename);
                }
                image = reqFiles[0]
            }
            let status = "รอหัวหน้าแผนกอนุมัติ"
            if(role == 'head_department'){
                status = 'รอผู้จัดการอนุมัติ'
            }else if (role == 'manager'){
                status = 'รอผู้บริหารอนุมัติ'
            }
            const findEm = findDocument.status_detail.findIndex(item => item.employee_id == employee_id)
            if(findEm != -1)
            {
                findDocument.status_detail[findEm].role = role
                findDocument.status_detail[findEm].position = position
                findDocument.status_detail[findEm].date = Date.now()
                findDocument.status_detail[findEm].status = status
                findDocument.status_detail[findEm].remark = req.body.remark
            }else{
                findDocument.status_detail.push({
                    employee_id:employee_id,
                    role:role,
                    position:position,
                    date: Date.now(),
                    status:status,
                }) 
            }
            const updatedDocument = await Document.findOneAndUpdate(
                { _id: id }, // เงื่อนไขในการค้นหาเอกสารที่ต้องการอัปเดต
                {
                    document_id: docidString,
                    ...req.body,
                    status_document:status,
                    status_detail:findDocument.status_detail
                },
                { new: true } // ตั้งค่าเพื่อให้คืนค่าข้อมูลเอกสารที่ถูกอัปเดตแล้ว
            );
            if (!updatedDocument) {
                return res.status(404).json({ message: 'Document not found' });
            }
            return res.json({
                message: 'Document updated successfully!',
                data: updatedDocument
            });
        }
        let status = "รอหัวหน้าแผนกอนุมัติ"
                if(role == 'head_department'){
                    status = 'รอผู้จัดการอนุมัติ'
                }else if (role == 'manager'){
                    status = 'รอผู้บริหารอนุมัติ'
                }
        const findEm = findDocument.status_detail.findIndex(item => item.employee_id == employee_id)
        if(findEm != -1)
        {
            findDocument.status_detail[findEm].role = role
            findDocument.status_detail[findEm].position = position
            findDocument.status_detail[findEm].date = Date.now()
            findDocument.status_detail[findEm].status = status
            findDocument.status_detail[findEm].remark = req.body.remark

        }else{
            findDocument.status_detail.push({
                employee_id:employee_id,
                role:role,
                position:position,
                date: Date.now(),
                status:status,
            }) 
        }
        const updatedDocument = await Document.findOneAndUpdate(
            { _id: id }, // เงื่อนไขในการค้นหาเอกสารที่ต้องการอัปเดต
            {
                ...req.body,
                status_document:status,
                status_detail:findDocument.status_detail
                
            },
            { new: true } // ตั้งค่าเพื่อให้คืนค่าข้อมูลเอกสารที่ถูกอัปเดตแล้ว
        );
        if (!updatedDocument) {
            return res.status(404).json({ message: 'Document not found' });
        }
        return res.json({
            message: 'Document updated successfully!',
            data: updatedDocument
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to update document' });
    }
};

// Update Document Detail
exports.updateDocumentDetail = async (req, res, next) => {
    try {
      const { id, detailId } = req.params; // รับ ID ของเอกสารและ ID ของรายละเอียดที่ต้องการอัปเดต
      const { detail, price, qty } = req.body; // รับข้อมูลรายละเอียดที่ต้องการอัปเดต
  
      // ทำการตรวจสอบว่าเอกสารที่ต้องการอัปเดตอยู่หรือไม่
      const document = await Document.findById(id);
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }
  
      // ทำการตรวจสอบว่ารายละเอียดที่ต้องการอัปเดตอยู่หรือไม่
      const existingDetail = document.Detail.find(d => d._id == detailId);
      if (!existingDetail) {
        return res.status(404).json({ message: 'Detail not found' });
      }
  
      // ทำการอัปเดต detail ของเอกสาร
      const updatedDocument = await Document.findOneAndUpdate(
        { _id: id, 'Detail._id': detailId }, // เงื่อนไขในการค้นหาเอกสารและรายละเอียดที่ต้องการอัปเดต
        { $set: { 'Detail.$.detail': detail, 'Detail.$.price': price, 'Detail.$.qty': qty } }, // กำหนดค่าที่ต้องการอัปเดต
        { new: true } // ตั้งค่าเพื่อให้คืนค่าข้อมูลเอกสารที่ถูกอัปเดตแล้ว
      );
  
      return res.json({
        message: 'Document Detail updated successfully!',
        data: updatedDocument
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to update document Detail' });
    }
};//ใช้งานได้
  
//Add file only
exports.addfileToDocument = async (req, res, next) => {
    try {
        let upload = multer({ storage: storage }).array("image", 20);
        upload(req, res, async function (err){
            const { id } = req.params; // รับ ID ของเอกสารที่ต้องการเพิ่ม File

            if (err instanceof multer.MulterError) {
                return res.status(500).json({ message: 'Failed to upload file' });
            } else if (err) {
                return res.status(500).json({ message: 'An unexpected error occurred' });
            }

            const reqFiles = [];
            const result = [];

            let image = '';
            if (req.files) {
                const url = req.protocol + "://" + req.get("host");
                for (var i = 0; i < req.files.length; i++) {
                    const src = await uploadFileCreate(req.files, res, { i, reqFiles });
                    result.push(src);
                    //   reqFiles.push(url + "/public/" + req.files[i].filename);
                }

                image = reqFiles.map(item=>{
                    return {
                        file_doc:item
                    }
                });
            }

            // เพิ่มไฟล์ใหม่ลงในอาร์เรย์ 'file' ของเอกสาร
            const addfile = await Document.findOneAndUpdate(
                { _id: id }, // เงื่อนไขในการค้นหาเอกสารที่ต้องการอัปเดต
                { $push: { 'file': { $each: image } } }, // เพิ่มข้อมูลใหม่ลงในอาร์เรย์ 'file'
                { new: true } // ตั้งค่าเพื่อให้คืนค่าข้อมูลเอกสารที่ถูกอัปเดตแล้ว
            );

            if (!addfile) {
                return res.status(404).json({ message: 'Document not found' });
            }

            return res.json({
                message: 'Files added to document successfully!',
                data: addfile
            });
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to add files to document' });
    }
};


//Delete Document
exports.DeleteDocument = async (req, res, next) =>{
    try {
        const document = await Document.findByIdAndDelete(req.params.id);
        res.json({
            message: 'Delete employees successfully!',
            status: true,
            data: document
        });
    } catch (err) {
        console.log(err)
        return res.json({
            message: err.message,
            status: false,
            data: null
        })
    }
};

//Delete Detail Only
exports.DeleteFile = async (req, res, next) => {
    try {
        const id = req.params.id;
        const file_doc = req.body.file_doc;

        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ 
                message: 'Document not found' 
            });
        }

        const detailIndex = document.file.findIndex(data => data.file_doc == file_doc);
        console.log(file_doc)
        console.log(detailIndex)
        if (detailIndex === -1) {
            return res.status(404).json({ 
                message: 'Detail not found' 
            });

        }
        const src = await deleteFile(document.file[detailIndex].file_doc);
        console.log(document.file[detailIndex].file_doc)

        document.file.splice(detailIndex, 1);

        const savedDocument = await document.save();

        return res.status(200).json({ 
            message: 'Detail deleted successfully', 
            data: savedDocument 
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to delete detail from document' });
    }
};//ใช้งานได้

exports.updateDocumentStatus = async (req, res, next) =>{
    try{
        console.log('req.decoded :', req.decoded);
        const employee_id = req.decoded.id
        const role = req.decoded.role
        const position = req.decoded.position
        
        const document_id = req.params.id
        const statusApprove = req.body.statusApprove
        const remark = req.body.remark
        
        if(statusApprove != 'อนุมัติ' && statusApprove != 'ไม่อนุมัติ' && statusApprove != 'แก้ไข'){
            return res
                    .status(400)
                    .send({status:false, message:"กรุณาใส่สถานะให้ถูกต้อง"})
        }
        const findDocument = await Document.findById(document_id)
        let findRole
            if (findDocument) {
                findRole = findDocument.status_detail[0].role;
                let statusDocs = findDocument.status_document
                if(statusDocs == 'รอตรวจสอบ'){
                    return res
                            .status(400)
                            .send({status:false, message:"กรุณารอการแก้ไขจากผู้ร้องขอ"})
                }else if(statusDocs == 'ไม่อนุมัติ'){
                    return res
                            .status(400)
                            .send({status:false, message:"เอกสารนี้ไม่อนุมัติเป็นที่เรียบร้อยแล้ว"})
                }else if (statusDocs == 'อนุมัติ'){
                    return res
                            .status(400)
                            .send({status:false, message:"เอกสารนี้อนุมัติเป็นที่เรียบร้อยแล้ว"})
                }
                // ทำสิ่งที่ต้องการกับ findRole ต่อไป
            } else {
                return res
                        .status(400)
                        .send({status:false, message:"ไม่พบเอกสารที่ท่านต้องการ"})
            }
        // console.log(position, role, findRole)
        const [roleUser, roleRequester, roleAll] = await Promise.all([
            roleEmployee.findOne({ role: role }),
            roleEmployee.findOne({ role: findRole }),
            roleEmployee.find()
        ]);

        console.log(roleUser.number_role, roleRequester.number_role)
            if(roleUser.number_role >= roleRequester.number_role){
                return res
                        .status(400)
                        .send({status:false, message:"คุณไม่มีสิทธิ์ใช้งาน ยศคุณเท่ากันหรือต่ำกว่า"})
            }

         // เรียงลำดับ array Status_detail ตามฟิลด์ date ในลำดับเพิ่ม (ascending order)
         const sortedStatusDetail = findDocument.status_detail.sort((a, b) => new Date(a.date) - new Date(b.date));

         // ดึงเอกสารตัวแรกออกมา
         const latestStatus = sortedStatusDetail[sortedStatusDetail.length - 1];

         //ถ้าเจอ array ที่มี elemnet.role == latestStatus.role จะดึงออกมาแค่ เอกสารเดียว และไม่ดึงหลายเอกสารถ้าต้องการาดึงหลายเอกสารให้ใช้ filter
         let p = roleAll.find(element => element.role == latestStatus.role); 

        //  console.log(p)
         let roleCanApprove = p.number_role - 1
             if(roleUser.number_role != roleCanApprove){
                 return res
                         .status(400)
                         .send({status:false, message:"ยังไม่ถึงเวลาที่ท่านจะทำรายการนี้"})
             }
        // console.log(roleCanApprove)
        let status_document
        let status
        let detail = {
                employee_id:employee_id,
                role:role,
                position:position,
                date: dayjsTimestamp,
                status:status
        }
        if(statusApprove == 'ไม่อนุมัติ'){
            status_document = 'ไม่อนุมัติ'
            detail.status = "ไม่อนุมัติ"
            detail.remark = remark
        }else if(statusApprove == 'อนุมัติ'){
            if(roleUser.number_role == 1){
                    status_document = 'อนุมัติ'
                    status = 'อนุมัติ'
            }else{
                    let roleNext = roleCanApprove - 1
                    for (const doc of roleAll) {
                        // console.log(doc)
                        if (doc.number_role == roleNext) {
                            // console.log(doc)
                            status_document = `รอ${doc.thai_role}อนุมัติ`
                            status = 'อนุมัติ'
                            break;
                        }
                    }
            }
            detail.status = status
        }else if (statusApprove == 'แก้ไข'){
            detail.remark = remark
            status_document = 'รอตรวจสอบ'
            detail.status = 'แก้ไข'
        }
        const updateDocument = await Document.findByIdAndUpdate(
            document_id,
            {
                status_document: status_document,
                $push:{
                    status_detail:detail
                }
            },
            {new:true})

            if(!findDocument){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่พบเอกสารที่คุณต้องการ"})
            }
            // Insert data into timeSchema if the role of the approver is owner
            if ((roleUser.role === 'owner'||roleUser.role === 'admin') && findDocument.type === 'OT') {
                const { totalHours, totalMinutes, totalSeconds, totalOTInSeconds} = calculateTotalTime(findDocument.ot.total_ot.totalseconds);
                const timeData = {
                    employee_id : sortedStatusDetail[0].employee_id,
                    day: dayjs(findDocument.ot.timein).tz('Asia/Bangkok').format('DD'),
                    mount: dayjs(findDocument.ot.timein).tz('Asia/Bangkok').format('MM'),
                    year: dayjs(findDocument.ot.timein).tz('Asia/Bangkok').format('YYYY'),
                    total_ot: totalOTInSeconds,
                    time_line : "OT",
                    time_in: dayjs(findDocument.ot.timein).tz('Asia/Bangkok').format('HH:mm:ss'),
                    time_out: dayjs(findDocument.ot.timeout).tz('Asia/Bangkok').format('HH:mm:ss'),
                };
                console.log(timeData)
                console.log('Owner อนุมัติ จะทำการเพิ่มข้อมูล OT ลงฐานข้อมูลลงเวลาพนักงาน')
                const newTimeData = await timeInOut.create(timeData)
                    if(!newTimeData){
                        return res
                                .status(400)
                                .send({status:false, message:"ไม่สามารถสร้างประวัติ OT ได้"})
                    }
            }
        return res
                .status(200)
                .send({status:true, data:updateDocument})

    }catch(err){
        console.error(err);
        return res.status(500).json({ message: err.message});
    }
}

function calculateTotalTime(totalSeconds) {
    const totalHours = Math.floor(totalSeconds / 3600);
    const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    const totalOTInSeconds = totalHours * 3600 + totalMinutes * 60 + remainingSeconds;

    return { totalHours, totalMinutes, totalSeconds, totalOTInSeconds };
}