import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuth(){
    const navigate = useNavigate();
    const [isAuth,setIsAuth] = useState(false);
    
    useEffect(() => {
		try {
			axios.get('http://localhost:9000/auth',{withCredentials:true})
			.then((response) => {
				setIsAuth(response.data.auth);
				if(response.data.auth === false){
					navigate('/login');
				}
			})
		} catch (error) {
			console.log(error);
		}
	},[isAuth,navigate])

    return isAuth;
}