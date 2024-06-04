import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function csrfTokenHook() {

    const [token,setToken] = useState("");

    useEffect(() => {
        try {
            axios.get('http://localhost:9000/auth/csrf-token',{withCredentials:true}).then((response) => {
                if(response.status === 200){
                    setToken(response.data.token)
                }
            }).catch(err => {
                console.log(err);
            })
        } catch (error) {
            console.log(error.message);
        }
    })
    return token;
}
