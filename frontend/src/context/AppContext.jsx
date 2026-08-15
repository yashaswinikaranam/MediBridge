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
    const [notifications,setNotifications] = useState([])
   

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

    const getNotifications = async () => {

    try {

        const { data } = await axios.get(
            backendUrl + "/api/notifications/user",
            {
                headers: { token }
            }
        )

        if (data.success) {
            setNotifications(data.notifications)
        }

    } catch (error) {

        console.log(error)

    }
}

const markNotificationRead = async (notificationId) => {

    try {

        const { data } = await axios.post(
            backendUrl + "/api/notifications/user/read",
            {
                notificationId
            },
            {
                headers: { token }
            }
        )

        if (data.success) {
            setNotifications(prev =>
                prev.map(notification =>
                    notification._id === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                )
            )
        }

    } catch (error) {

        console.log(error)

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
        loadUserProfileData,
        notifications,
getNotifications,
markNotificationRead
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

    useEffect(()=> {
        if(token) {
            getNotifications()
        }
    },[token])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider