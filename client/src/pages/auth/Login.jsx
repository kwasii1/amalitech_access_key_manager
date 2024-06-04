import { useState } from "react";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import GuestLayout from "../../layout/GuestLayout";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import csrfTokenHook from "../../hooks/csrfTokenHook";

export default function Login(){
    const navigate = useNavigate()
    let location = useLocation()
    const [inputs,setInputs] = useState({});
    const [error,setErrors] = useState({});
    const [message,setMessage] = useState("")
    const token = csrfTokenHook();

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values,[name]:value}))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await axios.post('http://localhost:9000/login',{...inputs,CSRFToken:token},{withCredentials:true}).then((response) => {
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
                {location.state == null ? '' : (
                    <>
                        <div className="flex flex-col w-full p-2 bg-green-300 mb-3">
                            {location.state.message}
                        </div>
                    </>
                ) }
                {message ? (
                    <>
                        <div className="flex flex-col w-full p-2 bg-green-300 mb-3">
                            {message}
                        </div>
                    </>
                ):'' }
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 flex flex-col gap-y-2">
                        <TextInput name="email" type="email" label="Email" id="email" value={inputs.email || ""} error={error.email} change={handleChange}/>
                    </div>
                    <div className="mb-3 flex flex-col gap-y-2">
                        <TextInput name="password" type="password" label="Password" id="password" value={inputs.password || ""} error={error.password} change={handleChange}/>
                    </div>
                    <div className="mb-3 flex flex-row justify-between items-center">
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
                            <p className="text-xs text-gray-600 underline cursor-pointer">Don't have an account?</p>
                        </NavLink>
                    </div>
                </form>
            </GuestLayout>
        </>
    )
}