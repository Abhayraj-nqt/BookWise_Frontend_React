import React from 'react'
import './TimePicker.css'

const TimePicker = ({name='', value='', onChange, label, placeholder, className, error, min}) => {
  return (
    <div className='form-input-wraper'>
        {label && <label htmlFor="">{label}</label>}
        <input type="time" className={`${className}`} onChange={onChange} name={name} value={value} placeholder={placeholder} min={min} />
        {error && <span className="error-message">{error}</span>}
    </div>
  )
}

export default TimePicker