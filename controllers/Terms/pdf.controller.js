const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/pdf'); // Upload destination
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext); // File naming convention
  },
});

// Multer upload instance
const upload = multer({ storage: storage });

exports.uploadPdf = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
          return res.status(400).send('No file uploaded.');
        }
        res.send({ filename: file.filename });
    }
    catch(err) {
        console.log(err)
        res.send(err.message)
    }
};

exports.updatePdf = async (req, res) => {
    const { filename, fields } = req.body;
    try {
      const filePath = path.join(__dirname, '../..', 'uploads/pdf', filename);
      const pdfBytes = fs.readFileSync(filePath);
      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  
      // Insert user information
      const form = pdfDoc.getForm();
      Object.keys(fields).forEach((key) => {
        const field = form.getTextField(key);
        if (field) {
          field.setText(fields[key]);
        }
      });
  
      // Save the edited PDF
      const pdfBytesEdited = await pdfDoc.save();
      const editedFilePath = path.join(__dirname, '../..', 'uploads/pdf', `edited_${filename}`);
      fs.writeFileSync(editedFilePath, pdfBytesEdited);
  
      res.send({ filename: `edited_${filename}` });
    } catch (error) {
      console.error('An error occurred while processing the PDF:', error);
      res.status(500).send('An error occurred while processing the PDF.');
    }
  };

exports.getPdf = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'uploads/pdf', filename);
  res.download(filePath);
};

// Export the multer upload instance
exports.upload = upload.single('file');