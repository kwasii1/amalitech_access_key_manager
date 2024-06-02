import React, { useEffect, useState } from 'react'
import AppLayout from '../../layout/AppLayout'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import useAdmin from '../../hooks/adminHook'
import useAuth from '../../hooks/authHook'
import axios from 'axios'

function AdminProfile() {
    const [user,setUser] = useState({});
    const [errors,setErrors] = useState({});
    const [message,setMessage] = useState("");
    const [inputs,setInputs] = useState({});
    const [perrors,setPerrors] = useState({});
    const [pmessage,setPmessage] = useState("");

    
    useAuth();
    useAdmin();

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setUser(values => ({...values,[name]:value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:9000/admin/update-profile',user,{withCredentials:true}).then((response) => {
            if(response.status === 200){
                setMessage("");
                setErrors(response.data.errors || {})
                if(!response.data.errors){
                    setMessage(response.data.message);
                }
            }
            else{
                setMessage(response.data.error);
            }
        })
    }

    const handlePasswordChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values,[name]:value}))
    }

    const handlePasswordSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:9000/admin/change-password',inputs,{withCredentials:true}).then((response) => {
            if(response.status === 200){
                setPmessage("");
                setPerrors(response.data.errors || {})
                if(!response.data.errors){
                    setPmessage(response.data.password_message);
                }
            }
            else{
                setPmessage(response.data.password_message);
            }
        })
    }


    useEffect(() => {
        try {
            axios.get('http://localhost:9000/users',{withCredentials:true}).then((response) => {
                setUser(response.data.user)
            })
        } catch (error) {
            console.log(error);
        }
    },[])

    return (
        <>
            <AppLayout title='Profile'>
                <div className="flex flex-col md:flex-row gap-x-20 gap-y-5">
                    <div className="flex flex-col gap-y-5 md:w-1/2">
                        <h3 className="text-lg font-semibold text-gray-600">
                            Update Profile
                        </h3>
                        {message != "" ? (
                            <>
                                <div className="flex flex-col p-2 w-full bg-green-600 rounded">
                                    <p className="text-white text-md font-semibold">
                                        {message}
                                    </p>
                                </div>
                            </>
                        ):""}
                        <form onSubmit={handleSubmit} className='w-full'>
                            <div className="mb-3 flex flex-col gap-y-2">
                                <TextInput name="name" type="text" label="Name" id="name" value={user.name || ""} change={handleChange} error={errors.name} />
                            </div>
                            <div className="mb-3 flex flex-row justify-between items-center">
                                <div className="flex w-full md:w-1/2">
                                    <Button>
                                        Update
                                    </Button>
                                </div>
                            </div>
                        </form> 
                    </div>
                    <div className="flex flex-col gap-y-5 md:w-1/2">
                        <h3 className="text-lg font-semibold text-gray-600">
                            Change Password
                        </h3>
                        {pmessage != "" ? (
                            <>
                                <div className="flex flex-col p-2 w-full bg-green-600 rounded">
                                    <p className="text-white text-md font-semibold">
                                        {pmessage}
                                    </p>
                                </div>
                            </>
                        ):""}
                        <form onSubmit={handlePasswordSubmit} className='w-full'>
                            <div className="mb-3 flex flex-col gap-y-2">
                                <TextInput name="old_password" type="password" label="Old Password" id="old_password" change={handlePasswordChange} value={inputs.old_password || ""} error={perrors.old_password} />
                            </div>
                            <div className="mb-3 flex flex-col gap-y-2">
                                <TextInput name="password" type="password" label="New Password" id="password" change={handlePasswordChange} value={inputs.password || ""} error={perrors.password} />
                            </div>
                            <div className="mb-3 flex flex-col gap-y-2">
                                <TextInput name="confirm_password" type="password" label="Confirm New Password" id="confirm_password" change={handlePasswordChange} value={inputs.confirm_password || ""} error={perrors.confirm_password} />
                            </div>
                            <div className="mb-3 flex flex-row justify-between items-center">
                                <div className="flex w-full md:w-1/2">
                                    <Button>
                                        Change Password
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <hr className='w-full h-1 bg-gray-100'/>
            </AppLayout>
        </>
    )
}

export default AdminProfile