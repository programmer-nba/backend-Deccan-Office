const router = require("express").Router()
const Event = require("../../controllers/Event/event_controller")

router.post('/create', Event.createEvent)
router.put('/:id', Event.updateEvent)
router.get('/', Event.getEvents)
router.get('/:id/one', Event.getEvent)
router.delete('/:id', Event.deleteEvent)

module.exports = router