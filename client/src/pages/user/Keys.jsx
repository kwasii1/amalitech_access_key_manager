import React from 'react'
import AppLayout from '../../layout/AppLayout'
import DataTable from 'react-data-table-component';
import Button from '../../components/Button';
import useAuth from '../../hooks/authHook';

function Keys() {
	const isAuth = useAuth();

	
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
	];

	return (
		<>
			{isAuth ? (
				<>
					<AppLayout title='Keys'>
						<div className="flex flex-col gap-y-5">
							<div className="flex justify-end">
								<Button type='button' classes='w-fit'>
									Purchase Key
								</Button>
							</div>
							<DataTable
								columns={columns}
								data={data} />
						</div>
					</AppLayout>
				</>
			):''}
		</>
	)

	
}

export default Keys