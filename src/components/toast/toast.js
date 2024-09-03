import store from '../../redux/store';
import { addToast } from '../../redux/toast/toastActions';

const toast = {
  success: (message, duration) => {
    store.dispatch(addToast(message, 'success', duration));
  },
  error: (message, duration) => {
    store.dispatch(addToast(message, 'error', duration));
  },
  info: (message, duration) => {
    store.dispatch(addToast(message, 'info', duration));
  },
  warning: (message, duration) => {
    store.dispatch(addToast(message, 'warning', duration));
  },
};

export default toast;
