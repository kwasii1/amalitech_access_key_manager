import React from 'react'

function Button({type = "submit",classes = "", children}) {
  return (
        <>
            <button type={type} className={`py-1 px-4 bg-cyan-600 text-white items-center rounded hover:bg-cyan-500 ${classes}`}>{children}</button>
        </>
  )
}

export default Button