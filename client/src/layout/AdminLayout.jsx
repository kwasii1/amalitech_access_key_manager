import React, { useState } from 'react'
import { Bars3Icon, BellAlertIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import useCsrfToken from '../hooks/csrfTokenHook';

function AdminLayout({children,title = ""}) {
    const navigate = useNavigate();
    const [open,setMenu] = useState(false);
    const [noti,setNoti] = useState(false);
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
                    <nav className='px-2 py-3 md:px-20 flex flex-row justify-between md:justify-end border-b border-b-gray-100 items-center'>
                        <div className="flex md:hidden">
                            {open ? (
                                <XMarkIcon className='size-6 text-gray-600' onClick={openMenu} />
                            ): (
                                <Bars3Icon className='size-6 text-gray-600' onClick={openMenu} />
                            )}
                        </div>
                        {/* mobile view nav */}
                        <div className="flex flex-row items-center gap-x-2 relative md:hidden">
                            {/* <BellAlertIcon className='size-6 text-gray-600' onClick={showNotifications}/> */}
                            {!noti ? '': (
                                <>
                                    <div className="flex flex-col absolute bg-white rounded-lg py-5 shadow top-full right-full w-[10rem]">
                                        <div className="flex border-b border-b-gray-600 px-2 justify-center items-center">
                                            <p className="uppercase text-xs font-semibold">Notifications</p>
                                        </div>
                                        <div className="flex flex-col px-2 w-full">
                                            <div className="flex flex-col w-full">
                                                <p className="text-xs font-semibold text-gray-600">Title</p>
                                                <p className="font-light text-xs text-gray-600">
                                                    This is a notification
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="flex rounded-full">
                                <NavLink to={"/admin-profile"}>
                                    <UserCircleIcon className='size-6 text-gray-600' />
                                </NavLink>
                            </div>
                        </div>
                        <div className="hidden md:flex justify-between items-center w-full">
                            <div className="flex rounded-full">
                                <UserCircleIcon className='size-6 text-gray-600' />
                            </div>
                            <div className="flex items-center gap-x-5">
                                <div className="flex flex-row gap-x-2">
                                    <NavLink to={"/admin"}>
                                        {({isActive}) => (
                                            <span className={`flex p-2 cursor-pointer hover:bg-cyan-500/20 rounded-md ${isActive ? 'bg-cyan-500/20':''}`}>Home</span>
                                        )}
                                    </NavLink>
                                    <NavLink to={"/payments"}>
                                        {({isActive}) => (
                                            <span className={`flex p-2 cursor-pointer hover:bg-cyan-500/20 rounded-md ${isActive ? 'bg-cyan-500/20':''}`}>Payments</span>
                                        )}
                                    </NavLink>
                                    <NavLink to={"/endpoint"}>
                                        {({isActive}) => (
                                            <span className={`flex p-2 cursor-pointer hover:bg-cyan-500/20 rounded-md ${isActive ? 'bg-cyan-500/20':''}`}>Endpoint</span>
                                        )}
                                    </NavLink>
                                    <div onClick={logout} className="flex p-2 cursor-pointer hover:bg-cyan-500/20 rounded-md">Logout</div>
                                </div>
                                <div className="flex rounded-full">
                                    <a href="/admin-profile">
                                        <UserCircleIcon className='size-6 cursor-pointer text-gray-600' />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </nav>
                    {!open ? '' : (
                        <>
                            <div className="flex flex-col bg-cyan-600 rounded-b-md">
                                <ul className='flex flex-col gap-y-1 divide-y divide-gray-100'>
                                    <NavLink to={"/admin"}>
                                        <li className='px-5 py-1 hover:bg-gray-100'>Home</li>
                                    </NavLink>
                                    <NavLink to={"/endpoint"}>
                                        <li className='px-5 py-1 hover:bg-gray-100'>Endpoint</li>
                                    </NavLink>
                                    <li className='px-5 py-1 hover:bg-gray-100'>Payments</li>
                                    <li onClick={logout} className='px-5 py-1 hover:bg-gray-100'>Logout</li>
                                </ul>
                            </div>
                        </>
                    )}
                    <div className="flex flex-col p-5 md:p-20">
                        <div className="flex flex-col gap-x-5 gap-y-10">
                            <h1 className="text-lg md:text-2xl text-gray-600 font-semibold">
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

export default AdminLayout