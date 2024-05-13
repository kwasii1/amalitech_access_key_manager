import React from 'react'
import GuestLayout from '../../layout/GuestLayout'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'

function Register() {
  return (
    <>
        <GuestLayout >
            <form action="">
                <div className="mb-3 flex flex-col gap-y-2">
                    <TextInput name="name" type="text" label="School Name" id="name" />
                </div>
                <div className="mb-3 flex flex-col gap-y-2">
                    <TextInput name="email" type="email" label="Email" id="email" />
                </div>
                <div className="mb-3 flex flex-col gap-y-2">
                    <TextInput name="password" type="password" label="Password" id="password" />
                </div>
                <div className="mb-3 flex flex-col gap-y-2">
                    <TextInput name="confirm_password" type="password" label="Confirm Password" id="confirm_password" />
                </div>
                <div className="mb-3 flex flex-row justify-between items-center">
                    <div className="flex w-full md:w-1/2">
                        <p className="text-xs text-gray-600 underline cursor-pointer">Already have an account?</p>
                    </div>
                    <div className="flex w-full md:w-1/2">
                        <Button>
                            Sign Up
                        </Button>
                    </div>
                </div>
            </form>
        </GuestLayout>
    </>
  )
}

export default Register