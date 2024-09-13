import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const FlashMessage = ({message, type}) => {
    console.log('flashMessage: ',message);
    if (type === 'success') {
        toast.success(message, {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    } else if (type === 'error') {
        toast.error(message, {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
    return null;
};

export default FlashMessage;
