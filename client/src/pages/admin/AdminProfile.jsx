import React from 'react'
import AppLayout from '../../layout/AppLayout'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'

function AdminProfile() {
  return (
        <>
            <AppLayout title='Profile'>
                <div className="flex flex-col md:flex-row gap-x-20 gap-y-5">
                    <div className="flex flex-col gap-y-5 md:w-1/2">
                        <h3 className="text-lg font-semibold text-gray-600">
                            Update Profile
                        </h3>
                        <form action="" className='w-full'>
                            <div className="mb-3 flex flex-col gap-y-2">
                                <TextInput name="name" type="text" label="School Name" id="name" />
                            </div>
                            <div className="mb-3 flex flex-col gap-y-2">
                                <TextInput name="email" type="email" label="Email" id="email" />
                            </div>
                            <div className="mb-3 flex flex-row justify-between items-center">
                                <div className="flex w-full md:w-1/2">
                                    <Button>
                                        Update
                                    </Button>
                                </div>
                            </div>
                        </form> 
                    </div>
                    <div className="flex flex-col gap-y-5 md:w-1/2">
                        <h3 className="text-lg font-semibold text-gray-600">
                            Change Password
                        </h3>
                        <form action="" className='w-full'>
                            <div className="mb-3 flex flex-col gap-y-2">
                                <TextInput name="old_password" type="password" label="Old Password" id="old_password" />
                            </div>
                            <div className="mb-3 flex flex-col gap-y-2">
                                <TextInput name="password" type="password" label="New Password" id="password" />
                            </div>
                            <div className="mb-3 flex flex-col gap-y-2">
                                <TextInput name="confirm_password" type="password" label="Confirm New Password" id="confirm_password" />
                            </div>
                            <div className="mb-3 flex flex-row justify-between items-center">
                                <div className="flex w-full md:w-1/2">
                                    <Button>
                                        Change Password
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <hr className='w-full h-1 bg-gray-100'/>
                <div className="flex flex-col gap-y-5">
                    <p>
                        This section is to delete your account. Proceed with caution
                    </p>
                    <Button type='button' classes='bg-red-600 w-fit'>
                        Delete Account
                    </Button>
                </div>
            </AppLayout>
        </>
  )
}

export default AdminProfile