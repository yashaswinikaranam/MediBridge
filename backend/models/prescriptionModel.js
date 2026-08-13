import mongoose from 'mongoose'

const prescriptionSchema = new mongoose.Schema({
    appointmentId: {
        type: String,
        required: true,
        unique: true
    },

    userId: {
        type: String,
        required: true
    },

    docId: {
        type: String,
        required: true
    },

    diagnosis: {
        type: String,
        required: true
    },

    medicines: [
        {
            medicineName: {
                type: String,
                required: true
            },

            dosage: {
                type: String,
                required: true
            },

            frequency: {
                type: String,
                required: true
            },

            duration: {
                type: String,
                required: true
            },

            instructions: {
                type: String,
                default: ''
            }
        }
    ],

    additionalNotes: {
        type: String,
        default: ''
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})


const prescriptionModel = mongoose.models.prescription || mongoose.model(
    'prescription',
    prescriptionSchema
)

export default prescriptionModel