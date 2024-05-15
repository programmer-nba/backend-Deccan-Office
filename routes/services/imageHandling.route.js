const express = require('express')
const router = express.Router()

const imageServiceController = require("../../controllers/services/imageService_controller")

router.post('/image', imageServiceController.handleImageUpload)
//router.get('/:userId/all', imageServiceController.getNotifyTokens)
//router.get('/:id/image', imageServiceController.getNotifyTokens)

module.exports = router