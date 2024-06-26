import { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import DataTable from 'react-data-table-component';
import AdminLayout from '../../layout/AdminLayout';
import useAdmin from '../../hooks/adminHook';
import useAuth from '../../hooks/authHook';
import axios from 'axios';
import { EyeIcon, TrashIcon } from '@heroicons/react/24/solid';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import { HelmetProvider,Helmet } from 'react-helmet-async';
import useCsrfToken from '../../hooks/csrfTokenHook';

function AdminHome() {
	useAuth();
	useAdmin();
	const env = import.meta.env;

	const [keys,setKeys] = useState([]);
	const [message,setMessage] = useState("");
	const [isOpen, setIsOpen] = useState("");
	const [shouldFetch,setShouldfetch] = useState(true);
	const token = useCsrfToken()

	const handleClick = (name) => {
		setIsOpen(name);
	}
	const handleClose = () => {
		setIsOpen("");
	}

	const revoke = (id) => {
		try {
			axios.post(`${env.VITE_API_BASE_URL}/admin/keys/revoke/${id}`,{CSRFToken:token},{withCredentials:true}).then((response) => {
				if(response.status === 200){
					setMessage(response.data.message);
					setIsOpen("");
					setShouldfetch(true);
				}
				else{
					setMessage(response.data.message);
				}
			}).catch(err => {
				setMessage(err.message);
				setIsOpen("");
			})
		} catch (error) {
			setMessage(error.message);
		}
	}

	useEffect(() => {
		const fetchKeys = () => {
			try {
				axios.get(`${env.VITE_API_BASE_URL}/admin/keys`,{withCredentials:true}).then((response) => {
					if(response.status === 200){
						if(shouldFetch){
							setKeys(response.data.data);
							setShouldfetch(false)
						}
					}
					else{
						setMessage(response.data.message);
					}
				}).catch(err => {
					setMessage(err.message)
				})
			} catch (error) {
				setMessage(error.message)
			}
		}

		fetchKeys()
	},[shouldFetch,env.VITE_API_BASE_URL])
    
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
						<div className="flex flex-col items-center justify-center px-3 py-1 text-green-600 bg-green-300 rounded-full">
							{row.status}
						</div>
					) :row.status === "expired" ? (
						<div className="flex flex-col items-center justify-center px-3 py-1 text-red-600 bg-red-300 rounded-full">
							{row.status}
						</div>
					):row.status === "revoked" ? (
						<div className="flex flex-col items-center justify-center px-3 py-1 text-yellow-600 bg-yellow-300 rounded-full">
							{row.status}
						</div>
					):""}
				</>
			)
		},
		{
			name:'User',
			selector:row => row.user.name,
			sortable:true
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
					<div className="flex flex-row items-center justify-center gap-x-2">
						<EyeIcon onClick={() => handleClick(`${row.id}view`)} className='cursor-pointer size-4'/>
						<TrashIcon onClick={() => handleClick(row.id)} className='text-red-600 cursor-pointer size-4' />
					</div>
				</>
			)
		}
	];


  return (
    <>
        <AdminLayout title='Home'>
			<HelmetProvider>
				<Helmet>
					<title>Home|Admin</title>
				</Helmet>
			</HelmetProvider>
            <div className="flex flex-col gap-y-5">
				{message ? (
					<>
						<div className="flex w-full p-2 text-xs text-white bg-green-600 rounded-md">
							{message}
						</div>
					</>
				):""}
                <DataTable
                    columns={columns}
                    data={keys} 
					striped
					pagination
				/>
				<div className="flex flex-col">
					{keys && keys.map((values,index) => (
						<div key={index}>
							<Modal key={index} open={isOpen === values.id} onClose={handleClose}>
								<div className="flex flex-col gap-y-5">
									<h3 className="text-sm text text-end">
										Are you sure you want to revoke this key?<br></br>
										{values.key}
									</h3>
									<div className="flex flex-row justify-end">
										<Button onClick={() => revoke(values.id)} type='button' classes='bg-red-600'>
											Revoke
										</Button>
									</div>
								</div>
							</Modal>
							<Modal key={`${index}view`} open={isOpen === values.id+"view"} onClose={handleClose}>
								<div className="flex flex-col gap-y-5">
									<h3 className="text-lg font-bold text">
										Access Key Details
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
										<p className=""><span className='font-bold'>User:</span> {values.user.name}</p>
									</div>
								</div>
							</Modal>
						</div>
					))}
				</div>
            </div>
        </AdminLayout>
    </>
  )
}

export default AdminHome