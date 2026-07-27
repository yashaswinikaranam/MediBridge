import express from 'express'
import cors from 'cors'
import 'dotenv/config' 

//CONNECT CONFIGURATION FILES TO CONNECT TO THEM
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

const app=express()
const port=process.env.port || 4000

//CONNECTING NODEJS TO MONGODB VIA MONGOOSE LIBRARY
connectDB();
connectCloudinary()

//MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

//API ENDPOINTS
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

app.get('/',(req,res)=> {
    res.send('API WORKING')
})

app.listen(port,()=> {
    console.log('SERVER STARTED')
})