import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import LoadingToRedirect from './LoadingToRedirect';

const UserRoute = ({children, ...rest}) => {

  const auth = useSelector((state) => state.auth);
  const [verified, setVerified] = useState(false);
  
  useEffect(() => {
    if (auth && auth.token) {
      try {
        if (auth.role === 'ROLE_USER') {
          setVerified(true);
        }
      } catch (error) {
        console.log('USER ROUTE ERR', error);
        setVerified(false);
      }
    }
  }, [auth])
 
  return verified
    ? children 
    : <div className="">
        <LoadingToRedirect />
      </div>
}

export default UserRoute