export default function GuestLayout({children}){
    return (
        <>
            <main className="flex items-center justify-center md:h-screen overflow-auto p-3 md:p-0">
                <div className="flex w-full md:w-1/3">
                    <div className="flex flex-col gap-y-5 w-full">
                        <div className="flex justify-center items-center">
                            <img src={"/vite.svg"} alt="Logo" />
                        </div>
                        <div className="flex flex-col p-10 border border-gray-100 rounded-lg shadow-lg">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}