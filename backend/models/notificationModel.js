import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    recipientType: {
        type: String,
        enum: ["User", "Doctor"],
        required: true
    },

    title: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    type: {
        type: String,
        default: "appointment"
    },

    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment"
    },

    isRead: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
})

const notificationModel =
    mongoose.models.Notification ||
    mongoose.model("Notification", notificationSchema)

export default notificationModel