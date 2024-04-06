const Document = require('../../model/document/Document')
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { roleEmployee } = require('../../model/employee/role');

dayjs.extend(utc);
dayjs.extend(timezone);

dayjsTimestamp = dayjs().tz('Asia/Bangkok');
dayTime = dayjsTimestamp.format('YYYY-MM-DD');

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
        const documents = await Document.find({ 'Employee.employee_id': user_id });
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

// Get Document By Status
exports.getdocumentByStatus = async (req, res, next) => {
    try {
        const documents = await Document.find({ Status: req.params.Status });
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
        const latestDoc = await Document.findOne().sort({ Document_id: -1 }).limit(1);
        const employee_id = req.decoded.id
        const role = req.decoded.role
        const position = req.decoded.position
        if (req.body.Type != "OT" && req.body.Type != "Normal") {
            return res.json({
                message: 'it not OT or Normal',
                status: false,
                data: null
            });
        }
        else if (req.body.Type === "Normal") {
            if (req.body.OT) {
                return res.json({
                    message: 'ไม่สามารถเพิ่ม OT หาก Type เป็น Normal',
                    status: false,
                    data: null
                });
            }
        }
        let docid = 1; // ค่าเริ่มต้นสำหรับ docid
        if (latestDoc) {
            docid = parseInt(latestDoc.Document_id.slice(2)) + 1; // เพิ่มค่า docid
        }
        const docidString = docid.toString().padStart(5, '0'); // แปลง docid เป็นสตริงพร้อมเติมเลข 0 ข้างหน้า
        const { Doc_Date, Headers, Type, To, Timein, Timeout, Detail } = req.body;
        
        let status = "รอหัวหน้าแผนกอนุมัติ"
            if(role == 'head_department'){
                status = 'รอผู้จัดการอนุมัติ'
            }else if (role == 'manager'){
                status = 'รอผู้บริหารอนุมัติ'
            }

        const document = new Document({
            Document_id: docidString,
            Doc_Date: Doc_Date,
            Headers: Headers,
            Type : Type,
            To: To,
            Detail: req.body.Detail,
            Status_document: status,
            Status_detail: [{
                employee_id: employee_id,
                role: role,
                position: position,
                date: dayjsTimestamp, // หรือวันที่คุณต้องการกำหนด
                status: status
            }]
            // Requester: Requester
        });

        if (req.body.Type === "OT") {
            if (!req.body.OT || !req.body.OT.Timein || !req.body.OT.Timeout) {
                return res.json({
                    message: 'คุณจำเป็นต้องกรอก เวลา ขอทำ OT',
                    status: false,
                    data: null
                });
            }

            const timein = dayjs(req.body.OT.Timein);
            const timeout = dayjs(req.body.OT.Timeout);
            const totalHours = timeout.diff(timein, 'hour');
            const totalMinutes = timeout.diff(timein, 'minute') % 60;
            const totalSeconds = timeout.diff(timein, 'second') % 60;
            const totalOTInSeconds = totalHours * 3600 + totalMinutes * 60 + totalSeconds;
        
            document.OT = {
                Timein: timein,
                Timeout: timeout,
                Total_OT: {
                    totaltime: (totalHours + " ชั่วโมง " + totalMinutes + " นาที " + totalSeconds + " วินาที"),
                    totalseconds: totalOTInSeconds
                }
            };
        }        
        // if (Array.isArray(Detail) && Detail.length > 0) { //เมื่อไม่มีการส่งค่าของ Detail มาจะไม่ทำขั้นตอนนี้
        //     Detail.forEach(item => {
        //         document.Detail.push({
        //             detail: item.detail,
        //             price: item.price,
        //             qty: item.qty
        //         });
        //     });
        // }
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
            data: saved_document
        });
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'Can not insert document : ' + err.message,
            status: false,
            data: null
        });
    }
};

