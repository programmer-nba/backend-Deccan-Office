const MainCompany = require("../../../model/settings/admin/mainCompany_model")

exports.create = async (req, res) => {
    const {
        //username,
        //password,
        name,
        branch,
        tel,
        address,
        logo,
        stamp,
        status,
        //active
    } = req.body
    try {
        if (!name) return req.json({
            message: "จำเป็นต้องเพิ่มชื่อกิจการ"
        })

        const data = {
            //username: username,
            //password: password,
            name: name,
            branch: branch,
            tel: tel,
            address: address,
            logo: logo,
            stamp: stamp,
            status: status,
            //active: active
        }

        const new_mainCompany = new MainCompany(data)
        const saved_mainCompany = await new_mainCompany.save()
        if (!saved_mainCompany) return res.status(500).json({
            message: "can not save mainCompany"
        })

        return res.status(200).json({
            message: "Success!",
            status: true,
            data: saved_mainCompany
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            message: err.massage
        })
    }
}

exports.update = async (req, res) => {
    const {
        //username,
        //password,
        name,
        branch,
        tel,
        address,
        logo,
        stamp,
        status,
        active
    } = req.body

    const { id } = req.params
    try {
        let mainCompany = await MainCompany.findById( id )
        if (!mainCompany) return res.status(404).json({
            message: "mainCompany not founded!"
        })

        mainCompany.name = name || mainCompany.name
        mainCompany.branch = branch || mainCompany.branch
        mainCompany.tel = tel || mainCompany.tel
        mainCompany.address = address || mainCompany.address
        mainCompany.logo = logo || mainCompany.logo
        mainCompany.stamp = stamp || mainCompany.stamp
        mainCompany.status = status || mainCompany.status
        mainCompany.active = active || mainCompany.active

        const saved_mainCompany = await mainCompany.save()
        if (!saved_mainCompany) return res.status(500).json({
            message: "can not save mainCompany"
        })

        return res.status(200).json({
            message: "Success!",
            status: true,
            data: saved_mainCompany
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            message: err.massage
        })
    }
}

exports.get = async (req, res) => {
    const { id } = req.params
    try {
        const mainCompany = await MainCompany.findById( id )
        if (!mainCompany) return res.status(404).json({
            message: "mainCompany not founded!"
        })

        return res.status(200).json({
            message: "Success!",
            status: true,
            data: mainCompany
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            message: err.massage
        })
    }
}

exports.delete = async (req, res) => {
    const { id } = req.params
    try {
        const mainCompany = await MainCompany.findByIdAndDelete( id )
        if (!mainCompany) return res.status(404).json({
            message: "mainCompany not founded!"
        })

        return res.status(200).json({
            message: "Success!",
            status: true,
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            message: err.massage
        })
    }
}