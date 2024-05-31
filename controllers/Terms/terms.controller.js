const Term = require("../../model/Terms/terms.model")
const AcceptedTerm = require("../../model/Terms/acceptedHis.model")

exports.create = async (req, res) => {
    const {
        title, //require
        code, //require
        content,
        active,
        standard,
        user,
        requireSignature,
        signatures,
        status,
    } = req.body
    if (!title || !code) {
        return res.json({
            message: 'จำเป็นต้องส่ง title และ code'
        })
    }
    try {
        const data = {
            title: title,
            code: code,
            content: content,
            active: active,
            standard: standard,
            user: user,
            requireSignature: requireSignature,
            signatures: signatures,
            status: status,
        }

        const new_term = new Term(data)
        const saved_term = await new_term.save()
        if (!saved_term) {
            return res.json({
                message: 'ไม่สามารถบันทึกข้อมูล'
            })
        }
        return res.json({
            message: 'success!',
            status: true,
            data: saved_term
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.update = async (req, res) => {
    const {
        title,
        code,
        content,
        active,
        standard,
        user,
        requireSignature,
        signatures,
        status,
    } = req.body

    const { id } = req.params
    
    try {
        let term = await Term.findById( id )
        if (!term) {
            return res.status(404).json({
                message: "ไม่พบข้อมูล"
            })
        }

        term.title = title || term.title
        term.code = code || term.code
        term.content = content || term.content
        term.active = active !== null || active !== undefined ? active : term.active
        term.standard = standard || term.standard
        term.user = user || term.user
        term.signatures = signatures || term.signatures
        term.status = status ? [...term.status, status] : term.status
        term.requireSignature = requireSignature || term.requireSignature

        const saved_term = await term.save()
        if (!saved_term) {
            return res.json({
                message: 'ไม่สามารถบันทึกข้อมูล'
            })
        }

        return res.json({
            message: 'success!',
            status: true,
            data: saved_term
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.getAll = async (req, res) => {
    try {
        const terms = await Term.find()

        return res.json({
            message: `data: ${terms.length}`,
            status: true,
            data: terms
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.getOne = async (req, res) => {
    const { id } = req.params
    try {
        const term = await Term.findById( id )
        if (!term) {
            return res.status(404).json({
                message: "ไม่พบข้อมูล",
            })
        }

        return res.json({
            message: `success`,
            status: true,
            data: term
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.getOneStandardByCode = async (req, res) => {
    const { code } = req.params
    try {
        const term = await Term.findOne( { code: code, standard: true, active: true } )
        if (!term) {
            return res.status(404).json({
                message: "ไม่พบข้อมูล",
            })
        }

        return res.json({
            message: `success`,
            status: true,
            data: term
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.getAllStandardByCode = async (req, res) => {
    const { code } = req.params
    try {
        const terms = await Term.find( { code: code, standard: true, active: true } )
        if (!terms.length) {
            return res.status(404).json({
                message: "ไม่พบข้อมูล",
            })
        }

        return res.json({
            message: `success`,
            status: true,
            data: terms
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.deleteOne = async (req, res) => {
    const { id } = req.params
    try {
        const term = await Term.findByIdAndDelete( id )
        if (!term) {
            return res.status(404).json({
                message: "ไม่พบข้อมูล",
            })
        }

        return res.json({
            message: `success`,
            status: true,
            data: term.deleteCount
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.createAcceptedTerm = async (req, res) => {
    const {
        term_id,
        user_ip,
        user_id,
        user_type,
        fromUrl
    } = req.body
    try {
        //const user_ip = 'https://api64.ipify.org?format=json'
        const data = { 
            term_id: term_id,
            user_id: user_id,
            user_ip: user_ip,
            user_type: user_type, //tossagun, //partner ...
            fromUrl: fromUrl
        }
        const new_accepted = new AcceptedTerm(data)
        const accepted = await new_accepted.save()
        if(!accepted) return res.status(500).json({ message: "can not save data to database" })
        
        return res.status(200).json({
            message: "Success",
            status: true,
            data: accepted
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

exports.getAcceptedTerms = async (req, res) => {
    try {
        const accepted = await AcceptedTerm.find()
        
        return res.status(200).json({
            message: "Success",
            status: true,
            data: accepted
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

exports.getUserAcceptedTerms = async (req, res) => {
    const { id } = req.params
    try {
        const accepteds = await AcceptedTerm.find({ 'user_id' : id })
        const acceptedTermIds = accepteds.map(term => term.term_id)
        let matchedTerms = await Term.find({ _id: { $in: acceptedTermIds } })

        matchedTerms = matchedTerms.map(term => term.toObject())

        matchedTerms.forEach(term => {
            const acc = accepteds.find(t => t.term_id.toString() === term._id.toString())
            term.standard = false
            term.acceptedAt = acc.createdAt
        })

        return res.status(200).json({
            message: `มีสัญญาทั้งหมด ${matchedTerms.length} ฉบับ`,
            status: true,
            data: matchedTerms
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}