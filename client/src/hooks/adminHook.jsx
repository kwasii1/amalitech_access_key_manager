import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function useAdmin(){
    const navigate = useNavigate();
    const [isAdmin,setIsAdmin] = useState(false);
    
    useEffect(() => {
		try {
			axios.get('http://localhost:9000/auth/admin',{withCredentials:true})
			.then((response) => {
				setIsAdmin(response.data.isAdmin);
				if(response.data.isAdmin === false){
					navigate('/',{state:{message:"You're not authorized to view page"}});
				}
			}).catch(err => {
				setIsAdmin(false)
			})
		} catch (error) {
			setIsAdmin(false)
		}
	},[isAdmin,navigate])

    return isAdmin;
}
