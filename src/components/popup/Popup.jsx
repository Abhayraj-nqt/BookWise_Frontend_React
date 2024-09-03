import React, { useState, useEffect } from 'react';
import './Popup.css';

const Popup = ({ isOpen, title, children, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      setTimeout(() => setShow(false), 300);
    }
  }, [isOpen]);

  if (!show) return null;

  return (
    <div className={`popup-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}>
      <div className={`popup-content ${isOpen ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          {title && <h2>{title}</h2>}
          <button className="popup-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="popup-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Popup;
