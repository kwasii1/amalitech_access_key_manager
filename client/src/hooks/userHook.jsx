import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function useUser(){
    const navigate = useNavigate();
    const [isUser,setIsUser] = useState(false);
    
    useEffect(() => {
		try {
			axios.get('http://localhost:9000/auth/user',{withCredentials:true})
			.then((response) => {
				setIsUser(response.data.isUser);
				if(response.data.isUser === false){
					navigate('/admin',{state:{message:"You're not authorized to view page"}});
				}
			}).catch(err => {
				setIsUser(false)
			})
		} catch (error) {
			setIsUser(false)
		}
	},[isUser,navigate])

    return isUser;
}
