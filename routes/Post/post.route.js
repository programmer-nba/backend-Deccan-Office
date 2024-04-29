const express = require('express');
const router = express.Router();
const PostController = require('../../controllers/Post/Post.controller')

//Get Post
router.get('/', PostController.getpost);

//Get Post By Id
router.get('/byid/:id', PostController.getPostById);

//Insert Post or Register
router.post('/Insert-post', PostController.Insertpost);

//Update Post
router.put('/update-post/:id', PostController.Updatepost);

//Delete Post
router.delete('/delete-post/:id', PostController.Deletepost);

module.exports = router;