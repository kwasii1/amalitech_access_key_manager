import React, { useState } from 'react'
import GuestLayout from '../../layout/GuestLayout'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import useGuest from '../../hooks/guestHook'

function PasswordResetForm() {
    const [inputs,setInputs] = useState({});
    const [error,setError] = useState({});
    const [message,setMessage] = useState("");
    const {id,token} = useParams();
    const navigate = useNavigate();
    const isGuest = useGuest()

    const handleSubmit = (event) => {
        event.preventDefault();
        const updated_inputs = {...inputs,token,id}
        axios.post(`http://localhost:9000/users/reset-password/${id}/${token}`,updated_inputs,{withCredentials:true}).then((response) => {
            if(response.status === 200){
                setError(response.data.errors || {})
                if(!response.data.errors){
                    setMessage(response.data.message);
                    navigate('/login',{state:{message:"Password Reset."}});
                }
            }
        }).catch((err) => {
            setMessage(err.message)
        })
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values,[name]:value}))
    }

    return (
        <>
            {isGuest ? (
                <GuestLayout >
                    {message != "" ? (
                        <>
                            <div className="flex flex-row mb-3 rounded-md bg-green-600 text-white w-full">
                                <p className="text-xs">
                                    {message}
                                </p>
                            </div>
                        </>
                    ):""}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 flex flex-col gap-y-2">
                            <TextInput name="old_password" type="password" label="Old Password" id="old_password" value={inputs.old_password || ""} change={handleChange} error={error.old_password} />
                        </div>
                        <div className="mb-3 flex flex-col gap-y-2">
                            <TextInput name="password" type="password" label="New Password" id="password" value={inputs.password || ""} change={handleChange} error={error.password} />
                        </div>
                        <div className="mb-3 flex flex-col gap-y-2">
                            <TextInput name="confirm_password" type="password" label="Confirm New Password" id="confirm_password" value={inputs.confirm_password || ""} change={handleChange} error={error.confirm_password} />
                        </div>
                        <div className="mb-3 flex flex-row justify-end items-center">
                            <div className="flex w-full md:w-1/2">
                                <Button classes='w-fit'>
                                    Reset Password
                                </Button>
                            </div>
                        </div>
                    </form>
                </GuestLayout>
            ):""}
        </>
    )
}

export default PasswordResetForm