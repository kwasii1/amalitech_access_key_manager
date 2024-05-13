import React from 'react'
import GuestLayout from '../../layout/GuestLayout'
import Button from '../../components/Button'

function VerifyEmail() {
  return (
    <>
        <GuestLayout>
            <div className="flex flex-col gap-y-3">
                <p>
                    A verification link has been sent to your email. 
                    If you still haven't received it click the button below to resend verification link.
                </p>
                <Button type='button'>
                    Resend verification link
                </Button>
            </div>
        </GuestLayout>
    </>
  )
}

export default VerifyEmail