import React from 'react'
import './Select.css'

const Select = ({name, value, className, onChange, placeholder, required, label, children, error=''}) => {
  return (
    <div className='form-input-wraper'>
        {label && <label htmlFor="">{label}</label>}
        <select className={`${className}`} onChange={onChange} name={name} value={value} placeholder={placeholder} required={required} >
          {children}
        </select>
        {error && <span className="error-message">{error}</span>}
    </div>
  )
}

export default Select