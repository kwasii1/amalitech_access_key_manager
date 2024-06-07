import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useGuest(){
    const navigate = useNavigate();
    const [isGuest,setIsGuest] = useState(false);
	const env = import.meta.env;
    
    useEffect(() => {
		try {
			axios.get(`${env.VITE_API_BASE_URL}/auth/guest`,{withCredentials:true})
			.then((response) => {
				setIsGuest(response.data.guest);
				if(response.data.guest === false){
					navigate('/');
				}
			}).catch(err => {
				setIsGuest(false)
			})
		} catch (error) {
			setIsGuest(false)
		}
	},[isGuest,navigate])

    return isGuest;
}