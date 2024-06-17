const express = require('express');
const router = express.Router();
const postType = require('../../controllers/Post/post.type')

const authUser = require("../../auten")

//Get Post
router.get('/getall', postType.getAll);

//Get Post By Id
router.get('/byid/:id', postType.getById);

//Insert Post or Register
router.post('/Insert-type', postType.create);

//Update Post
router.put('/update-type/:id', postType.updateInfo);

//Delete Post
router.delete('/delete-type/:id', postType.delend);

module.exports = router;