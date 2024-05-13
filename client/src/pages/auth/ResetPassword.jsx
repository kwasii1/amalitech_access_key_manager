import React from 'react'
import GuestLayout from '../../layout/GuestLayout'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'

function ResetPassword() {
  return (
    <>
        <GuestLayout>
            <form action="">
                <div className="mb-3">
                    <p className="text-xs text-gray-600">
                        Enter your email below and submit to receive password reset link.
                    </p>
                </div>
                <div className="mb-3 flex flex-col gap-y-2">
                    <TextInput name="email" type="email" label="Email" id="email" />
                </div>
                <div className="mb-3 flex flex-row justify-end items-center">
                    <div className="flex">
                        <Button>
                            Submit
                        </Button>
                    </div>
                </div>
            </form>
        </GuestLayout>
    </>
  )
}

export default ResetPassword