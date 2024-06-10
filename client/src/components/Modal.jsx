import { XMarkIcon } from "@heroicons/react/24/solid";

export default function Modal({children,open,onClose}) {
  return (
        <>
            {open ? (
                <div className="flex p-2 w-full items-center justify-center h-screen fixed z-10 top-0 left-0 backdrop-opacity-10">
                    <div className="flex flex-col w-full md:w-1/2 gap-y-5 p-5 rounded-md bg-white border-2 ">
                        <div className="flex w-full justify-end">
                            <XMarkIcon className="size-6 cursor-pointer" onClick={onClose}/>
                        </div>
                        {children}
                    </div>
                </div>
            ):""}
        </>
  )
}
