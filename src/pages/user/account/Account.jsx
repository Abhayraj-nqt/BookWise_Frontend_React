import React from 'react'
import './Account.css'

import { useSelector } from 'react-redux'
import Card from '../../../components/card/Card'

const Account = () => {

  const auth = useSelector(state => state.auth);

  return (
    <div className='account__page'>
      {auth && <Card className="account__user-details">
        <div className="account__detail-item"> 
          <span>Name: </span> <span>{auth?.name}</span>
        </div>
        <div className="account__detail-item"> 
          <span>Email: </span> <span>{auth?.email}</span>
        </div>
        <div className="account__detail-item"> 
          <span>Mobile: </span> <span>{auth?.mobileNumber}</span>
        </div>
      </Card>}
    </div>
  )
}

export default Account