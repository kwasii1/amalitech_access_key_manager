import React, { useState } from 'react'
import GuestLayout from '../../layout/GuestLayout'
import Button from '../../components/Button'
import axios from 'axios'
import useAuth from '../../hooks/authHook'
import csrfTokenHook from '../../hooks/csrfTokenHook'
import { Helmet } from 'react-helmet'

function VerifyEmail() {
    useAuth();
    const [message,setMessage] = useState("")
    const token = csrfTokenHook()
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:9000/users/send-verification',{CSRFToken:token},{withCredentials:true}).then((response) => {
            if(response.status === 200){
                setMessage(response.data.message)
            }
        }).catch((err) => {
            setMessage(err.message)
        })
    }
    return (
        <>
            <GuestLayout>
                <Helmet>
                    <title>Verify Email</title>
                </Helmet>
                <div className="flex flex-col gap-y-3">
                    {message != "" ? (
                        <>
                            <div className="flex flex-col p-2 rounded-md text-white text-xs bg-green-600">
                                <p>{message}</p>
                            </div>
                        </>
                    ):""}
                    <p>
                        A verification link has been sent to your email. 
                        If you still haven't received it click the button below to resend verification link.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <Button type='submit'>
                            Resend verification link
                        </Button>
                    </form>
                </div>
            </GuestLayout>
        </>
    )
}

export default VerifyEmail