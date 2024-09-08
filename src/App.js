import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// CSS ------------------------------------------------------------------------
import './App.css'

// Components -----------------------------------------------------------------
import Navbar from './components/navbar/Navbar'
import AdminRoute from './components/redirect/AdminRoute'
import UserRoute from './components/redirect/UserRoute'
import ToastContainer from './components/toast/ToastContainer'
import Loader from './components/loader/Loader'

// Pages ----------------------------------------------------------------------
import Dashboard from './pages/admin/dashboard/Dashboard'
import Category from './pages/admin/category/Category'
import Book from './pages/admin/book/Book'
import User from './pages/admin/user/User'
import Issuance from './pages/admin/issuance/Issuance'
import BookHistory from './pages/admin/bookHistory/BookHistory'
import AdminUserHistory from './pages/admin/userHistory/AdminUserHistory'
import History from './pages/user/history/History'
import Login from './pages/login/Login'

// Functions ------------------------------------------------------------------ 
import { getCurrentUser } from './api/services/auth'
import { loginUser } from './redux/auth/authActions'


const App = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location]);

  useEffect(() => {
    const token = window.localStorage.getItem('authtoken');
    
    if (Boolean(token)) {
      loadUser();
    } else {
      navigate('/login');
    }
  }, [dispatch])

  const loadUser = async () => {
    try {
      const data = await getCurrentUser();
      dispatch(loginUser(data));
      window.localStorage.setItem('authtoken', data.token);
    } catch (error) {
      navigate('/login');
    }
  }

  return (
    <>
      {loading && <Loader />}
      <Navbar />
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />

        {/* Protected routes for admin */}
        <Route path='/admin/dashboard' element={<AdminRoute> <Dashboard /> </AdminRoute>} />
        <Route path='/admin/category' element={<AdminRoute> <Category /> </AdminRoute>} />
        <Route path='/admin/book' element={<AdminRoute> <Book /> </AdminRoute>} />
        <Route path='/admin/user' element={<AdminRoute> <User /> </AdminRoute> } />
        <Route path='/admin/issuance' element={<AdminRoute> <Issuance /> </AdminRoute>} />
        <Route path='/admin/book-history/:bookId' element={<AdminRoute> <BookHistory /> </AdminRoute>} />
        <Route path='/admin/user-history/:mobile' element={<AdminRoute> <AdminUserHistory /> </AdminRoute>} />

        {/* Protected routes for user */}
        <Route path='/user/history' element={<UserRoute> <History /> </UserRoute>} />

      </Routes>
    </>
  )
}

export default App