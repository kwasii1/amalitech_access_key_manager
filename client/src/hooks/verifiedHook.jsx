import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useVerified(){
    const navigate = useNavigate();
    const [isVerified,setisVerified] = useState(false);
	const env = import.meta.env;
    
    useEffect(() => {
		try {
			axios.get(`${env.VITE_API_BASE_URL}/auth/verified`,{withCredentials:true})
			.then((response) => {
				setisVerified(response.data.isVerified);
				if(response.data.isVerified === false){
					navigate('/verify-email');
				}
			}).catch(() => {
				setisVerified(false)
			})
		} catch (error) {
			setisVerified(false)
		}
	},[isVerified,navigate,env.VITE_API_BASE_URL])

    return isVerified;
}