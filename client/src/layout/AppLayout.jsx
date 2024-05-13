import React, { useState } from 'react'
import { Bars3Icon, BellAlertIcon, UserCircleIcon } from '@heroicons/react/24/solid'

function AppLayout({children,title = ""}) {
    const [open,setMenu] = useState(false)
    const [noti,setNoti] = useState(false)
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
    return (
            <>
                <main className=''>
                    <nav className='px-2 py-3 md:px-20 flex flex-row justify-between md:justify-end border-b border-b-gray-100 items-center'>
                        <div className="flex md:hidden">
                            <Bars3Icon className='size-6 text-gray-600' onClick={openMenu} />
                        </div>
                        {/* mobile view nav */}
                        <div className="flex flex-row items-center gap-x-2 relative md:hidden">
                            <BellAlertIcon className='size-6 text-gray-600' onClick={showNotifications}/>
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
                                <UserCircleIcon className='size-6 text-gray-600' />
                            </div>
                        </div>
                        <div className="hidden md:flex justify-between items-center w-full">
                            <div className="flex rounded-full">
                                <UserCircleIcon className='size-6 text-gray-600' />
                            </div>
                            <div className="flex items-center gap-x-5">
                                <div className="flex flex-row gap-x-2">
                                    <div className="flex p-2 cursor-pointer hover:bg-cyan-500/20 bg-cyan-500/20 rounded-md">Home</div>
                                    <div className="flex p-2 cursor-pointer hover:bg-cyan-500/20 rounded-md">Payments</div>
                                    <div className="flex p-2 cursor-pointer hover:bg-cyan-500/20 rounded-md">Home</div>
                                </div>
                                <div className="flex rounded-full">
                                    <UserCircleIcon className='size-6 text-gray-600' />
                                </div>
                            </div>
                        </div>
                    </nav>
                    {!open ? '' : (
                        <>
                            <div className="flex flex-col bg-cyan-600 rounded-b-md">
                                <ul className='flex flex-col gap-y-1 divide-y divide-gray-100'>
                                    <li className='px-5 py-1 hover:bg-gray-100'>Home</li>
                                    <li className='px-5 py-1 hover:bg-gray-100'>Payments</li>
                                    <li className='px-5 py-1 hover:bg-gray-100'>Help</li>
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

export default AppLayout