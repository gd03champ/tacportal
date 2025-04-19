import { mongoose } from "mongoose";
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    userId: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String, 
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ["info", "success", "warning", "error"],
        default: "info"
    },
    isRead: {
        type: Boolean,
        default: false
    },
    relatedId: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
