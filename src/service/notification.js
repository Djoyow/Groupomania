import { toast } from 'react-toastify';


export const notify = (type,msg)=>{

    let param = {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
    };

    type ? toast.success(msg, param) : toast.warning(msg, param);

}
