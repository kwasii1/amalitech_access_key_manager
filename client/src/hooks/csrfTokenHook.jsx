import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function useCsrfToken() {

    const [token,setToken] = useState("");
    const env = import.meta.env;

    useEffect(() => {
        try {
            axios.get(`${env.VITE_API_BASE_URL}/auth/csrf-token`,{withCredentials:true}).then((response) => {
                if(response.status === 200){
                    setToken(response.data.token)
                }
            }).catch(err => {
                console.log(err);
            })
        } catch (error) {
            console.log(error.message);
        }
    },[])
    return token;
}
