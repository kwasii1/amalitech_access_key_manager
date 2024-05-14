import { useState } from "react";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import GuestLayout from "../../layout/GuestLayout";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login(){
    const navigate = useNavigate()
    let location = useLocation()
    const [inputs,setInputs] = useState({});
    const [error,setErrors] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values,[name]:value}))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await axios.post('http://localhost:9000/login',inputs,{withCredentials:true}).then((response) => {
            if(response.status === 200){
                setErrors(response.data.errors || {})
                console.log(response);
                if(!response.data.errors && response.data.success){
                    navigate('/')
                }
            }
        }).catch(err => {
            console.log(err);
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
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 flex flex-col gap-y-2">
                        <TextInput name="email" type="email" label="Email" id="email" value={inputs.email || ""} error={error.email} change={handleChange}/>
                    </div>
                    <div className="mb-3 flex flex-col gap-y-2">
                        <TextInput name="password" type="password" label="Password" id="password" value={inputs.password || ""} error={error.password} change={handleChange}/>
                    </div>
                    <div className="mb-3 flex flex-row justify-between items-center">
                        <div className="flex">
                            <p className="text-xs text-gray-600 underline cursor-pointer">Forgot your password?</p>
                        </div>
                        <div className="flex">
                            <Button>
                                Login
                            </Button>
                        </div>
                    </div>
                </form>
            </GuestLayout>
        </>
    )
}