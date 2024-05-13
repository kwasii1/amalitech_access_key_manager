export default function GuestLayout({children}){
    return (
        <>
            <main className="flex items-center justify-center h-screen p-3 md:p-0">
                <div className="flex flex-col w-full md:w-1/3">
                    <div className="div">
                        {/* <img src={} alt="" srcset="" /> */}
                    </div>
                    <div className="flex flex-col p-10 border border-gray-100 rounded-lg shadow-lg">
                        {children}
                    </div>
                </div>
            </main>
        </>
    )
}