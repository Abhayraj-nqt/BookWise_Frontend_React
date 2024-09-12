import React from 'react'

// Components
import Popup from './Popup'
import Button from '../button/Button'

// CSS
import './Popup.css'

const AlertPopup = ({title ='Warning!', isOpen, onClose, onConfirm, btnText = 'Confirm',  message = 'Are you sure you want to delete this item?'}) => {
  return (
    <Popup isOpen={isOpen} title={title} onClose={onClose} >
        {message && <p className='alert-popup-msg'>{message}</p>}
        <div className="alert-popup-btns">
          <Button varient='primary' onClick={() =>{ onConfirm(true); onClose()}} >
              {btnText}
          </Button>
          <Button varient='secondary' onClick={() => { onConfirm(false); onClose()}} >
              Close
          </Button>
        </div>
    </Popup>
  )
}

export default AlertPopup