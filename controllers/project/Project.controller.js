const RequestProject = require ('../../model/project/RequestProject.model')

//Get RequestProject
exports.getRequestProject = async (req, res, next) => {
    try {
        const requestproject = await RequestProject.find();
        return res.json({
            message: 'Get RequestProject data successfully!',
            status: true,
            data: requestproject
        });
    } catch (err) {
        console.log(err)
        return res.json({
            message: ('Can not get RequestProject data', err.message),
            status: false,
            data: null
        })
    }
}