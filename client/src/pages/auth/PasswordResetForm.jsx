import React from 'react'
import GuestLayout from '../../layout/GuestLayout'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'

function PasswordResetForm() {
  return (
    <>
        <GuestLayout >
            <form action="">
                <div className="mb-3 flex flex-col gap-y-2">
                    <TextInput name="old_password" type="password" label="Old Password" id="old_password" />
                </div>
                <div className="mb-3 flex flex-col gap-y-2">
                    <TextInput name="password" type="password" label="New Password" id="password" />
                </div>
                <div className="mb-3 flex flex-col gap-y-2">
                    <TextInput name="confirm_password" type="password" label="Confirm New Password" id="confirm_password" />
                </div>
                <div className="mb-3 flex flex-row justify-end items-center">
                    <div className="flex w-full md:w-1/2">
                        <Button>
                            Reset Password
                        </Button>
                    </div>
                </div>
            </form>
        </GuestLayout>
    </>
  )
}

export default PasswordResetForm