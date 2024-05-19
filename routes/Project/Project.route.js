const express = require ('express')
const router =  express.Router();
const ProjectController = require ('../../controllers/project/Project.controller')

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.get('/', ProjectController.getProjects);

router.get('/:id', ProjectController.getProject);

router.post('/', ProjectController.createProject);

router.put('/:id', ProjectController.updateProject);

router.delete('/:id', ProjectController.deleteProject);

//router.put('/accept/:id', auth, ProjectController.Accept);

//router.put('/finish/:id', auth, ProjectController.Finish);


module.exports = router;