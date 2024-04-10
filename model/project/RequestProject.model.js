const mongoose = require('mongoose');

const RequestProjectSchema = new mongoose.Schema({
    Project_id : { type : String, required : false },
    Title : { type : String, required : false },
    Type : { type : String, required : false },
    Sub_type : { type : String, required : false },
    Detail : { type : String, required : false },
    Start_date : { type : Date, required : false, default : Date.now() },
    Due_date : { type : Date, required : false },
    Refs : [{
        refs : { type : String, required : false }
    }],
    Remark : { type : String, required : false },
    Customer : {
        cutomer_id : { type : String, required : false },
        customer_name : { type : String, required : false },
        customer_type : { type : String, required : false },
        customer_tel : { type : String, required : false }
    },
    Status : [{
        status_code : { type : String, required : false },
        status_name : { type : String, required : false },
        sender : { type : String, required : false },
        create_at : { type : Date, required : false }
    }]

}, { versionKey: false });

RequestProjectSchema.pre('save', async function (next) {
    try {
        const project = this;
        const findNumber = await RequestProject.find();

        let length = findNumber.length + 1;

        let data;
        if (project.Type == 'Programmer') {
            data = 'DEV';
        } else if (project.Type == 'Graphic') {
            data = 'GRP';
        } else if (project.Type == 'A') {
            data = 'B';
        } else {
            return next(new Error('Invalid project Type'));
        }

        const ProjectNumberString = data + String(length).padStart(7, '0');
        project.Project_id = ProjectNumberString;

        next();
    } catch (err) {
        console.error(err);
        next(err);
    }
});


module.exports = mongoose.model('RequestProject', RequestProjectSchema);