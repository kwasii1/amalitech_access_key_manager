import React, { useEffect, useState } from 'react'
import AppLayout from '../../layout/AppLayout'
import DataTable from 'react-data-table-component';
import Button from '../../components/Button';
import useAuth from '../../hooks/authHook';
import useVerified from '../../hooks/verifiedHook';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs'

function Keys() {
	const isAuth = useAuth();
	const isVerified = useVerified()
	let location = useLocation()

	const [keys,setKeys] = useState({})
	const [message,setMessage] = useState("")


	useEffect(() => {
		try {
			axios.get('http://localhost:9000/users/keys',{withCredentials:true}).then((response) => {
				if(response.status === 200){
					console.log(response.data.data);
					setKeys(response.data.data)
				}
				else{
					setMessage(response.data.message)
				}
			})
		} catch (error) {
			console.log(error);
		}
	},[])

	
    const columns = [
		{
			name: 'Key',
			selector: row => row.key,
			sortable:true,
		},
		{
			name: 'Status',
			selector: row => row.status,
			sortable:true,
			cell:row => (
				<>
					{row.status === "active" ? (
						<div className="flex flex-col items-center bg-green-300 justify-center rounded-full py-1 px-3 text-green-600">
							{row.status}
						</div>
					) :""}
				</>
			)
		},
		{
			name: 'Procurement',
			selector: row => row.date_of_procurement,
			sortable:true,
			format:row => `${dayjs(row.date_of_procurement).format('YYYY-MM-DD HH:mm:ss')}`
		},
		{
			name: 'Expiry',
			selector: row => row.expiry_date,
			sortable:true,
			format:row => `${dayjs(row.expiry_date).format('YYYY-MM-DD HH:mm:ss')}`
		},
	];
	
	

	return (
		<>
			{isAuth ? (
				<>
					<AppLayout title='Keys'>
						<div className="flex flex-col gap-y-5">
							{location.state == null ? '' : (
								<>
									<div className="flex flex-col w-full p-2 bg-green-300 mb-3">
										{location.state.message}
									</div>
								</>
							) }
							<div className="flex justify-end">
								<a href="/purchase">
									<Button type='button' classes='w-fit'>
										Purchase Key
									</Button>
								</a>
							</div>
							<DataTable
								columns={columns}
								data={keys}
								striped
							/>
						</div>
					</AppLayout>
				</>
			):''}
		</>
	)

	
}

export default Keys