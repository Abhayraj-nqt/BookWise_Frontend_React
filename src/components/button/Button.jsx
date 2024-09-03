import React from "react";
import "./Button.css";

const Button = ({ children, varient = 'primary', className, type, onClick }) => {
  if (varient === "primary") {
    return <button type={type} onClick={onClick} className={`button-primary ${className}`}>{children}</button>;
  } else if (varient === "secondary") {
    return <button type={type} onClick={onClick} className={`button-secondary ${className}`}>{children}</button>;
  }

  return <button type={type} onClick={onClick} className={` ${className}`}>{children}</button>;
};

export default Button;
