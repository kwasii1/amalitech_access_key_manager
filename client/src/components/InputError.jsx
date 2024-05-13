import React from 'react'

function InputError({message = ""}) {
  return (
        <span className='text-xs text-red-600'>{message}</span>
  )
}

export default InputError