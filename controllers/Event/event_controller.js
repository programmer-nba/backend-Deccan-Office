const Event = require("../../model/Event/event_model")
const Marquee = require("../../model/Event/marquee_model")

exports.createEvent = async (req, res) => {
    const { title, detail, creator, members, location, startDate, endDate, startTime, endTime, status, remind, eventType } = req.body
    try {
        const eventData = {
            title: title,
            detail: detail,
            creator: creator,
            members: members,
            location: location,
            startDate: startDate,
            endDate: endDate,
            startTime: startTime,
            endTime: endTime,
            status: status,
            remind: remind,
            eventType: eventType
        }
        const event = new Event(eventData)
        const saved_event = await event.save()
        if(!saved_event){
            return res.json({
                message: "can not create event"
            })
        }
        return res.status(200).json({
            message: "success",
            status: true,
            data: saved_event
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.updateEvent = async (req, res) => {
    const { title, detail, creator, members, location, startDate, endDate, startTime, endTime, status, remind, eventType } = req.body
    const { id } = req.params
    try {
        let event = await Event.findById( id )
        if(!event){
            return res.json({
                message: "event not found"
            })
        }
        event.title= title || event.title
        event.detail= detail || event.detail
        event.creator= creator || event.creator
        event.members= members || event.members
        event.location= location || event.location
        event.startDate= startDate || event.startDate 
        event.endDate= endDate || event.endDate
        event.startTime= startTime || event.startTime
        event.endTime= endTime || event.endTime
        event.remind = remind || event.remind
        event.eventType = eventType || event.eventType
        event.status= status || event.status
        const saved_event = await event.save()
        if(!saved_event){
            return res.json({
                message: "can not update event"
            })
        }
        return res.status(200).json({
            message: "success",
            status: true,
            data: saved_event
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.deleteEvent = async (req, res) => {
    const { id } = req.params
    try {
        const event = await Event.findById( id )
        if(!event){
            return res.json({
                message: "event not found"
            })
        }

        const deleted_event = await Event.findByIdAndDelete( id )
        if(!deleted_event){
            return res.json({
                message: "can not delete event"
            })
        }
        
        return res.status(200).json({
            message: "success",
            status: true,
            data: deleted_event.deletedCount
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.getEvent = async (req, res) => {
    const { id } = req.params
    try {
        const event = await Event.findById( id )
        if(!event){
            return res.json({
                message: "event not found"
            })
        }
        
        return res.status(200).json({
            message: "success",
            status: true,
            data: event
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find()
        
        return res.status(200).json({
            message: `have ${events.length} events`,
            status: true,
            data: events
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}


// Marquee
exports.createMarquee = async (req, res) => {
    const { text } = req.body
    try {
        const marquee = await Marquee.create({
            text: text
        })
        if (!marquee) {
            return res.status(500).json({
                message: "can not create marquee!"
            })
        }
        return res.status(200).json({
            message: "success",
            status: true,
            data: marquee
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.updateMarquee = async (req, res) => {
    const { text } = req.body
    const { id } = req.params
    try {
        const marquee = await Marquee.findByIdAndUpdate(id, {
            $set: {
                text: text
            }
        }, { new : true })
        if (!marquee) {
            return res.status(404).json({
                message: "marquee not found!"
            })
        }
        return res.status(201).json({
            message: "success",
            status: true,
            data: marquee
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.getMarquees = async (req, res) => {
    try {
        const marquee = await Marquee.find()
        if (!marquee) {
            return res.status(404).json({
                message: "marquee not found!"
            })
        }
        return res.status(200).json({
            message: "success",
            status: true,
            data: marquee
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.deleteMarquee = async (req, res) => {
    const { id } = req.params
    try {
        const marquee = await Marquee.findByIdAndDelete(id)
        if (!marquee) {
            return res.status(404).json({
                message: "marquee not found!"
            })
        }
        return res.status(200).json({
            message: "success",
            status: true
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}