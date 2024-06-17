import { useEffect, useState } from 'react'
import axios from 'axios'
import useAuth from '../../hooks/authHook'
import useVerified from '../../hooks/verifiedHook'
import useCsrfToken from '../../hooks/csrfTokenHook'
import AdminLayout from '../../layout/AdminLayout'
import useAdmin from '../../hooks/adminHook'
import dayjs from 'dayjs'
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
                await axios.get(`${env.VITE_API_BASE_URL}/admin/notifications`,{withCredentials:true,params:{page,pageSize:5}}).then((response) => {
                    if(response.status === 200){
                        if(shouldFetch){
							setNotifications(response.data.data)
                            setTotalPages(response.data.totalPages);
							setShouldfetch(false)
						}
                    }
                }).catch(err => {
                    setMessage(err.message)
                })
            } catch (error) {
                setMessage(error.message)
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
            <AdminLayout title='Notifications'>
                <HelmetProvider>
                    <Helmet>
                        <title>Admin|Notifications</title>
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
                            <div className="flex flex-row items-center gap-x-10">
                                <h3 className="text-lg font-bold">
                                    {values.data.title}
                                </h3>
                                <p className='text-xs font-semibold'>{dayjs(values.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                            </div>
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
            </AdminLayout>
        </>
    )
}