//Update Head Department
exports.updateDocumentHeadDepartment = async (req, res, next) => {
    try {
        const { id } = req.params; // รับ ID ของเอกสารที่ต้องการอัปเดต
        const user_id = req.decoded.id // ดึง _id Head_department ที่ต้องการอัปเดต
    
        // ทำการตรวจสอบว่าเอกสารที่ต้องการอัปเดตอยู่หรือไม่
        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
    
        // ทำการอัปเดตข้อมูลของ Head_department ในเอกสาร
        document.Head_department.head_id = user_id;
        document.Head_department.head_date = Date.now();

        // เพิ่มการอัปเดตข้อมูล Status เป็น รอผู้จัดการอนุมัติ
        document.Status = "รอผู้จัดการอนุมัติ";
    
        console.log("กำลังลงชื่อ Head_department");
        // บันทึกการเปลี่ยนแปลงลงในฐานข้อมูล
        await document.save();
    
        return res.json({
            message: 'Head_department updated successfully!',
            data: document
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to update Head_department' });
    }
};//ใช้งานได้

//Update Document
exports.UpdateDocument = async (req, res, next) => {
    try {
        const { id } = req.params; // รับ ID ของเอกสารที่ต้องการอัปเดต
        const employee_id = req.decoded.id
        const role = req.decoded.role
        const position = req.decoded.position
        // ทำการอัปเดตเอกสารโดยไม่ระบุชื่อตัวแปร
        const findDocument = await Document.findOne({_id:id})
            let statusDocs = findDocument.Status_document
                if(statusDocs == 'ไม่อนุมัติ'){
                    return res
                            .status(400)
                            .send({status:false, message:"เอกสารนี้ไม่อนุมัติเป็นที่เรียบร้อยแล้ว"})
                }else if (statusDocs == 'อนุมัติ'){
                    return res
                            .status(400)
                            .send({status:false, message:"เอกสารนี้อนุมัติเป็นที่เรียบร้อยแล้ว"})
                }
        const updatedDocument = await Document.findOneAndUpdate(
            { _id: id }, // เงื่อนไขในการค้นหาเอกสารที่ต้องการอัปเดต
            {
                    ...req.body,
                    Status_document:"รอหัวหน้าแผนกอนุมัติ",
                    $push:{
                        Status_detail:{
                            employee_id:employee_id,
                            role:role,
                            position:position,
                            date: dayjsTimestamp,
                            status:"รอหัวหน้าแผนกอนุมัติ",
                        }
                    }
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
  
//Add detail only
exports.addDetailToDocument = async (req, res, next) => {
    try {
        const { id } = req.params; // รับ ID ของเอกสารที่ต้องการเพิ่ม Detail
        const { detail, price, qty } = req.body; // รับข้อมูล Detail ที่ต้องการเพิ่ม

        // ทำการเพิ่ม Detail ใหม่เข้าไปในอาร์เรย์ Detail ของเอกสาร
        const updatedDocument = await Document.findOneAndUpdate(
            { _id: id }, // เงื่อนไขในการค้นหาเอกสารที่ต้องการอัปเดต
            { $push: { 'Detail': { detail, price, qty } } }, // เพิ่มข้อมูลใหม่ลงในอาร์เรย์ Detail
            { new: true } // ตั้งค่าเพื่อให้คืนค่าข้อมูลเอกสารที่ถูกอัปเดตแล้ว
        );

        if (!updatedDocument) {
            return res.status(404).json({ message: 'Document not found' });
        }

        return res.json({
            message: 'Detail added to document successfully!',
            data: updatedDocument
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to add detail to document' });
    }
};//ใช้งานได้

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
exports.DeleteDetail = async (req, res, next) => {
    try {
        const { id, detailId } = req.params;

        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const detailIndex = document.Detail.findIndex(d => d._id.toString() === detailId);
        if (detailIndex === -1) {
            return res.status(404).json({ message: 'Detail not found' });
        }

        document.Detail.splice(detailIndex, 1);
        const savedDocument = await document.save();

        return res.status(200).json({ message: 'Detail deleted successfully', data: savedDocument });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to delete detail from document' });
    }
};//ใช้งานได้
  
//Update Manager
exports.updateDocumentManager = async (req, res, next) => {
    try {
        const { id } = req.params; // รับ ID ของเอกสารที่ต้องการอัปเดต
        const user_id = req.decoded.id // ดึง _id Manager ที่ต้องการอัปเดต
    
        // ทำการตรวจสอบว่าเอกสารที่ต้องการอัปเดตอยู่หรือไม่
        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
    
        // ทำการอัปเดตข้อมูลของ CEO ในเอกสาร
        document.Manager.manager_id = user_id;
        document.Manager.manager_date = Date.now();
        
        // เพิ่มการอัปเดตข้อมูล Status เป็น รอกรรมการอนุมัติ
        document.Status = "รอกรรมการอนุมัติ";

        console.log("กำลังลงชื่อ Manager")
        // บันทึกการเปลี่ยนแปลงลงในฐานข้อมูล
        await document.save();
    
        return res.json({
            message: 'Manager updated successfully!',
            data: document
        });
    }   catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to update Manager' });
    }
};//ใช้งานได้

//Update CEO Allow
exports.updateDocumentCEO = async (req, res, next) => {
    try {
        const { id } = req.params; // รับ ID ของเอกสารที่ต้องการอัปเดต
        const user_id = req.decoded.id // รับข้อมูล CEO ที่ต้องการอัปเดต

        // ทำการตรวจสอบว่าเอกสารที่ต้องการอัปเดตอยู่หรือไม่
        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // ทำการอัปเดตข้อมูลของ CEO ในเอกสาร
        document.CEO.ceo_id = user_id;
        document.CEO.ceo_date = Date.now();
      
        // เพิ่มการอัปเดตข้อมูล Status เป็น อนุมัติแล้ว
        document.Status = "กรรมการอนุมัติแล้ว";

        console.log("กำลังลงชื่อ CEO");
        // บันทึกการเปลี่ยนแปลงลงในฐานข้อมูล
        await document.save();
    
        return res.json({
            message: 'CEO updated successfully!',
            data: document
        });
    }   catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to update CEO' });
    }
};//ใช้งานได้

//Update CEO  Not Allow
exports.updateDocumentCEONotAllow = async (req, res, next) => {
    try {
        const { id } = req.params; // รับ ID ของเอกสารที่ต้องการอัปเดต
        const user_id = req.decoded.id // รับข้อมูล CEO ที่ต้องการอัปเดต

        // ทำการตรวจสอบว่าเอกสารที่ต้องการอัปเดตอยู่หรือไม่
        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // ทำการอัปเดตข้อมูลของ CEO ในเอกสาร
        document.CEO.ceo_id = user_id;
        document.CEO.ceo_date = Date.now();
      
        // เพิ่มการอัปเดตข้อมูล Status เป็น อนุมัติแล้ว
        document.Status = "ไม่อนุมัติ";

        console.log("กำลังลงชื่อ CEO");
        // บันทึกการเปลี่ยนแปลงลงในฐานข้อมูล
        await document.save();
    
        return res.json({
            message: 'CEO updated successfully!',
            data: document
        });
    }   catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to update CEO' });
    }
};//ใช้งานได้

exports.updateDocumentStatus = async (req, res, next) =>{
    try{
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
                findRole = findDocument.Status_detail[0].role;
                let statusDocs = findDocument.Status_document
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
                        .send({status:false, message:"คุณไม่มีสิทธิ์ใช้งาน"})
            }
        
         // เรียงลำดับ array Status_detail ตามฟิลด์ date ในลำดับเพิ่ม (ascending order)
         const sortedStatusDetail = findDocument.Status_detail.sort((a, b) => new Date(a.date) - new Date(b.date));

         // ดึงเอกสารตัวแรกออกมา
         const latestStatus = sortedStatusDetail[sortedStatusDetail.length - 1];

         //ถ้าเจอ array ที่มี elemnet.role == latestStatus.role จะดึงออกมาแค่ เอกสารเดียว และไม่ดึงหลายเอกสารถ้าต้องการาดึงหลายเอกสารให้ใช้ filter
         let p = roleAll.find(element => element.role == latestStatus.role); 

         // console.log(p)
         let roleCanApprove = p.number_role - 1
             if(roleUser.number_role != roleCanApprove){
                 return res
                         .status(400)
                         .send({status:false, message:"ยังไม่ถึงเวลาที่ท่านจะทำรายการนี้"})
             }

        let detail = {
                employee_id:employee_id,
                role:role,
                position:position,
                date: dayjsTimestamp,
                status:status
        }
        let Status_document
        let status
        if(statusApprove == 'ไม่อนุมัติ'){
            Status_document == 'ไม่อนุมัติ'
            status = "ไม่อนุมัติ"
        }else if(statusApprove == 'อนุมัติ'){
            if(roleUser.number_role == 1){
                    Status_document = 'อนุมัติ'
                    status = 'อนุมัติ'
            }else{
                    let roleNext = roleCanApprove - 1
                    for (const doc of roleAll) {
                        // console.log(doc)
                        if (doc.number_role == roleNext) {
                            // console.log(doc)
                            Status_document = `รอ${doc.thai_role}อนุมัติ`
                            status = 'อนุมัติ'
                            break;
                        }
                    }
            }
        }else if (statusApprove == 'แก้ไข'){
            detail.remark = remark
            Status_document = 'รอตรวจสอบ'
            status = 'แก้ไข'
        }

        const updateDocument = await Document.findByIdAndUpdate(
            document_id,
            {
                Status_document: Status_document,
                $push:{
                    Status_detail:detail
                }
            },
            {new:true})
            if(!findDocument){
                return res
                        .status(404)
                        .send({status:false, message:"ไม่พบเอกสารที่คุณต้องการ"})
            }
        return res
                .status(200)
                .send({status:true, data:updateDocument})

    }catch(err){
        console.error('มีบางอย่างผิดพลาด');
        return res.status(500).json({ message: err });
    }
}
