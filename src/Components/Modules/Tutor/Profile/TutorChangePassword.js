import React, { useState, useEffect } from "react";
import { Link  } from "react-router-dom";
import { useDispatch } from "react-redux";
import CommonService from "../../../../services/CommonService";
import validate from "../../../../Validator";
import { toast } from 'react-toastify';
import { changeCurrentPage } from "../../../../store/actions/nav";
function TutorChangePassword() {
    const initialPasswordState = {
        old_password: "",
        new_password: "",
        confirm_password: "",
        
    };
    const [passwordData, setPasswordData]   = useState(initialPasswordState);
    const [loader, setLoader]               = useState(false);
    const [error, setError]                 = useState(false);
    const dispatch                          = useDispatch();
    const [message, setMessage]             = useState();    
    const [selectedValue, setSelectedValue] = useState([]);

    useEffect(() => {
        
        dispatch(changeCurrentPage('TutorChangePassword'));
    }, []);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setPasswordData({ ...passwordData, [name]: value });
        console.log(event.target);
    };
    

    const handleSubmitChangePassword = (e) => {
        e.preventDefault();
        setLoader(true);
        const { isValid, errors } = validate.createPasswordValidate(passwordData);
        //console.log(errors);
        if (isValid) {
            setError("");
            CommonService.create('tutor/changePassword',passwordData)
            .then(response => {
                setLoader(false);
                
                if(response.data.success){
                    if(response.data.message==='validation_failed'){
                        toast.error(response.data.data.message); 
                    }else{
                        toast.success(response.data.message);  
                    }                   
                }else{
                    toast.error(response.data.message);
                }
            })
            .catch(e => {
                setLoader(false);
                console.log(e.message);
                toast.error(e.message);
            });
        }else{
            setLoader(false);
            setError(errors);
        }
    }

    return (
        <div className="learner_title">
            <div className="col-lg-12 ">
                <div className="register-form">
                        <div>
                            <h5>{message}</h5>                       
                        </div>                    
                    <form onSubmit={handleSubmitChangePassword} className="w-100">
                    <div className="greenHeading">
                        Changed Password                      
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control textAra" placeholder="Old Password" name="old_password" value={passwordData.old_password} onChange={handleInputChange} />
                        <span className="errorMsg">{error && error.old_password}</span> 
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control textAra" placeholder="New Password" name="new_password" value={passwordData.new_password} onChange={handleInputChange} />
                        <span className="errorMsg">{error && error.new_password}</span>
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control textAra" placeholder="Confirm Password" name="confirm_password" value={passwordData.confirm_password} onChange={handleInputChange} />
                        <span className="errorMsg">{error && error.confirm_password}</span>
                    </div> 
                    
                    <div className="text-right">
                        <Link to={'/tutor'} className="addLearner">Back</Link>&nbsp;
                        <button className="addLearner">Save Password</button>
                        
                    </div>
                    </form>
                </div>            
            </div>
        </div>
    );
}

export default TutorChangePassword;