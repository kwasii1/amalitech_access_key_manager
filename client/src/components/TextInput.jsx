import React from 'react'
import InputLabel from './InputLabel'
import InputError from './InputError'

function TextInput({type,name,id,classes = "",label = "",value = "",change = "",error = "",readonly = false}) {
  return (
        <>
            <InputLabel name={name}>{label}</InputLabel>
            <input type={type} name={name} id={id} className={`px-2 py-2 border rounded-md ring-gray-300 ring-1 ${classes}`} value={value} onChange={change} readOnly={readonly} />
            {error == "" ? "" : (
              <InputError>{error}</InputError>
            )}
            
        </>
  )
}

export default TextInput