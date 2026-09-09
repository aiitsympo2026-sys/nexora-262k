const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
    {
        event: {
            type: String,
            required: true
        },

        score: {
            type: Number,
            default: null
        }
    },
    {
        _id: false
    }
);

const registrationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        college: {
            type: String,
            required: true
        },

        department: {
            type: String,
            required: true
        },

        year: {
            type: String,
            required: true
        },

        mobile: {
            type: String,
            required: true,
            unique: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        food: {
            type: String,
            required: true
        },
        attendance: {
    type: String,
    enum: ["Present", "Absent"],
    default: "Absent"
},

        events: {
            type: [String],
            required: true
        },

        scores: {
            type: [scoreSchema],
            default: []
        },

        payment: {
            type: String,
            enum: ["Online", "Offline"],
            required: true
        },
        transactionId: {
    type: String,
    default: ""
},

       
        registrationCode: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Registration",
    registrationSchema
);