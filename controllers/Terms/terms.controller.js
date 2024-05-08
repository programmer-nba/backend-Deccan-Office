const Term = require("../../model/Terms/terms.model")

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
        term.active = active || term.active
        term.standard = standard || term.standard
        term.user = user || term.user
        term.signatures = signatures || term.signatures
        term.status = status || term.status
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