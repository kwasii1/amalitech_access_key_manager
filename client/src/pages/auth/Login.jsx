import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import GuestLayout from "../../layout/GuestLayout";

export default function Login(){
    return (
        <>
            <GuestLayout >
                <form action="">
                    <div className="mb-3 flex flex-col gap-y-2">
                        <TextInput name="email" type="email" label="Email" id="email" />
                    </div>
                    <div className="mb-3 flex flex-col gap-y-2">
                        <TextInput name="password" type="password" label="Password" id="password" />
                    </div>
                    <div className="mb-3 flex flex-row justify-between items-center">
                        <div className="flex">
                            <p className="text-xs text-gray-600 underline cursor-pointer">Forgot your password?</p>
                        </div>
                        <div className="flex">
                            <Button>
                                Login
                            </Button>
                        </div>
                    </div>
                </form>
            </GuestLayout>
        </>
    )
}