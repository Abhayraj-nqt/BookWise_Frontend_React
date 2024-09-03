import React from 'react';
import './Sheet.css';

const Sheet = ({ isOpen, onClose, children }) => {
  return (
    <div className={`sheet-container ${isOpen ? 'open' : ''}`}>
      <div className="sheet-overlay" onClick={onClose}></div>
      <div className="sheet-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="sheet-body">
            {children}
        </div>
      </div>
    </div>
  );
};

export default Sheet;
