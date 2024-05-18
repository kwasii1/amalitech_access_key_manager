import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useGuest(){
    const navigate = useNavigate();
    const [isGuest,setIsGuest] = useState(false);
    
    useEffect(() => {
		try {
			axios.get('http://localhost:9000/auth/guest',{withCredentials:true})
			.then((response) => {
				setIsGuest(response.data.guest);
				if(response.data.guest === false){
					navigate('/');
				}
			})
		} catch (error) {
			console.log(error);
		}
	},[isGuest,navigate])

    return isGuest;
}