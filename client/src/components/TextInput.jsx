import React from 'react'
import InputLabel from './InputLabel'
import InputError from './InputError'

function TextInput({type,name,id,classes = "",label = ""}) {
  return (
        <>
            <InputLabel name={name}>{label}</InputLabel>
            <input type={type} name={name} id={id} className={`px-2 py-2 border rounded-md border-gray-100 ${classes}`} />
            <InputError></InputError>
        </>
  )
}

export default TextInput