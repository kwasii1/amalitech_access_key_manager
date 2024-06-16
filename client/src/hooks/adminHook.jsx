import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function useAdmin(){
    const navigate = useNavigate();
    const [isAdmin,setIsAdmin] = useState(false);
	const env = import.meta.env
    
    useEffect(() => {
		try {
			axios.get(`${env.VITE_API_BASE_URL}/auth/admin`,{withCredentials:true})
			.then((response) => {
				setIsAdmin(response.data.isAdmin);
				if(response.data.isAdmin === false){
					navigate('/',{state:{message:"You're not authorized to view page"}});
				}
			}).catch(() => {
				setIsAdmin(false)
			})
		} catch (error) {
			setIsAdmin(false)
		}
	},[isAdmin,navigate,env.VITE_API_BASE_URL])

    return isAdmin;
}
