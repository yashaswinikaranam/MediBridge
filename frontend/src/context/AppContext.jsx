import { createContext } from "react";
import axios from 'axios'
import { useState } from "react";
import { useEffect } from "react";
import {toast} from 'react-toastify'

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext=createContext()

const currencySymbol='$'
const backendUrl=import.meta.env.VITE_BACKEND_URL
// eslint-disable-next-line react-hooks/rules-of-hooks


const AppContextProvider = (props) => {
    const [doctors,setDoctors] = useState([])
    const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'')
    const [userData,setUserData] = useState(false)
   

    const getDoctorsData = async()=> {
        try {
            const {data} = await axios.get(backendUrl+'/api/doctor/list')
            if(data.success) {
                setDoctors(data.doctors)
                console.log(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch(error) {
            toast.error(error.message)
        }
    }

    const loadUserProfileData = async()=> {
        try {
            const {data} = await axios.get(backendUrl+'/api/user/get-profile',{headers:{token}})
            if(data.success){
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }
        } catch(error) {
            console.log(error)
            toast.error(error.message)
        }
    }

     const value={
        doctors,getDoctorsData,
        currencySymbol,
        token,setToken,
        backendUrl,
        userData,setUserData,
        loadUserProfileData
    }

    useEffect(()=> {
        if(token) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            loadUserProfileData()
        }
    },[token])

    useEffect(()=> {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        getDoctorsData()
    },[])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider