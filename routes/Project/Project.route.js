const express = require('express')
const router = express.Router();
const ProjectController = require('../../controllers/project/Project.controller')

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.get('/', ProjectController.getProjects);

router.get('/:id', ProjectController.getProject);

router.post('/', ProjectController.createProject);

router.put('/:id/update', ProjectController.updateProject);
router.put('/:id/submit', ProjectController.acceptProject);

router.delete('/:id', ProjectController.deleteProject);

router.post('/shop', ProjectController.createProjectShop);
router.put('/shop/cancel', ProjectController.cancelProjectShop)

//router.put('/accept/:id', auth, ProjectController.Accept);

//router.put('/finish/:id', auth, ProjectController.Finish);


module.exports = router;