import toastr from 'reactjs-toastr';
import 'reactjs-toastr/lib/toast.css';

const toastWithText = (message,type) => {
    if(type==='success'){
        toastr.success(message);
    }else if(type==='success'){

    }else if(type==='info'){
        
    }else if(type==='error'){
      
    }else if(type==='warning'){
      
    }
};

module.exports = { toastWithText };