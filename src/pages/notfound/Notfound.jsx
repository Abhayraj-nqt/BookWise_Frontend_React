import React from 'react'
import './Notfound.css'
import { Link } from 'react-router-dom'

const Notfound = () => {
  return (
    <div className='not-found-page'>
        <p>Page not found</p>
        <p>Error: 404</p>
        <Link to={'/'}>{'<- '} Go to home</Link>
    </div>
  )
}

export default Notfound