const multer = require("multer");
const path = require("path");
const FileStorage = require("../../model/services/fileStorage.model");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Upload destination
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext); // File naming convention
  },
});

// Multer upload instance
const upload = multer({ storage: storage });

exports.handleImageUpload = async (req, res, next) => {
    try {
      // Multer middleware for single file upload
      upload.single("image")(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ message: "Multer error: " + err.message });
        } else if (err) {
          return res.status(500).json({ message: "Internal server error: " + err.message });
        }
  
        // File successfully uploaded, proceed with handling the image
        if (req.file) {
          const { user_id, title } = req.body;
          const fileData = {
            user_id: user_id,
            fileName: req.file.filename,
            fileType: req.file.mimetype,
            title: title,
          };
  
          const newFile = new FileStorage(fileData);
          const savedFile = await newFile.save();
  
          if (!savedFile) {
            return res.status(500).json({ message: "Failed to save file to database" });
          }
          return res.status(200).json({ message: "File uploaded successfully", status: true, data: savedFile });
        } else {
          return res.status(400).json({ message: "No file uploaded" });
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  };  

  exports.getImageThumbnail = (req, res) => {
    const { imageId } = req.body
    try {
      const thumbnail = `https://drive.google.com/thumbnail?id=${imageId}`
      if (!imageId) {
        return res.status(200).send({
          data: null
        })
      }
      return res.status(200).send({
        data: thumbnail,
        status: true
      })
    }
    catch(err) {
      console.log(err)
      return res.json({
        message: err.message
      })
    }
  }
