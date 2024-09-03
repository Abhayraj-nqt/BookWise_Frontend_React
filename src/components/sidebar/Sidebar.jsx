import React from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

// CSS
import "./Sidebar.css";

// Components
import Button from '../button/Button'

// Functions
import { logout } from "../../api/services/auth";
import { logoutUser } from "../../redux/auth/authActions";


const Sidebar = ({sidebarLinks}) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    dispatch(logoutUser());
    navigate('/login');
  }

  return (
    <>
      <div className="sidebar">

        <div className="side-links">
          {sidebarLinks.map(item => (
            <NavLink to={item.url} key={`${item.name}-${item.id}`} className={({ isActive }) => (isActive ? 'side-link active-link' : 'side-link')}>
              <span>{<item.icon size={25} />}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="side-btn">
          <Button onClick={handleLogout} varient={'primary'} >Logout</Button>
        </div>

      </div>

      <div className="mobile-bar">
        <div className="mobile-bar-links">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.url}
              key={`${item.name}-${item.id}`}
              className={({ isActive }) => (isActive ? 'mobile-bar-link active-link' : 'mobile-bar-link')}
            >
              <div className="mobile-bar-link-name">{<item.icon size={20} />}</div>
              <div className="">{item.name}</div>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
