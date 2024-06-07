import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuth(){
    const navigate = useNavigate();
    const [isAuth,setIsAuth] = useState(false);
	const env = import.meta.env;
    
    useEffect(() => {
		try {
			axios.get(`${env.VITE_API_BASE_URL}/auth`,{withCredentials:true})
			.then((response) => {
				setIsAuth(response.data.auth);
				if(response.data.auth === false){
					navigate('/login');
				}
			}).catch(err => {
				setIsAuth(false)
			})
		} catch (error) {
			setIsAuth(false)
		}
	},[isAuth,navigate])

    return isAuth;
}