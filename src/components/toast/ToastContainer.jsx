import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from '../../redux/toast/toastActions';

import './ToastContainer.css'
import Toast from './Toast.jsx';

const ToastContainer = () => {
  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.toast);

  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, toast.duration);

      return () => clearTimeout(timer);
    });
  }, [toasts, dispatch]);

  return (
    <div className="toast-container">
      {toasts.map((toast) => <Toast key={toast.id} toast={toast}  /> )}
    </div>
  );
};

export default ToastContainer;
