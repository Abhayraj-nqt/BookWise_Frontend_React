import React from 'react'
import './Input.css'

const Input = ({type='text', name='', value='', onChange, label, placeholder, className, textarea = false, rows=10, required=false, error='', min}) => {
  return (
    <div className='form-input-wraper'>
        {label && <label htmlFor="">{label}</label>}
        {!textarea ? 
          <input className={`${className}`} onChange={onChange} type={type} name={name} value={value} placeholder={placeholder} required={required} min={min} />
          :
          <textarea className={`${className}`} onChange={onchange} value={value} name={name} placeholder={placeholder} rows={rows} required={required} />
        }
        {error && <span className="error-message">{error}</span>}
    </div>
  )
}

export default Input