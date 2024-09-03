import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// CSS
import "./Navbar.css";

// Components
import { AccountIcon, ArrowDownIcon } from "../icons/Icons";
import Button from "../button/Button";

// Functions
import { logout } from "../../api/services/auth";
import { logoutUser } from '../../redux/auth/authActions'

// Constants
import { images } from "../../libs/constants";

const Navbar = () => {

  const iconSize = 25;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);

  const getFirstWord = (str='') => {
    if (str && str.length) {
      return str.split(' ')[0]
    } else {
      return ''
    }
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  // const [sideNavOpen, setSideNavOpen] = useState(false);

  const showDropdown = () => setIsDropdownOpen(true);
  const hideDropdown = () => setIsDropdownOpen(false);
  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  
  useEffect(() => {
    if (auth && auth.token) {
      setIsLoggedIn(true);
      setFirstName(getFirstWord(auth.name))
    }
  }, [auth]);

  const handleLogout = () => {
    logout();
    dispatch(logoutUser());
    navigate('/login');
    setIsLoggedIn(false);
  }


  return (
    <>
      <nav className={`navbar`}>
        <Link className="navbar-logo" to={"/"}>
          <img src={images.logo} alt="Quickcart-logo" />
        </Link>

        {/* <div className="nav-links-container" style={!isLoggedIn ? {justifyContent: 'center', gap: '2rem'}: {}} > */}
        <div className="nav-links-container" style={!isLoggedIn ? { width: 'fit-content' } : {}} >
          {isLoggedIn && <div onClick={toggleDropdown} to={'/user/account'} className={`${isLoggedIn ? 'flex' : 'hidden'} account nav-links-item`}>
            <div className="nav-link-icon">
              <div className="icon-name">
                <AccountIcon size={iconSize} />
                <div className="user-text">
                  <span className="user-greet">Welcome </span>
                  <span className="user-name">{firstName}</span>
                  <ArrowDownIcon size={20} />
                </div>
              </div>
            </div>
            {isDropdownOpen && (
            <div onMouseLeave={hideDropdown} className="dropdown-content">
              {/* <Link to={'/account'}>Account</Link> */}
              {auth && auth.role === 'ROLE_ADMIN' ? <Link to={'/admin/dashboard'}>Dashboard</Link> : <Link to={'/user/history'}>History</Link>}
              <div className="drop-logout" onClick={handleLogout} >Logout</div>
            </div>)}
          </div>}

          {/* {!isLoggedIn && <Link to={'/login'} className={`${!isLoggedIn ? 'flex' : 'hidden'} login account nav-links-item`}>
            <Button varient={'primary'}>Login</Button>
          </Link>} */}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
