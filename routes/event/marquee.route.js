const router = require("express").Router()
const Event = require("../../controllers/Event/event_controller")

router.post('/marquee', Event.createMarquee)
router.put('/marquee/:id', Event.updateMarquee)
router.get('/marquees', Event.getMarquees)
router.delete('/marquee/:id', Event.deleteMarquee)

module.exports = router