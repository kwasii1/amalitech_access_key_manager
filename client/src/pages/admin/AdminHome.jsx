import React from 'react'
import AppLayout from '../../layout/AppLayout'
import DataTable from 'react-data-table-component';

function AdminHome() {
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
        <AppLayout title='Home'>
            <div className="flex flex-col gap-y-5">
                <DataTable
                    columns={columns}
                    data={data} />
            </div>
        </AppLayout>
    </>
  )
}

export default AdminHome