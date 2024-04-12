const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const techStackSchema = new Schema({
    department: {
        type: String,
        required: false,
        enum: ["software","ece", "eee", "mech", "auto"],
    },
    techStacks: [{
        techStack: {
            type: String,
            required: true,
            trim: true
        }
    }],
}, {
    timestamps: true // Add createdAt and updatedAt timestamps automatically
});