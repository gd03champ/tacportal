import { mongoose } from "mongoose";
const Schema = mongoose.Schema;

const tacSchema = new Schema({

    //student entry data

    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    domain: {
        type: String,
        required: true,
        trim: true,
        enum: ["software", "hardware"] //if hardware choosen, user will be prompted to select dep in frontend and techstack will be asked accordingly in frontend
    },
    studentsCount: {
        type: Number,
        required: true
    },
    students: [{
        rollNumber: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        techStack: {
            type: String,
            required: true,
            trim: true
        }
    }],
    documentLink: {
        type: String,
        required: true,
        trim: true
    },


    // tac tracking data
    tacID: {
        type: String,
        unique: false,
        required: false,
        trim: true,
    },
    status: {
        type: String,
        default: "initiated",
        enum: ["initiated","approved", "rejected"]
    },
    remarks: {
        type: String,
        required: false,
        trim: true
    },
    appliedDate: {
        type: Date,
        required: true
    },
    approvedDate: {
        type: Date,
        required: false
    },
    rpClaimed: {
        type: Number,
        required: false
    },
    rpApproved: {
        type: Number,
        required: false
    },

    // appointment data
    isAppointmentBooked: {
        type: Boolean,
        required: false
    },
    appointmentDate: {
        type: Date,
        required: false
    },
    isEarlyAppointment: {
        type: Boolean,
        required: false
    },
}, {
    timestamps: true // Add createdAt and updatedAt timestamps automatically
});

const Tac = mongoose.model('Tac', tacSchema);
export default Tac;