import React from 'react'
import DataTable from 'react-data-table-component';
import AdminLayout from '../../layout/AdminLayout';
import useAdmin from '../../hooks/adminHook';
import useAuth from '../../hooks/authHook';

function AdminHome() {
	useAuth()
	useAdmin()
    const columns = [
		{
			name: 'Title',
			selector: row => row.title,
		},
		{
			name: 'Year',
			selector: row => row.year,
		},
	];
	
	const data = [
		  {
			id: 1,
			title: 'Beetlejuice',
			year: '1988',
		},
		{
			id: 2,
			title: 'Ghostbusters',
			year: '1984',
		},
	]
  return (
    <>
        <AdminLayout title='Home'>
            <div className="flex flex-col gap-y-5">
                <DataTable
                    columns={columns}
                    data={data} />
            </div>
        </AdminLayout>
    </>
  )
}

export default AdminHome