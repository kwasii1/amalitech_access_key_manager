import { useState } from 'react'
import GuestLayout from '../../layout/GuestLayout'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import useGuest from '../../hooks/guestHook'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import useCsrfToken from '../../hooks/csrfTokenHook'

function PasswordResetForm() {
    const [inputs,setInputs] = useState({});
    const [error,setError] = useState({});
    const [message,setMessage] = useState("");
    const {id,token} = useParams();
    const navigate = useNavigate();
    const isGuest = useGuest();
    const csrftoken = useCsrfToken()
    const env = import.meta.env;

    const handleSubmit = (event) => {
        event.preventDefault();
        const updated_inputs = {...inputs,token,id}
        axios.post(`${env.VITE_API_BASE_URL}/users/reset-password/${id}/${token}`,{...updated_inputs,CSRFToken:csrftoken},{withCredentials:true}).then((response) => {
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
                    <HelmetProvider>
                        <Helmet>
                            <title>Password Reset</title>
                        </Helmet>
                    </HelmetProvider>
                    {message != "" ? (
                        <>
                            <div className="flex flex-row w-full mb-3 text-white bg-green-600 rounded-md">
                                <p className="text-xs">
                                    {message}
                                </p>
                            </div>
                        </>
                    ):""}
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col mb-3 gap-y-2">
                            <TextInput name="password" type="password" label="New Password" id="password" value={inputs.password || ""} change={handleChange} error={error.password} />
                        </div>
                        <div className="flex flex-col mb-3 gap-y-2">
                            <TextInput name="confirm_password" type="password" label="Confirm New Password" id="confirm_password" value={inputs.confirm_password || ""} change={handleChange} error={error.confirm_password} />
                        </div>
                        <div className="flex flex-row items-center justify-end mb-3">
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