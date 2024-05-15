const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const UserinfoController = require('../../controllers/Userinfo/Userinfo.controller.js')
const auten = require('../../auten.js')

//Get User
router.get('/', UserinfoController.getUser);

//Get User by ID
router.get('/byid/:id', UserinfoController.getUserById);

//Add User
router.post('/info' ,UserinfoController.Insertimage );

//Update User
router.put('/update/:id', UserinfoController.updateUserinfo);

//Update User image
router.put('/update-image/:id', UserinfoController.updateUploadimage);

//Update User file
router.put('/update-file/:id', UserinfoController.updateUploadfile);

//Delete User
router.delete('/delete-user/:id', UserinfoController.deleteUserinfo);

router.get('/getme',auten.user, UserinfoController.getme);

module.exports = router;