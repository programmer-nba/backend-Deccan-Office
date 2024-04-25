const Agreement = require ('../../model/Agreement/Agreement')

//Get Agreement
exports.getallAgreement = async (req, res, next) => {
    try {
        const agreement = await Agreement.find();
        return res.json({
            message: 'Get Agreement data successfully!',
            status: true,
            data: agreement
        });
    } catch (err) {
        console.log(err)
        return res.json({
            message: ('Can not get types data', err.message),
            status: false,
            data: null
        })
    }
}

//Insert Agreement
exports.InsertAgreement = async (req, res, next) => {
    console.log(req.decoded)
    const userid = req.decoded.id
    try {
        const { argument_type, argument_detail, argument_username, argument_idcard, argument_position, argument_salary, argument_timeout} = req.body
        const argument = new Agreement({
            argument_type : argument_type,
            argument_detail : argument_detail,
            argument_username : argument_username,
            argument_idcard : argument_idcard,
            argument_position : argument_position,
            argument_salary : argument_salary, //Number
            argument_timeout : argument_timeout,
            argument_timeline : [{
                timeline_userid : userid,
                timeline : Date.now(),
                action : "เพิ่มข้อมูล"
            }]
        })
        const saved_argument = await argument.save()
        if (!saved_argument) {
            return res.json({
                message: 'can not save argument',
                status: false,
                data: null
            })
        }
        return res.json({
            message: 'Insert argument successfully!',
            status: true,
            data: saved_argument
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            message: err.message,
            status: false,
            data: null
        })
    }
};

//Update Agreement
exports.updateAgreement = async (req, res, next) => {
    try {
        const agreement = await Agreement.findByIdAndUpdate(req.params.id, req.body);
        const userid = req.decoded.id

        const timelineEntry = {
            timeline_userid: userid,
            timeline: Date.now(),
            action: "แก้ไขข้อมูล"
        };

        agreement.argument_timeline.push(timelineEntry);
        await agreement.save();
        
        return res.json({
            message: 'Update agreement successfully!',
            status: true,
            data: agreement
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            message: err.message,
            status: false,
            data: null
        })
    }
};

//Delete Agreement
exports.DeleteAgreement = async (req, res, next) =>{
    try {
        const agreement = await Agreement.findByIdAndDelete(req.params.id);
        res.json({
            message: 'Delete agreement successfully!',
            status: true,
            data: agreement
        });
    } catch (err) {
        console.log(err)
        return res.json({
            message: err.message,
            status: false,
            data: null
        })
    }
};

//Update Agreement User
exports.updateAgreementUser = async (req, res, next) => {
    try {
        const agreement = await Agreement.findByIdAndUpdate(req.params.id, req.body);
        const status = req.body
        const userid = req.decoded.id
        
        const timelineEntry = {
            timeline_userid: userid,
            timeline: Date.now(),
            action: status
        };

        agreement.argument_timeline.push(timelineEntry);
        argument_status = status

        await agreement.save();
        
        return res.json({
            message: 'Update agreement successfully!',
            status: true,
            data: agreement
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            message: err.message,
            status: false,
            data: null
        })
    }
};