import React from 'react'
import { SpinnerIcon } from '../icons/Icons'
import './Loader.css'

const Loader = () => {
  return (
    <div className='loader-wraper'>
        <SpinnerIcon size={100} />
    </div>
  )
}

export default Loader