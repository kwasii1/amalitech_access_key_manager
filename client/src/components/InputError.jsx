import React from 'react'

function InputError({children}) {
  return (
        <span className='text-xs text-red-600 w-full'>{children}</span>
  )
}

export default InputError