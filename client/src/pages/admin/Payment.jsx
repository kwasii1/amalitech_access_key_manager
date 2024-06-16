import { useEffect, useState } from 'react'
import AdminLayout from '../../layout/AdminLayout'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import DataTable from 'react-data-table-component'
import axios from 'axios';
import useAuth from '../../hooks/authHook';
import useAdmin from '../../hooks/adminHook';
import useVerified from '../../hooks/verifiedHook';
import { EyeIcon } from '@heroicons/react/24/solid';
import Modal from '../../components/Modal';
import dayjs from 'dayjs';
const env = import.meta.env

export default function Payment() {
    useAuth();
    useAdmin();
    useVerified();
    const [payment,setPayment] = useState([]);
    const [message,setMessage] = useState("");
    const [isOpen,setIsOpen] = useState(false);
    const handleClick = (name) => {
		setIsOpen(name);
	}
	const handleClose = () => {
		setIsOpen("");
	}
    const columns = [
        {
            name:"User",
            selector: row => row.users.name,
            sortable:true
        },
        {
            name:"Payment Method",
            selector: row => row.payment_method,
            sortable:true,
        },
        {
            name:"Status",
            selector: row => row.status,
            sortable:true,
            cell:row => (
				<>
					{row.status === "paid" ? (
						<div className="flex flex-col items-center justify-center px-3 py-1 text-green-600 bg-green-300 rounded-full">
							{row.status}
						</div>
					) :(
                        <div className="flex flex-col items-center justify-center px-3 py-1 text-red-600 bg-red-300 rounded-full">
							{row.status}
						</div>
                    )}
				</>
			)
        },
        {
            name:"Date",
            selector: row => row.created_at,
            sortable:true,
            format:row => `${dayjs(row.date_of_procurement).format('YYYY-MM-DD HH:mm:ss')}`
        },
        {
            name:"Action",
            selector: row => row.users.name,
            cell:row => (
                <>
                    <div className="flex flex-row items-center justify-center gap-x-2">
						<EyeIcon onClick={() => handleClick(`${row.id}view`)} className='cursor-pointer size-4'/>
					</div>
                </>
            )
        },
    ]
    useEffect(() => {
        const fetchPayment = async () => {
            try {
                await axios.get(`${env.VITE_API_BASE_URL}/admin/payments`,{withCredentials:true}).then((response) => {
                    if(response.status === 200){
                        setPayment(response.data.payments);
                    }
                }).catch(err => {
                    setPayment([]);
                    setMessage(err.message)
                })
            } catch (error) {
                setMessage("Internal server error")
            }
        }
        fetchPayment()
    },[])
    return (
        <>
            <AdminLayout title='Payments'>
                <HelmetProvider>
                    <Helmet>
                        <title>Payments|Admin</title>
                    </Helmet>
                </HelmetProvider>
                <div className="flex flex-col p-5">
                    {message ? (
                        <>
                            <div className="flex w-full p-2 text-xs text-white bg-green-600 rounded-md">
                                {message}
                            </div>
                        </>
                    ):""}
                    <DataTable columns={columns} data={payment} striped pagination />
                    {payment && payment.map((values) => (
                        <Modal key={values.id} open={isOpen === values.id+"view"} onClose={handleClose}>
                            <div className="flex flex-col gap-y-5">
                                <h3 className="text-lg font-bold text">
                                    Payment Details
                                </h3>
                                <div className="flex flex-col">
                                    <p className=""><span className='font-bold'>User:</span> {values.users.name}</p>
                                    <p className=""><span className='font-bold'>Date of purchase:</span> {dayjs(values.date_of_procurement).format('YYYY-MM-DD HH:mm:ss')}</p>
                                    <p className=""><span className='font-bold'>Mobile Number:</span> {values.mobile_number}</p>
                                    <p className=""><span className='font-bold'>Payment Method:</span> {values.payment_method}</p>
                                    <p className=""><span className='font-bold'>Amount:</span>GH&#8373; {values.amount}</p>
                                    <p className=""><span className='font-bold'>Plan:</span> {values.plan}</p>
                                    <p className=""><span className='font-bold'>Status:</span> {values.status}</p>
                                    <p className=""><span className='font-bold'>Key Purchased:</span> {values.access_keys.key}</p>
                                </div>
                            </div>
                        </Modal>
                    ))}
                </div>
            </AdminLayout>
        </>
    )
}
