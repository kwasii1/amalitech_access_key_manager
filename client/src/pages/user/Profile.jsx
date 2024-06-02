import React, { useEffect, useState } from 'react'
import AppLayout from '../../layout/AppLayout'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import useAuth from '../../hooks/authHook';
import axios from 'axios';
import useVerified from '../../hooks/verifiedHook';

function Profile() {
    const isAuth = useAuth();
    const isVerified = useVerified()
    const [user,setUser] = useState({})
    const [error,setError] = useState({})
    const [message,setMessage] = useState("")
    // change password section
    const [inputs,setInputs] = useState({});
    const [perror,setPerror] = useState({})
    const [pmessage,setpMessage] = useState("")

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setUser(values => ({...values,[name]:value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:9000/users/update',user,{withCredentials:true}).then((response) => {
            if(response.status === 200){
                setMessage("");
                setError(response.data.errors || {})
                if(!response.data.errors){
                    setMessage(response.data.message);
                }
            }
            else{
                setMessage(response.data.error);
            }
        })
    }


    // password section
    const handlePasswordChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values,[name]:value}))
    }

    const handlePasswordSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:9000/users/updatepassword',inputs,{withCredentials:true}).then((response) => {
            if(response.status === 200){
                setPerror(response.data.errors || {})
                if(!response.data.errors){
                    setpMessage(response.data.password_message);
                    setInputs({});
                }
            }
            else{
                setpMessage(response.data.password_message);
            }
        })
    }

    useEffect(() => {
        try {
            axios.get('http://localhost:9000/users',{withCredentials:true}).then((response) => {
                setUser(response.data.user)
            })
        } catch (error) {
            // check this
            setMessage(error)
        }
    },[])

    return (
            <>
                {isAuth ? (
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
                                        <TextInput name="name" type="text" label="Name" id="name" change={handleChange} value={user.name} error={error.name} />
                                    </div>
                                    <div className="mb-3 flex flex-col gap-y-2">
                                        <TextInput name="school_name" type="text" label="School Name" id="school_name" change={handleChange} value={user.school_name} error={error.school_name} />
                                    </div>
                                    <div className="mb-3 flex flex-col gap-y-2">
                                        <TextInput name="email" type="email" label="Email" id="email" change={handleChange} value={user.email} error={error.email} />
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
                                        <TextInput name="old_password" type="password" label="Old Password" id="old_password" change={handlePasswordChange} error={perror.old_password} value={inputs.old_password || ""} />
                                    </div>
                                    <div className="mb-3 flex flex-col gap-y-2">
                                        <TextInput name="password" type="password" label="New Password" id="password" change={handlePasswordChange} error={perror.password} value={inputs.password || ""} />
                                    </div>
                                    <div className="mb-3 flex flex-col gap-y-2">
                                        <TextInput name="confirm_password" type="password" label="Confirm New Password" id="confirm_password" change={handlePasswordChange} error={perror.confirm_password} value={inputs.confirm_password || ""} />
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
                        <div className="flex flex-col gap-y-5">
                            <p>
                                This section is to delete your account. Proceed with caution
                            </p>
                            <Button type='button' classes='bg-red-600 w-fit'>
                                Delete Account
                            </Button>
                        </div>
                    </AppLayout>
                ):""}
            </>
    )
}

export default Profile