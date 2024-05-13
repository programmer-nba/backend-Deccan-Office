const mongoose = require('mongoose')
const { Schema } = mongoose

const mainCompanySchema = new Schema(
    {
        username: { type: String, require: false },
        password: { type: String, require: false },
        name: { type: String, require: true },
        branch: { type: String, default: null },
        tel: { type: Array, default: [] },
        address: {
            houseNo: { type: String, default: null },
            province: { type: String, default: null },
            district: { type: String, default: null },
            subDistrict: { type: String, default: null },
            street: { type: String, default: null },
            soi: { type: String, default: null },
            postcode: { type: Number, default: null },
            full: { type: String, default: null }
        },
        logo: { type: String, default: null },
        stamp: { type: Array, default: null },
        status: { type: Array, default: [] },
        active: { type: Boolean, default: true }
    },
    {
        timestamps: true
    }
)

const MainCompany = mongoose.model("MainCompany", mainCompanySchema)
module.exports = MainCompany