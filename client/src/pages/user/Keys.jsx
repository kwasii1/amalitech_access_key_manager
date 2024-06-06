import React, { useEffect, useState } from 'react'
import AppLayout from '../../layout/AppLayout'
import DataTable from 'react-data-table-component';
import Button from '../../components/Button';
import useAuth from '../../hooks/authHook';
import useVerified from '../../hooks/verifiedHook';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs'
import useUser from '../../hooks/userHook';
import { EyeIcon } from '@heroicons/react/24/solid';
import Modal from '../../components/Modal';
import { Helmet, HelmetProvider } from 'react-helmet-async';

function Keys() {
	const isAuth = useAuth();
	const isVerified = useVerified()
	useUser()
	let location = useLocation()

	const [keys,setKeys] = useState([])
	const [message,setMessage] = useState("")
	const [shouldFetch,setShouldfetch] = useState(true)
	const [isOpen, setIsOpen] = useState("");

	const handleClick = (name) => {
		setIsOpen(name);
	}
	const handleClose = () => {
		setIsOpen("");
	}


	useEffect(() => {
		const fetchKeys = () => {
			try {
				axios.get('http://localhost:9000/users/keys',{withCredentials:true}).then((response) => {
					if(response.status === 200){
						setKeys(response.data.data)
					}
					else{
						setMessage(response.data.message)
					}
				}).catch(err => {
					setMessage(err.message);
				})
			} catch (error) {
				setMessage(error.message);
			}
		}

		fetchKeys()
	},[])

	
    const columns = [
		{
			name: 'Key',
			selector: row => row.key,
			sortable:true,
			wrap:true
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
					) :row.status === "expired" ? (
						<div className="flex flex-col items-center bg-red-300 justify-center rounded-full py-1 px-3 text-red-600">
							{row.status}
						</div>
					):row.status === "revoked" ? (
						<div className="flex flex-col items-center bg-yellow-300 justify-center rounded-full py-1 px-3 text-yellow-600">
							{row.status}
						</div>
					):""}
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
		{
			name: 'Action',
			cell:row => (
				<>
					<div className="flex flex-row justify-center items-center gap-x-2">
						<EyeIcon onClick={() => handleClick(row.id)} className='size-4 cursor-pointer'/>
					</div>
				</>
			)
		}
	];
	
	

	return (
		<>
			{isAuth ? (
				<>
					<AppLayout title='Keys'>
						<HelmetProvider>
							<Helmet>
								<title>Home|Keys</title>
							</Helmet>
						</HelmetProvider>
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
								pagination
							/>
							{keys.map((values,index) => (
								<Modal key={index} open={isOpen === values.id} onClose={handleClose}>
									<div className="flex flex-col gap-y-5">
										<h3 className="text text-lg font-bold">
											Key Details
										</h3>
										<div className="flex flex-col">
											<p className=""><span className='font-bold'>Key Code:</span> {values.key}</p>
											<p className=""><span className='font-bold'>Status:</span> {values.status}</p>
											<p className=""><span className='font-bold'>Date of procurement:</span> {values.date_of_procurement}</p>
											<p className=""><span className='font-bold'>Expiry:</span> {values.expiry_date}</p>
											<p className=""><span className='font-bold'>Payment Method:</span> {values.payment.payment_method}</p>
											<p className=""><span className='font-bold'>Amount:</span> {values.payment.amount}</p>
											<p className=""><span className='font-bold'>Plan:</span> {values.payment.plan}</p>
											<p className=""><span className='font-bold'>Status:</span> {values.payment.status}</p>
										</div>
									</div>
								</Modal>
							))}
						</div>
					</AppLayout>
				</>
			):''}
		</>
	)

	
}

export default Keys