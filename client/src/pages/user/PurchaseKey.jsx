import React, { useEffect, useState } from 'react'
import AppLayout from '../../layout/AppLayout'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import useVerified from '../../hooks/verifiedHook'
import axios from 'axios'
import useAuth from '../../hooks/authHook'
import InputLabel from '../../components/InputLabel'
import InputSelect from '../../components/InputSelect'
import { useNavigate } from 'react-router-dom'
import useUser from '../../hooks/userHook'
import InputError from '../../components/InputError'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import useCsrfToken from '../../hooks/csrfTokenHook'
import.meta.env


function PurchaseKey() {
    useAuth()
    useVerified()
    useUser()
    var navigate = useNavigate()
    const isVerified = useVerified();
    const [plans,setPlans] = useState({});
    const [message,setMessage] = useState("");
    const [input,setInputs] = useState({});
    const [errors,setErrors] = useState({});
    const token = useCsrfToken();
    const env = import.meta.env;

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values,[name]:value}))

        if(name == "plan"){
            if(value == "monthly"){
                setInputs(values => ({...values,amount:200}))
            }
            else if(value == "annually"){
                setInputs(values => ({...values,amount:2000}))
            }
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        try {
            axios.post(`${env.VITE_API_BASE_URL}/payment/pay`,{...input,CSRFToken:token},{withCredentials:true}).then((response) => {
                if(response.status === 200){
                    setErrors(response.data.errors || {});
                    if(!response.data.errors){
                        setMessage(response.data.message);
                        setInputs({})
                        navigate('/')
                    }
                }
            }).catch(err => {
                setMessage(err.message);
            })
        } catch (error) {
            setMessage(error.message);
        }

    }

    

    useEffect(() => {
        const fetchPlans = async () => {
          try {
            const response = await axios.get(`${env.VITE_API_BASE_URL}/payment/plans`, { withCredentials: true });
            if (response.status === 200) {
              setPlans(response.data.plans);
            } else {
              setMessage(response.data.message);
            }
          } catch (error) {
            setMessage('An error occurred while fetching plans.');
          }
        };
    
        fetchPlans();
      }, []);


    return (
        <AppLayout title='Purchase Key'>
            <HelmetProvider>
                <Helmet>
                    <title>Purchase Key</title>
                </Helmet>
            </HelmetProvider>
            <div className="flex flex-col gap-y-5">
                {message ? (
                    <>
                        <div className="flex flex-col p-2 text-white bg-green-600 rounded-md w-full">
                            {message}
                        </div>
                    </>
                ):""}
                <form onSubmit={handleSubmit} className='w-full md:w-1/3'>
                    <div className="flex mb-3">
                        <InputError>{errors.custom}</InputError>
                    </div>
                    <div className="mb-3 flex flex-col gap-y-1">
                        <InputSelect name={"plan"} id={"plan"} label='Plan' change={handleChange} value={input.plan || ""} error={errors.plan}>
                            <option value="">Select Preferred Plan</option>
                            {plans.length > 0 ? (
                                <>
                                    {plans.map((plan) => (
                                        <option key={plan.plan_code} value={plan.interval}>
                                            {plan.name}
                                        </option>
                                    ))}
                                </>
                            ) : (
                                <option value={""}>No plans available</option>
                            )}
                        </InputSelect>
                    </div>
                    <div className="mb-3 flex flex-col gap-y-1">
                        <TextInput label='Amount' readonly={true} type={"number"} name={"amount"} id={"amount"} value={input.amount || ""} change={handleChange} error={errors.amount}/>
                    </div>
                    <div className="mb-3 flex flex-col gap-y-1">
                        <InputSelect name={"payment_method"} id={"payment_method"} label='Payment Method' change={handleChange} value={input.payment_method || ""} error={errors.payment_method}>
                            <option value="">Select Payment Method</option>
                            <option value="mobile_money">Mobile Money</option>
                            {/* <option value="card">Card</option> */}
                        </InputSelect>
                    </div>
                    {input.payment_method == "mobile_money" ? (
                        <>
                            <div className="mb-3 flex flex-col gap-y-1">
                                <InputSelect name={"provider"} id={"provider"} label='Provider' change={handleChange} value={input.provider || ""} error={errors.provider}>
                                    <option value="">Select Provider</option>
                                    <option value="mtn">MTN</option>
                                    <option value="vodafone">Telecel</option>
                                </InputSelect>
                            </div>
                            <div className="mb-3 flex flex-col gap-y-1">
                                <InputLabel name={"provider"}>
                                    Phone Number
                                </InputLabel> 
                                <TextInput type={"number"} name={"number"} id={"number"} value={input.number} change={handleChange} error={errors.number} />
                            </div>
                        </>
                    ):""}
                    <div className="mb-3">
                        <Button>
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    )
}

export default PurchaseKey