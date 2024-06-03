import React, { useState } from 'react'
import AdminLayout from '../../layout/AdminLayout'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import axios from 'axios';
import useAuth from '../../hooks/authHook';
import useVerified from '../../hooks/verifiedHook';
import useAdmin from '../../hooks/adminHook';

export default function Endpoint() {
    useAuth()
    useVerified()
    useAdmin()
    const [input,setInput] = useState({});
    const [errors,setErrors] = useState({});
    const [message,setMessage] = useState("");
    const [key,setKey] = useState(null);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInput(values => ({...values,[name]:value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        try {
            axios.post('http://localhost:9000/admin/endpoint',input,{withCredentials:true}).then((response) => {
                if(response.status === 200){
                    setErrors(response.data.errors || {});
                    if(!response.data.errors){
                        setKey(response.data.key)
                        setMessage(response.data.message);
                    }
                }
                else {
                    setMessage(response.data.message);
                    setKey(null)
                }
            }).catch((error) => {
                setKey(null)
                if (error.response) {
                    if (error.response.status === 404) {
                      setMessage('404: Active Key not found');
                    } else if (error.response.status === 400) {
                      setErrors(error.response.data.errors);
                      setMessage('Validation errors occurred');
                    } else if (error.response.status === 500) {
                      setMessage('500: There was an error finding key');
                    } else {
                      setMessage(`Error: ${error.response.status}`);
                    }
                  } else {
                    setMessage(error.message);
                  }
            })
        } catch (error) {
            setMessage(error.message)
        }
    }
    return (
        <>
            <AdminLayout title='Endpoint'>
                <div className="flex flex-col gap-y-10">
                    <form onSubmit={handleSubmit} className='w-full md:w-1/2'>
                        <div className="mb-3 flex flex-col">
                            <TextInput label='Email' name={"email"} id={"email"} type={"email"} value={input.email} error={errors.email} change={handleChange} />
                        </div>
                        <div className="mb-3">
                            <Button type='submit'>
                                Submit
                            </Button>
                        </div>
                    </form>
                    {message ? (
                        <div className="flex flex-col p-2 rounded-md w-full bg-green-600 text-white text-sm">
                            {message}
                        </div>
                    ):""}
                    {key != null ? (
                        <>
                            <div className="flex flex-col gap-y-5">
                                <h3 className='text-lg font-semibold'>
                                    Key Details
                                </h3>
                                <div className="flex flex-col">
                                    <p className="">Key Code: {key.key}</p>
                                    <p className="">Status: {key.status}</p>
                                    <p className="">Date of procurement: {key.date_of_procurement}</p>
                                    <p className="">Expiry: {key.expiry_date}</p>
                                    <p className="">User: {key.user.name}</p>
                                </div>
                            </div>
                        </>
                    ):""}
                </div>
            </AdminLayout>
        </>
    )
}
