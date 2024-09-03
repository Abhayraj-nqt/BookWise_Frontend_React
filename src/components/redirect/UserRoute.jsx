import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import LoadingToRedirect from './LoadingToRedirect';

const UserRoute = ({children, ...rest}) => {

  const auth = useSelector((state) => state.auth);
 
  return auth && auth.token 
    ? children 
    : <div className="">
        <LoadingToRedirect />
      </div>
}

export default UserRoute