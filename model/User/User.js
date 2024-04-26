const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    citizen_id: { 
        type: String, 
        required: false 
    },
    user_password: { 
        type: String, 
        required: false 
    },
    name: { 
        type: String, 
        required: false 
    },
    gender: { 
        type: String, 
        required: false 
    },
    birth: { 
        type: Date, 
        required: false 
    },
    tel: { 
        type: String, 
        required: false 
    },
    statusdetail: {
        type: [{
            status: { 
                type: String, 
                required: false,
                default : "ใหม่"
            },
            date: { 
                type: Date, 
                required: false, 
                default: Date.now() 
            },
        }],
        required: false,
        default: null
    },
    role: { 
        type: String, 
        default: 'User' 
    }, 
    
    insert_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model('User', UserSchema);
