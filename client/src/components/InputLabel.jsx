import React from 'react'

export default function InputLabel({name,children}) {
  return (
    <>
        <label className='text-xs text-gray-600' htmlFor={name}>{children}</label>
    </>
  )
}
