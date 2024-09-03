import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// CSS
import './Login.css'

// Components
import Input from '../../components/form/input/Input'
import Button from '../../components/button/Button'

// Functions
import { login } from '../../api/services/auth'
import { loginUser } from '../../redux/auth/authActions'
import toast from '../../components/toast/toast'
import { validateEmailOrMobile, validateNotEmpty, validatePassword } from '../../libs/utils'

// Constants
import { images } from '../../libs/constants'


const initialErrors = {
  username: '',
  password: ''
}

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector(state => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState(initialErrors);

  useEffect (() => {
    if (auth && auth.token) {
      if (auth.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/history');
      }
    }
  }, [auth]);
  

  const validateLogin = () => {
    let isValid = true;
    const newErrors = { username: '', password: '' };

    if (!validateEmailOrMobile(username)) {
      newErrors.username = 'Enter a valid email or 10-digit mobile number.';
      isValid = false;
    }

    if (!validateNotEmpty(password)) {
      newErrors.password = 'Password is required!';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
    }

    return isValid;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateLogin()) {
      return;
    }
    
    
    try {
      const encodedPassword = btoa(password);
      const data = await login({username, password: encodedPassword});
      dispatch(loginUser(data));
      window.localStorage.setItem('authtoken', data.token);
      toast.success('Login successfull');
    } catch (error) {
      const msg = error.response.data.message || 'Login failed!';
      toast.error(msg);
    }
  
  }

  return (
    <div className='login-page'>
      <form onSubmit={handleSubmit} className="login-form">
        <img src={images.logo} alt='logo'  />
        { 
        !auth.loading 
          ? <h2 className=''>Login to your account</h2>
          : <h2 className='' style={{color: 'red'}}>Loading ...</h2>
        }
        <br />
        <Input onChange={(e) => {setUsername(e.target.value); setErrors(initialErrors)}} type='text' name='username' value={username} label={'Username:'} placeholder={'Enter your username'} error={errors.username} />
        <Input onChange={(e) => {setPassword(e.target.value); setErrors(initialErrors)}} type={passwordVisible ? 'text' : 'password'} name='password' value={password} label={'Password:'} placeholder={'Enter your password'} error={errors.password}  />
        <div className="login-btn">
          <Button type={'submit'} varient={'primary'}  >Login</Button>
        </div>
      </form>
    </div>
  )
}

export default Login