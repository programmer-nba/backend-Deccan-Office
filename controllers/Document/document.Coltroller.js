const Document = require('../../model/document/Document')
const dayjs = require('dayjs');

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
        const documents = await Document.find({ Requester: req.params.Requester });
        return res.json({
            message: 'Get documents by Requester successfully!',
            status: true,
            data: documents
        });
    } catch (err) {
        console.log(err);
        return res.json({
            message: 'Can not get documents by Requester: ' + err.message,
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

        let docid = 1; // ค่าเริ่มต้นสำหรับ docid
        if (latestDoc) {
            docid = parseInt(latestDoc.Document_id.slice(2)) + 1; // เพิ่มค่า docid
        }
        const docidString = docid.toString().padStart(5, '0'); // แปลง docid เป็นสตริงพร้อมเติมเลข 0 ข้างหน้า
        const { Doc_Date, Headers, To, Timein, Timeout, Detail, Requester } = req.body;

        const document = new Document({
            Document_id: docidString,
            Doc_Date: Doc_Date,
            Headers: Headers,
            To: To,
            Requester: Requester
        });
        if (req.body.OT && req.body.OT.Timein && req.body.OT.Timeout) { //เมื่อไม่มีการส่งค่าของ OT มาจะไม่ทำขั้นตอนนี้
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
        if (Array.isArray(Detail) && Detail.length > 0) { //เมื่อไม่มีการส่งค่าของ Detail มาจะไม่ทำขั้นตอนนี้
            Detail.forEach(item => {
                document.Detail.push({
                    detail: item.detail,
                    price: item.price,
                    qty: item.qty
                });
            });
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

//Update Document
exports.UpdateDocument = async (req, res, next) => {
    try {
        const { id } = req.params; // รับ ID ของเอกสารที่ต้องการอัปเดต
        const { Doc_Date, Headers, To, Employees, Head_department, Manager, CEO } = req.body; // รับข้อมูลที่ต้องการอัปเดต

        // ทำการอัปเดตเอกสาร
        const updatedDocument = await Document.findOneAndUpdate(
            { _id: id }, // เงื่อนไขในการค้นหาเอกสารที่ต้องการอัปเดต
            {
                $set: { // กำหนดค่าที่ต้องการอัปเดต
                    Doc_Date: Doc_Date,
                    Headers: Headers,
                    To: To,
                    Employees: Employees,
                    Head_department: Head_department,
                    Manager : Manager,
                    CEO: CEO
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

//Update Head Department
exports.updateDocumentHeadDepartment = async (req, res, next) => {
    try {
        const { id } = req.params; // รับ ID ของเอกสารที่ต้องการอัปเดต
        const { head_id } = req.body; // รับข้อมูล Head_department ที่ต้องการอัปเดต
    
        // ทำการตรวจสอบว่าเอกสารที่ต้องการอัปเดตอยู่หรือไม่
        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
    
        // ทำการอัปเดตข้อมูลของ Head_department ในเอกสาร
        document.Head_department.head_id = head_id;
        document.Head_department.head_date = Date.now();

        // เพิ่มการอัปเดตข้อมูล Status เป็น 2
        document.Status = 2;
    
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
  
//Update Manager
exports.updateDocumentManager = async (req, res, next) => {
    try {
        const { id } = req.params; // รับ ID ของเอกสารที่ต้องการอัปเดต
        const { manager_id, manager_date} = req.body; // รับข้อมูล CEO ที่ต้องการอัปเดต
    
        // ทำการตรวจสอบว่าเอกสารที่ต้องการอัปเดตอยู่หรือไม่
        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
    
        // ทำการอัปเดตข้อมูลของ CEO ในเอกสาร
        document.Manager.manager_id = manager_id;
        document.Manager.manager_date = manager_date;
        
        // เพิ่มการอัปเดตข้อมูล Status เป็น 3
        document.Status = 3;

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

//Update CEO
exports.updateDocumentCEO = async (req, res, next) => {
    try {
        const { id } = req.params; // รับ ID ของเอกสารที่ต้องการอัปเดต
        const { ceo_id, ceo_date} = req.body; // รับข้อมูล CEO ที่ต้องการอัปเดต

        // ทำการตรวจสอบว่าเอกสารที่ต้องการอัปเดตอยู่หรือไม่
        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // ทำการอัปเดตข้อมูลของ CEO ในเอกสาร
        document.CEO.ceo_id = ceo_id;
        document.CEO.ceo_date = ceo_date;
      
        // เพิ่มการอัปเดตข้อมูล Status เป็น 4
        document.Status = 4;

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
  