import { useEffect, useState } from 'react'
import { Bars3Icon, BellAlertIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import useCsrfToken from '../hooks/csrfTokenHook';
import PropTypes from 'prop-types';

function AdminLayout({children,title = ""}) {
    const navigate = useNavigate();
    const [open,setMenu] = useState(false);
    const [noti,setNoti] = useState(false);
    const [notifications,setNotifications] = useState([])
    const token = useCsrfToken();
    const env = import.meta.env;
    function openMenu(){
        if(!open){
            setMenu(true)
        }
        else{
            setMenu(false)
        }
    }

    function showNotifications(){
        if(!noti){
            setNoti(true)
            setMenu(false)
        }
        else{
            setNoti(false)
        }
    }
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                await axios.get(`${env.VITE_API_BASE_URL}/admin/notifications`,{withCredentials:true}).then((response) => {
                    if(response.status === 200){
                        setNotifications(response.data.data)
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
        fetchNotifications()
    },[env.VITE_API_BASE_URL])

    async function logout(){
        try {
            await axios.post(`${env.VITE_API_BASE_URL}/auth/logout`,{CSRFToken:token},{withCredentials:true}).then((response) => {
            if(response.data.signout === true){
                navigate('/login')
            }
        })
        } catch (error) {
            console.log(error);
        }
    }
    return (
            <>
                <main className=''>
                    <nav className='flex flex-row items-center justify-between px-2 py-3 border-b md:px-20 md:justify-end border-b-gray-100'>
                        <div className="flex md:hidden">
                            {open ? (
                                <XMarkIcon className='text-gray-600 size-6' onClick={openMenu} />
                            ): (
                                <Bars3Icon className='text-gray-600 size-6' onClick={openMenu} />
                            )}
                        </div>
                        {/* mobile view nav */}
                        <div className="relative flex flex-row items-center gap-x-2 md:hidden">
                            <div className="relative flex">
                                {notifications.length !== 0 ? (
                                    <div className="absolute right-0 w-2 h-2 p-1 bg-red-600 rounded-full"></div>
                                ):""}
                                <BellAlertIcon className='text-gray-600 cursor-pointer size-6' onClick={showNotifications}/>
                                {!noti ? '': (
                                    <>
                                        <div className="flex flex-col absolute bg-white rounded-lg py-5 ring-1 ring-gray-400 shadow-xl top-full right-full w-[12rem] z-20">
                                            <div className="flex items-center justify-center px-2 border-b border-b-gray-600">
                                                <p className="text-xs font-semibold uppercase">Notifications</p>
                                            </div>
                                            <div className="flex flex-col w-full px-2 divide-y">
                                                {notifications && notifications.map((notification) => (
                                                    <div key={notification.id} className="flex flex-col w-full">
                                                        <p className="text-xs font-semibold text-gray-600">{notification.data.title}</p>
                                                        <p className="text-xs font-light text-gray-600">
                                                            {notification.data.message}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-center px-2 border-t border-b-gray-600">
                                                <NavLink to={"/admin-notifications"}>
                                                    <p className="text-xs font-semibold uppercase">View All</p>
                                                </NavLink>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="flex rounded-full">
                                <NavLink to={"/admin-profile"}>
                                    <UserCircleIcon className='text-gray-600 size-6' />
                                </NavLink>
                            </div>
                        </div>
                        <div className="items-center justify-between hidden w-full md:flex">
                            <div className="flex rounded-full">
                                <img src='/vite.svg' alt='Logo' />
                            </div>
                            <div className="flex items-center gap-x-5">
                                <div className="flex flex-row gap-x-2">
                                    <NavLink to={"/admin"}>
                                        {({isActive}) => (
                                            <span className={`flex p-2 cursor-pointer hover:bg-cyan-500/20 rounded-md ${isActive ? 'bg-cyan-500/20':''}`}>Home</span>
                                        )}
                                    </NavLink>
                                    <NavLink to={"/admin-payments"}>
                                        {({isActive}) => (
                                            <span className={`flex p-2 cursor-pointer hover:bg-cyan-500/20 rounded-md ${isActive ? 'bg-cyan-500/20':''}`}>Payments</span>
                                        )}
                                    </NavLink>
                                    <NavLink to={"/endpoint"}>
                                        {({isActive}) => (
                                            <span className={`flex p-2 cursor-pointer hover:bg-cyan-500/20 rounded-md ${isActive ? 'bg-cyan-500/20':''}`}>Endpoint</span>
                                        )}
                                    </NavLink>
                                    <div onClick={logout} className="flex p-2 rounded-md cursor-pointer hover:bg-cyan-500/20">Logout</div>
                                </div>
                                <div className="relative flex">
                                    {notifications.length !== 0 ? (
                                        <div className="absolute right-0 w-2 h-2 p-1 bg-red-600 rounded-full"></div>
                                    ):""}
                                    <BellAlertIcon className='text-gray-600 cursor-pointer size-6' onClick={showNotifications}/>
                                    {!noti ? '': (
                                        <>
                                            <div className="flex flex-col absolute bg-white rounded-lg py-5 ring-1 ring-gray-400 shadow-xl top-full right-full w-[20rem] z-20">
                                                <div className="flex items-center justify-center px-2 border-b border-b-gray-600">
                                                    <p className="text-xs font-semibold uppercase">Notifications</p>
                                                </div>
                                                <div className="flex flex-col w-full px-2 divide-y">
                                                    {notifications && notifications.map((notification) => (
                                                        <div key={notification.id} className="flex flex-col w-full">
                                                            <p className="text-xs font-semibold text-gray-600">{notification.data.title}</p>
                                                            <p className="text-xs font-light text-gray-600">
                                                                {notification.data.message}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex items-center justify-center px-2 border-t border-b-gray-600">
                                                    <NavLink to={"/admin-notifications"}>
                                                        <p className="text-xs font-semibold uppercase">View All</p>
                                                    </NavLink>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="flex rounded-full">
                                    <a href="/admin-profile">
                                        <UserCircleIcon className='text-gray-600 cursor-pointer size-6' />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </nav>
                    {!open ? '' : (
                        <>
                            <div className="flex flex-col bg-cyan-600 rounded-b-md">
                                <ul className='flex flex-col divide-y divide-gray-100 gap-y-1'>
                                    <NavLink to={"/admin"}>
                                        <li className='px-5 py-1 hover:bg-gray-100'>Home</li>
                                    </NavLink>
                                    <NavLink to={"/endpoint"}>
                                        <li className='px-5 py-1 hover:bg-gray-100'>Endpoint</li>
                                    </NavLink>
                                    <NavLink to={"/admin-payments"}>
                                        <li className='px-5 py-1 hover:bg-gray-100'>Payments</li>
                                    </NavLink>
                                    <li onClick={logout} className='px-5 py-1 hover:bg-gray-100'>Logout</li>
                                </ul>
                            </div>
                        </>
                    )}
                    <div className="flex flex-col p-5 md:p-20">
                        <div className="flex flex-col gap-x-5 gap-y-10">
                            <h1 className="text-lg font-semibold text-gray-600 md:text-2xl">
                                {title}
                            </h1>
                            <div className="flex flex-col">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>
            </>
    )
}

AdminLayout.propTypes = {
    title:PropTypes.string.isRequired,
    children:PropTypes.node
}
export default AdminLayout