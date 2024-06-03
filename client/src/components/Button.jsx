import React from 'react'

function Button({type = "submit",classes = "", children,onClick = () => {}}) {
  return (
        <>
            <button onClick={onClick} type={type} className={`py-1 px-4 bg-cyan-600 text-white items-center rounded hover:bg-cyan-500 ${classes}`}>{children}</button>
        </>
  )
}

export default Button