import React from 'react'
import AppLayout from '../../layout/AppLayout'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import useVerified from '../../hooks/verifiedHook'

function PurchaseKey() {
    const isVerified = useVerified()
    return (
            <AppLayout title='Purchase Key'>
                <div className="flex flex-col">
                    <form action="" className='w-full md:w-1/3'>
                        <div className="mb-3 flex flex-col gap-y-1">
                            <TextInput label='Key ID' name="name" id="name" type="text" />
                        </div>
                        <div className="mb-3 flex flex-col gap-y-1">
                            <TextInput label='Key ID' name="name" id="name" type="text" />
                        </div>
                        <div className="mb-3">
                            <Button>
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
            </AppLayout>
    )
}

export default PurchaseKey