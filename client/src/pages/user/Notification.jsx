import { useEffect, useState } from 'react'
import AppLayout from '../../layout/AppLayout'
import axios from 'axios'
import useAuth from '../../hooks/authHook'
import useVerified from '../../hooks/verifiedHook'
import useUser from '../../hooks/userHook'
import useCsrfToken from '../../hooks/csrfTokenHook'
import { Helmet, HelmetProvider } from 'react-helmet-async'
const env = import.meta.env

export default function Notification() {
    useAuth()
    useVerified()
    useUser()
    const token = useCsrfToken();
    const [notifications,setNotifications] = useState([]);
    const [message,setMessage] = useState("");
    const [shouldFetch,setShouldfetch] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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
            setMessage(error.message)
        }
    }

    useEffect(() => {
        const fetchNotifications = async (page) => {
            try {
                await axios.get(`${env.VITE_API_BASE_URL}/users/notifications`,{withCredentials:true,params:{page,pageSize:5}}).then((response) => {
                    if(response.status === 200){
                        if(shouldFetch){
							setNotifications(response.data.data)
                            setTotalPages(response.data.totalPages);
							setShouldfetch(false)
						}
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
        fetchNotifications(currentPage)
    },[shouldFetch,currentPage])
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        setShouldfetch(true)
    };
    return (
        <>
            <AppLayout title='Notifications'>
                <HelmetProvider>
                    <Helmet>
                        <title>Notifications</title>
                    </Helmet>
                </HelmetProvider>
                <div className="flex flex-col gap-y-2">
                    {message != "" ? (
                        <>
                            <div className="flex flex-col w-full p-2 bg-green-600 rounded">
                                <p className="font-semibold text-white text-md">
                                    {message}
                                </p>
                            </div>
                        </>
                    ):""}
                    {notifications && notifications.map((values) => (
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
                    <div className='flex flex-row items-center gap-x-2'>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className='flex p-1 rounded w-fit bg-cyan-300'
                        >
                            Previous
                        </button>
                        <span>{`Page ${currentPage} of ${totalPages}`}</span>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className='flex p-1 rounded w-fit bg-cyan-300'
                        >
                            Next
                        </button>
                    </div>
                </div>
            </AppLayout>
        </>
    )
}
