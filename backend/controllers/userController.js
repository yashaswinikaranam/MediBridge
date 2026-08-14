import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'
import prescriptionModel from '../models/prescriptionModel.js'


//API to register user
const registerUser = async(req,res) => {
    try {
        const {name,email,password} = req.body
        if(!name || !email || !password) {
            return res.json({success:false,message:"Missing details"})
        }
        if(!validator.isEmail(email)) {
            return res.json({success:false,message:"Enter a valid email"})
        }
        if(password.length<8) {
            return res.json({success:false,message:"Enter strong pass"})
        }
        //HASHING USER PASSWORD
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const userData = {
            name,email,
            password:hashedPassword
        }

        const newUser= new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
        res.json({success:true,token})
    } catch(error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const loginUser = async(req,res)=> {
    try {
        const {email,password} = req.body
        const user=await userModel.findOne({email})

        if(!user) {
        return res.json({success:false,message:error.message})
        }

        const isMatch=await bcrypt.compare(password,user.password)

        if(isMatch) {
            const token=jwt.sign(
                {
                    id:user._id
                },
                process.env.JWT_SECRET
            )
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Invalid Credentials"})
        }
    }catch(error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to get user profile data
const getProfile = async(req,res)=> {
    try {
        const userId = req.userId;
        const userData = await userModel.findById(userId).select('-password')

        res.json({success:true,userData})
    }catch(error) {
         console.log(error)
        res.json({success:false,message:error.message})
    }
}

const updateProfile = async(req,res)=> {
    try {
        const userId=req.userId;
        const { name, phone, address, dob, gender} = req.body
        const imageFile = req.file
        if(!name || !phone || !dob || !gender) {
            return res.json({success:false,message:"Data missing"})
        }
        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender},{new:true})

        if(imageFile) {
            //upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(
                imageFile.path,
                {
                    resource_type:'image'
                }
            )

            const imageURL = imageUpload.secure_url

        await userModel.findByIdAndUpdate(userId,{image:imageURL})
        }
        res.json({success:true,message:"Profile updated!"})
        
    } catch(error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to book appointment
const bookAppointment = async(req,res)=> {
    try {
        const userId = req.userId;
        const {docId, slotDate, slotTime } = req.body;
        const docData = await doctorModel.findById(docId).select('-password')

        if(!docData.available) {
            return res.json({success:false,message:"Doctor not available"})
        }

        let slots_booked = docData.slots_booked
        //checking for slot availability

        if(slots_booked[slotDate]) {
            if(slots_booked[slotDate].includes(slotTime)) {
                return res.json({success:false,message:"Slot not available"})
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate]=[]
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        const docDataPlain = docData.toObject()
delete docDataPlain.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData:docDataPlain,
            amount:docData.fees,
            slotTime,
            slotDate,
            date:Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        //save new slots in docdata
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:"Appointment booked"})
    } catch(error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to get user appointments
const listAppointments = async(req,res)=> {
    try {
        const userId = req.userId;
        const appointments = await appointmentModel.find({userId})

        const appointmentsWithPrescription = await Promise.all(
            appointments.map(async (appointment)=> {
                const prescription = await prescriptionModel.findOne({
                    appointmentId:appointment._id.toString()
                })
                return {
                    ...appointment.toObject(),
                    hasPrescription: !!prescription
                }
            })
        )

        res.json({success:true,appointmentsWithPrescription})

    } catch(error) {
         console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to cancel appointment
const cancelAppointment = async(req,res)=> {
    try {
        const userId = req.userId;
        const {appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        //verify appointment user
        if(appointmentData.userId!==userId) {
            return res.json({success:false,message:"Unauthorized action"})
        }

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



//API to make payment for appointment
const paymentRazorpay = async(req,res) => {

}

const getPrescriptions = async(req,res) => {
    try {
    const userId = req.userId 
    const prescriptions = await prescriptionModel.find({userId})
    if(!prescriptions) {
        return res.json({success:false,message:'No prescription'})
    }
    res.json({success:true,prescriptions})
}   catch(error) {
    res.json({success:false,message:error.message})
}
}

export {getPrescriptions,registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment}