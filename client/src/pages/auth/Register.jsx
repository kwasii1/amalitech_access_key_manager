import React, { useState } from 'react'
import GuestLayout from '../../layout/GuestLayout'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

function Register() {
    const navigate = useNavigate();
    const [inputs,setInputs] = useState({})
    const [error,setErrors] = useState({})

    const handleSubmit = async (event) => {
        event.preventDefault();
        await axios.post('http://localhost:9000/register',inputs,{withCredentials:true}).then((response) => {
            if(response.status === 200){
                setErrors(response.data.errors || {});
                // navigate('/login')
                if(!response.data.errors){
                    navigate("/login",{state:{message:"Account Created"}})
                }
                console.log(response.data.errors);
                
            }
        })
        .catch(err => {
            if(err.response){
                console.log("RESPONSE",err.response.data);
            }
            else{
                console.log("REQUEST",err);
            }
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
            <form onSubmit={handleSubmit} method='POST'>
                <div className="mb-3 flex flex-col gap-y-2">
                    <TextInput name="name" type="text" label="Name" id="name" value={inputs.name || ""} change={handleChange} error={error.name || ""}  />
                </div>
                <div className="mb-3 flex flex-col gap-y-2">
                    <TextInput name="schoolname" type="text" label="School Name" id="schoolname" value={inputs.schoolname || ""} change={handleChange} error={error.schoolname || ""} />
                </div>
                <div className="mb-3 flex flex-col gap-y-2">
                    <TextInput name="email" type="email" label="Email" id="email" value={inputs.email || ""} change={handleChange} error={error.email || ""}/>
                </div>
                <div className="mb-3 flex flex-col gap-y-2">
                    <TextInput name="password" type="password" label="Password" id="password" value={inputs.password || ""} change={handleChange} error={error.password || ""}/>
                </div>
                <div className="mb-3 flex flex-col gap-y-2">
                    <TextInput name="confirm_password" type="password" label="Confirm Password" id="confirm_password" value={inputs.confirm_password || ""} change={handleChange} error={error.confirm_password || ""}/>
                </div>
                <div className="mb-3 flex flex-row justify-between items-center">
                    <div className="flex w-full md:w-1/2">
                        <p className="text-xs text-gray-600 underline cursor-pointer">Already have an account?</p>
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