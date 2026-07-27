import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import {toast} from 'react-toastify'
import axios from "axios";

const Appointment = () => {

  const navigate = useNavigate()

  const {docId}=useParams();
  const {doctors, currencySymbol, backendUrl, token, getDoctorsData} = useContext(AppContext);
  const daysOfWeek=['SUN','MON','TUE','WED','THU','FRI','SAT']

  const getAvailableSlots = async()=> {
    setDocSlots([])

    let today=new Date()
    for(let i=0;i<7;i++) {
      let currentDate=new Date(today)
      currentDate.setDate(today.getDate()+i)

      //setting endtime of the date with index
      let endTime=new Date()
      endTime.setDate(today.getDate()+i)
      endTime.setHours(21,0,0,0)

      //setting hours
      if(today.getDate()===currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours()>10?currentDate.getHours()+1:10)
        currentDate.setMinutes(currentDate.getMinutes()>30?30:0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }
      let timeSlots=[]

      while(currentDate<endTime) {
        let formattedTime = currentDate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) 

        let day = currentDate.getDate()
        let month = currentDate.getMonth()+1
        let year = currentDate.getFullYear()

        const slotDate = day+"_"+month+"_"+year
        const slotTime = formattedTime

        const isSlotAvailable = docInfo?.slots_booked?.[slotDate]
  ? !docInfo.slots_booked[slotDate].includes(slotTime)
  : true;
        if(isSlotAvailable) {
          //add slot to array
          timeSlots.push({
          datetime:new Date(currentDate),
          time:formattedTime
        })
  
        }
        
        

        //increment current time by 30 min
        currentDate.setMinutes(currentDate.getMinutes()+30)
      }
      setDocSlots(prev=>([...prev,timeSlots]))
    }
  }

  const [docInfo,setDocInfo] = useState(null);
  const [docSlots,setDocSlots] = useState([])
  const [slotIndex,setSlotIndex] = useState(0)
  const [slotTime,setSlotTime] = useState('')

  const fetchDocInfo = async()=> {
    const docInfo = doctors.find(doc=>doc._id===docId)
    setDocInfo(docInfo)
    console.log(docInfo)
  }

  useEffect(()=> {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDocInfo()
  },[doctors,docId])

  useEffect(()=> {
    if(docInfo) {
    getAvailableSlots()
    }
  },[docInfo])

  useEffect(()=> {
    console.log(docSlots)
  },[docSlots])

  console.log("docInfo:", docInfo)
console.log("slots_booked:", docInfo?.slots_booked)
  const bookAppointment = async()=> {
    if(!token) {
      toast.warn('Login to book appointment')
      navigate('/login')
    }

    try {
      const selectedDaySlots = docSlots[slotIndex]

if (!selectedDaySlots || selectedDaySlots.length === 0) {
  toast.error("No available slots for selected day")
  return
}

const date = selectedDaySlots[0].datetime
      let day = date.getDate()
      let month = date.getMonth()+1
      let year = date.getFullYear()

      const slotDate = day+"_"+month+"_"+year
      const {data} = await axios.post(backendUrl+'/api/user/book-appointment',{docId,slotDate,slotTime} , {headers:{token}})
      if(data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch(error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  return docInfo && (
    <div>
      {/*----------DOCTOR DETAILS------------------- */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img className="bg-primary rounded-lg w-full sm:max-w-72" src={docInfo.image} alt="" />
        </div>
        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          {/*----------DOCTOR NAME,DEGREE,EXPERIENCE--------------*/}
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">{docInfo.name}
            <img className="w-5" src={assets.verified_icon} alt="" />
          </p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
          </div>

          {/*------DOCTOR ABOUT-------------*/}
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
              About <img src={assets.info_icon} alt="" /></p>
            <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
          </div>
          <p className="text-gray-500 font-medium mt-4">
            Appointment fee: <span className="text-gray-600">{currencySymbol} {docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/*-----BOOKING SLOTS--------------*/}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Booking slots</p>
        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {
            docSlots.length && docSlots.map((item,index)=>(
              <div onClick={()=>setSlotIndex(index)} className={`text-center rounded-full min-w-16 py-6 cursor-pointer ${slotIndex===index ? 'text-white bg-primary':'border border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
            ))
          }
        </div>
        <div className="flex items-center mt-4 overflow-x-scroll w-full gap-3">
          {
            docSlots.length && docSlots[slotIndex].map((item)=>(
              <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time===slotTime? 'bg-primary text-white':'border border-gray-400 text-gray-400'}`}>
                {item.time.toLowerCase()}
              </p>
            ))
          }
        </div>
        <div>
          <button onClick={bookAppointment} className="bg-primary text-white px-14 py-3 text-sm font-light rounded-full my-6">Book an appointment</button>
        </div>
      </div>
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  )
}

export default Appointment