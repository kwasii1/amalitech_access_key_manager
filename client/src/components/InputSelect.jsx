import React from 'react'
import InputLabel from './InputLabel'
import InputError from './InputError'

function InputSelect({children,name,id,classes = "",label = "",value = "",change = "",error = ""}) {
  return (
        <>
            <InputLabel name={name}>{label}</InputLabel>
            <select name={name} id={id} className={`px-2 py-2 border rounded-md border-gray-100 ${classes}`} value={value} onChange={change}>
                {children}
            </select>
            {error == "" ? "" : (
              <InputError>{error}</InputError>
            )}
            
        </>
  )
}

export default InputSelect