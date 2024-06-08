import React, { useState } from 'react'
import GuestLayout from '../../layout/GuestLayout'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import axios from 'axios';
import useGuest from '../../hooks/guestHook';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import useCsrfToken from '../../hooks/csrfTokenHook';

function ResetPassword() {
    const [input,setInput] = useState({});
    const [error,setError] = useState({});
    const [message,setMessage] = useState("");
    const isGuest = useGuest();
    const token = useCsrfToken();
    const env = import.meta.env;

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInput(values => ({...values,[name]:value}))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        await axios.post(`${env.VITE_API_BASE_URL}/users/reset-password`,{...input,CSRFToken:token},{withCredentials:true}).then((response) => {
            if(response.status === 200){
                setError(response.data.errors || {})
                if(!response.data.errors){
                    setMessage(response.data.message);
                }
            }
            else{
                setMessage(response.data.message);
            }
        }).catch((err) => {
            setMessage(err.message);
        })
    }
    return (
        <>
            {isGuest ? (
                <GuestLayout>
                    <HelmetProvider>
                        <Helmet>
                            <title>Password Reset Request</title>
                        </Helmet>
                    </HelmetProvider>
                    <form onSubmit={handleSubmit}>
                        {message != "" ? (
                            <>
                                <div className="mb-3 p-2 rounded-md bg-green-600">
                                    <p className="text-xs text-white">
                                        {message}
                                    </p>
                                </div>
                            </>
                        ):""}
                        <div className="mb-3">
                            <p className="text-xs text-gray-600">
                                Enter your email below and submit to receive password reset link.
                            </p>
                        </div>
                        <div className="mb-3 flex flex-col gap-y-2">
                            <TextInput name="email" type="email" label="Email" id="email" value={input.email || ""} error={error.email} change={handleChange} />
                        </div>
                        <div className="mb-3 flex flex-row justify-end items-center">
                            <div className="flex">
                                <Button>
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </form>
                </GuestLayout>
            ):""}
        </>
    )
}

export default ResetPassword