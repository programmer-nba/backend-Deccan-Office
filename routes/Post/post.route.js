const express = require('express');
const router = express.Router();
const PostController = require('../../controllers/Post/Post.controller')

const authUser = require("../../auten")

//Get Post
router.get('/getall', PostController.getpost);

//Get Post By Id
router.get('/byid/:id', authUser.user, PostController.getPostById);

//Insert Post or Register
router.post('/Insert-post', PostController.Insertpost);

//Update Post
router.put('/update-post/:id', PostController.Updatepost);

//Delete Post
router.delete('/delete-post/:id', PostController.Deletepost);

//On / Off
router.put('/onoff/:id', PostController.OnOff);

module.exports = router;