import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useVerified(){
    const navigate = useNavigate();
    const [isVerified,setisVerified] = useState(false);
    
    useEffect(() => {
		try {
			axios.get('http://localhost:9000/auth/verified',{withCredentials:true})
			.then((response) => {
				setisVerified(response.data.isVerified);
				if(response.data.isVerified === false){
					navigate('/verify-email');
				}
			})
		} catch (error) {
			console.log(error);
		}
	},[isVerified,navigate])

    return isVerified;
}