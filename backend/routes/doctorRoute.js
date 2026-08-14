import express from 'express'
import { createPrescription, getPrescriptions, doctorList , loginDoctor, appointmentsDoctor, appointmentCancel, appointmentComplete, doctorDashboard, doctorProfile, updateProfile} from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'

const doctorRouter = express.Router()

doctorRouter.get('/list',doctorList)
doctorRouter.post('/login',loginDoctor)
doctorRouter.get('/appointments',authDoctor,appointmentsDoctor)
doctorRouter.post('/complete-appointment',authDoctor,appointmentComplete)
doctorRouter.post('/cancel-appointment',authDoctor,appointmentCancel)
doctorRouter.get('/dashboard',authDoctor,doctorDashboard)
doctorRouter.get('/profile',authDoctor,doctorProfile)
doctorRouter.post('/update-profile',authDoctor,updateProfile)
doctorRouter.post('/create-prescription',authDoctor,createPrescription)
doctorRouter.get('/prescription/:appointmentId',authDoctor,getPrescriptions)

export default doctorRouter