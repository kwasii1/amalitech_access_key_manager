import { useState } from 'react'
import GuestLayout from '../../layout/GuestLayout'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import axios from 'axios'
import {NavLink, useNavigate} from 'react-router-dom'

import { Helmet, HelmetProvider } from 'react-helmet-async'
import useCsrfToken from '../../hooks/csrfTokenHook'

function Register() {
    const navigate = useNavigate();
    const [inputs,setInputs] = useState({});
    const [error,setErrors] = useState({});
    const [message,setMessage] = useState("");
    const token = useCsrfToken();
    const env = import.meta.env;

    const handleSubmit = async (event) => {
        event.preventDefault();
        await axios.post(`${env.VITE_API_BASE_URL}/register`,{...inputs,CSRFToken:token},{withCredentials:true}).then((response) => {
            if(response.status === 200){
                setErrors(response.data.errors || {});
                // navigate('/login')
                if(!response.data.errors){
                    navigate("/",{state:{message:"Account Created"}})
                }
                
            }
            else{
                setMessage(response.data.error)
            }
        })
        .catch(err => {
            setMessage(`${err.message} There was an error whilst registering account`)
        })
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values,[name]:value}))
    }
  return (
    <>
        <GuestLayout >
            <HelmetProvider>
                <Helmet>
                    <title>Register</title>
                </Helmet>
            </HelmetProvider>
            {message ? (
                <>
                    <div className="flex flex-row p-2 mb-3 text-white bg-green-600 rounded-md">
                        {message}
                    </div>
                </>
            ):""}
            <form onSubmit={handleSubmit} method='POST'>
                <div className="flex flex-col mb-3 gap-y-2">
                    <TextInput name="name" type="text" label="Name" id="name" value={inputs.name || ""} change={handleChange} error={error.name || ""}  />
                </div>
                <div className="flex flex-col mb-3 gap-y-2">
                    <TextInput name="schoolname" type="text" label="School Name" id="schoolname" value={inputs.schoolname || ""} change={handleChange} error={error.schoolname || ""} />
                </div>
                <div className="flex flex-col mb-3 gap-y-2">
                    <TextInput name="email" type="email" label="Email" id="email" value={inputs.email || ""} change={handleChange} error={error.email || ""}/>
                </div>
                <div className="flex flex-col mb-3 gap-y-2">
                    <TextInput name="password" type="password" label="Password" id="password" value={inputs.password || ""} change={handleChange} error={error.password || ""}/>
                </div>
                <div className="flex flex-col mb-3 gap-y-2">
                    <TextInput name="confirm_password" type="password" label="Confirm Password" id="confirm_password" value={inputs.confirm_password || ""} change={handleChange} error={error.confirm_password || ""}/>
                </div>
                <div className="flex flex-row items-center justify-between mb-3">
                    <div className="flex w-full md:w-1/2">
                        <NavLink to={"/login"}>
                            <p className="text-xs text-gray-600 underline cursor-pointer">Already have an account?</p>
                        </NavLink>
                    </div>
                    <div className="flex w-full md:w-1/2">
                        <Button>
                            Sign Up
                        </Button>
                    </div>
                </div>
            </form>
        </GuestLayout>
    </>
  )
}

export default Register