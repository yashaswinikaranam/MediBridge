import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'

//API FOR ADDING DOCTORS
const addDoctors = async(req,res)=> {
    try {
        const {name, email, password, experience, fees, about, speciality, degree, address} = req.body;
        const imageFile=req.file;
        console.log(req.body)
console.log(req.file)
    // CHECKING FOR VALID AND PROPER DOCTOR DATA
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !imageFile) {
            return res.json({
                success:false,
                message:"Missing details"
            })
        }
        if(!validator.isEmail(email)) {
            return res.json({
                success:false,
                message:"Please enter a valid email"
            })
        }
        if(password.length<8) {
            return res.json({
                success:false,
                message:"Please enter a strong password atleast 8 chars"
            })
        }
        //HASHING DOCTOR PASSWORD
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        //UPLOAD IMAGE TO CLOUDINARY
        const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        const imageUrl=imageUpload.secure_url

        const doctordata = { name, email, image:imageUrl, password:hashedPassword, speciality, degree, experience, about, fees, address:JSON.parse(address), date: Date.now()}

        const newDoctor=new doctorModel(doctordata);
        await newDoctor.save()

        res.json({
            success:true,
            message:'New Doctor added!'
        })
        //console.log({name, email, password, speciality, degree, experience, about, fees, address, imageFile})
    } catch(e) {
        console.log('Error!')
        res.json({
            success:false,
            message:e.message
        })
    }
}

//API FOR ADMIN LOGIN
const loginAdmin = async(req,res)=> {
    try {
        console.log("body: "+req.body)
        const {email,password} = req.body;
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD) {
            const token=jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        } else {
            res.json({
                success:false,
                message:'Invalid Credentials!'
            })
        }
    } catch(e) {
        console.log('Error!')
        res.json({
            success:false,
            message:e.message
        })
    }
}

//API to get all doctors list for admin panel
const allDoctors = async(req,res)=> {
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
    } catch(error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to get all appointments list
const appointmentsAdmin = async(req,res) => {
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true,appointments})
    }   catch(error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to cancel appointments
const appointmentCancel = async(req,res)=> {
    try {
        const {appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)


        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

        //releasing doctor slot
        const {docId,slotDate,slotTime} = appointmentData
        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e=>e!==slotTime)

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:'Appointment cancelled'})
    } catch(error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to get dashboard for admin panel
const adminDashboard = async(req,res)=> {
    try {
        const doctors=await doctorModel.find({})
        const users=await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }

        res.json({success:true,dashData})
    } catch(error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


export {addDoctors, loginAdmin, allDoctors,appointmentsAdmin, appointmentCancel, adminDashboard}