import { useState } from "react";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import GuestLayout from "../../layout/GuestLayout";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {Helmet, HelmetProvider} from 'react-helmet-async'
import useCsrfToken from "../../hooks/csrfTokenHook";

export default function Login(){
    const navigate = useNavigate()
    let location = useLocation()
    const [inputs,setInputs] = useState({});
    const [error,setErrors] = useState({});
    const [message,setMessage] = useState("")
    const token = useCsrfToken();
    const env = import.meta.env;

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values,[name]:value}))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await axios.post(`${env.VITE_API_BASE_URL}/login`,{...inputs,CSRFToken:token},{withCredentials:true}).then((response) => {
            if(response.status === 200){
                setErrors(response.data.errors || {})
                if(!response.data.errors && response.data.success){
                    if(response.data.admin == "admin"){
                        navigate('/admin')
                    }
                    else{
                        navigate('/')
                    }
                }
            }
            else{
                setMessage(response.data.message)
            }
        }).catch(err => {
            setMessage(err.message)
        })
    }


    return (
        <>
            <GuestLayout >
                <HelmetProvider>
                    <Helmet>
                        <title>Login</title>
                    </Helmet>
                </HelmetProvider>
                {location.state == null ? '' : (
                    <>
                        <div className="flex flex-col w-full p-2 mb-3 bg-green-300">
                            {location.state.message}
                        </div>
                    </>
                ) }
                {message ? (
                    <>
                        <div className="flex flex-col w-full p-2 mb-3 bg-green-300">
                            {message}
                        </div>
                    </>
                ):'' }
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col mb-3 gap-y-2">
                        <TextInput name="email" type="email" label="Email" id="email" value={inputs.email || ""} error={error.email} change={handleChange}/>
                    </div>
                    <div className="flex flex-col mb-3 gap-y-2">
                        <TextInput name="password" type="password" label="Password" id="password" value={inputs.password || ""} error={error.password} change={handleChange}/>
                    </div>
                    <div className="flex flex-row items-center justify-between mb-3">
                        <div className="flex">
                            <a href="/reset-password">
                                <p className="text-xs text-gray-600 underline cursor-pointer">Forgot your password?</p>
                            </a>
                        </div>
                        <div className="flex">
                            <Button>
                                Login
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-center w-full">
                        <NavLink to={"/register"}>
                            <p className="text-xs text-gray-600 underline cursor-pointer">Don&apos;t have an account?</p>
                        </NavLink>
                    </div>
                </form>
            </GuestLayout>
        </>
    )
}