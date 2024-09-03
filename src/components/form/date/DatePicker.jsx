import React from 'react'
import './DatePicker.css'

const DatePicker = ({name='', value='', onChange, label, placeholder, className, error, min}) => {
  return (
    <div className='form-input-wraper'>
        {label && <label htmlFor="">{label}</label>}
        <input type="date" className={`${className}`} onChange={onChange} name={name} value={value} placeholder={placeholder} min={min} />
        {error && <span className="error-message">{error}</span>}
    </div>
  )
}

export default DatePicker