import React, { useEffect, useState } from 'react'
import axios from 'axios'
import useAuth from '../../hooks/authHook'
import useVerified from '../../hooks/verifiedHook'
import useCsrfToken from '../../hooks/csrfTokenHook'
import AdminLayout from '../../layout/AdminLayout'
import useAdmin from '../../hooks/adminHook'
import { Helmet, HelmetProvider } from 'react-helmet-async'
const env = import.meta.env

export default function AdminNotification() {
    useAuth()
    useVerified()
    useAdmin()
    const token = useCsrfToken();
    const [notifications,setNotifications] = useState([]);
    const [message,setMessage] = useState("");
    const [shouldFetch,setShouldfetch] = useState(true);

    const markAsRead = (id) => {
        try {
            axios.post(`${env.VITE_API_BASE_URL}/users/notifications/markasread/${id}`,{CSRFToken:token},{withCredentials:true}).then((response) => {
                if(response.status === 200){
                    setMessage(response.data.message)
                    setShouldfetch(true);
                }
            }).catch(err => {
                setMessage(err.message)
            })
        } catch (error) {
            setMessage(err.message)
        }
    }

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                await axios.get(`${env.VITE_API_BASE_URL}/admin/notifications`,{withCredentials:true}).then((response) => {
                    if(response.status === 200){
                        if(shouldFetch){
							setNotifications(response.data.data)
							setShouldfetch(false)
						}
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
        fetchNotifications()
    },[shouldFetch])
    return (
        <>
            <AdminLayout title='Notifications'>
                <HelmetProvider>
                    <Helmet>
                        <title>Admin|Notifications</title>
                    </Helmet>
                </HelmetProvider>
                <div className="flex flex-col gap-y-2">
                    {message != "" ? (
                        <>
                            <div className="flex flex-col p-2 w-full bg-green-600 rounded">
                                <p className="text-white text-md font-semibold">
                                    {message}
                                </p>
                            </div>
                        </>
                    ):""}
                    {notifications && notifications.map((values,index) => (
                        <div key={values.id} className="flex flex-col w-full p-3 border-l-4 gap-y-3">
                            <h3 className="text-lg font-bold">
                                {values.data.title}
                            </h3>
                            <p className='text-sm font-semibold'>
                                {values.data.message}
                            </p>
                            <div className="flex flex-row gap-x-5">
                                <span onClick={() => markAsRead(values.id)} className="text-sm underline">Mark as read</span>
                                {/* <span onClick={() => markAsRead(values.id)} className="text-sm underline">Delete</span> */}
                            </div>
                        </div>
                    ))}
                </div>
            </AdminLayout>
        </>
    )
}
