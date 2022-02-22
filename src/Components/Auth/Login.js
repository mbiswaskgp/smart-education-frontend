import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
//import { Link } from "react-router-dom";
import { Redirect } from 'react-router-dom';

import { login } from "../../store/actions/auth";
import { changeCurrentPage } from "../../store/actions/nav";
import validate from "../../Validator";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import Banner from "../Layouts/Banner";
import Footer from "../Layouts/Footer";
import Header from "../Layouts/Header";

import CommonService from "../../services/CommonService";
//import AuthService from "../../services/auth.service";
import { isEmail } from "../../Validator/validations";

import { toast } from 'react-toastify';

const Login = (props) => {
  
    const dispatch                          = useDispatch();
    const [useremail, setUseremail]         = useState("");
    const [userpassword, setUserpassword]   = useState("");
    const [forgetEmail, setForgetEmail]     = useState("");
    const [loading, setLoading]             = useState(false);
    //const [loadingP, setLoadingP]           = useState(false);
    const [error, setError]                 = useState("");
    const [errorP, setErrorP]               = useState("");
    const [show, setShow]                   = useState(false);

    const { isLoggedIn,userRoleData } = useSelector(state => state.auth);
    //const { message } = useSelector(state => state.message);

    useEffect(() => {
        dispatch(changeCurrentPage('login'));     
      }, []);

    const onChangeUseremail = (e) => {
        const useremail = e.target.value;
        setUseremail(useremail);
    };

    const onChangeUserPassword = (e) => {
        const userpassword = e.target.value;
        setUserpassword(userpassword);
    };

    const handleLogin = (e) => {
        e.preventDefault();
    
        setLoading(true);
        
        const userData = {
            useremail: useremail,
            userpassword: userpassword,            
        };
        
        const { isValid, errors } = validate.loginValidate(userData);
        
        if (isValid) {
            setError("");
            dispatch(login(useremail, userpassword))
                .then((response) => {
                    // console.log(userRoleData);
                    // console.log(response);
                    if(userRoleData===1){    
                        props.history.push("/admin");
                        window.location.reload();                       
                    }else if(userRoleData===2){
                        props.history.push("/tutor");
                        window.location.reload();
                    }else if(userRoleData===3){
                        props.history.push("/learner");
                        window.location.reload();
                    }                    
                })
                .catch((e) => {
                    setLoading(false);
                    // console.log('message');
                    // console.log(message);
                    // console.log(e);
                    // if(message=='Request failed with status code 401'){
                    //     errors.message = "Email or password mismatch";
                    //     setError(errors);
                    // }else{
                    //     errors.message = "Authencation failed. Please try again";
                    //     setError(errors);
                    // }
                });
        } else {
            setLoading(false);
            setError(errors);         
        }
    };
    if (isLoggedIn && userRoleData==1) {
        return <Redirect to="/admin" />;
    } else if (isLoggedIn && userRoleData==2) {
        return <Redirect to="/tutor" />;
    } else if (isLoggedIn && userRoleData==3) {
        return <Redirect to="/learner" />;
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onChangeForgetEmail = (e) => {
        const forget_email = e.target.value;
        setForgetEmail(forget_email);
    };
    const handleForgetPassword = (e) =>{
        console.log(forgetEmail);
        if(forgetEmail==""){
            setErrorP("Email required");
        }else if(!isEmail(forgetEmail)){
            setErrorP("Valid email required");
        }else{
            setErrorP("");
            var requestData = {
                email :forgetEmail
            }
            CommonService.postData('auth/forgetPassword',requestData)
            .then(response => {
                setLoading(false);
                if(response.data.success===true){
                    toast.success(response.data.message,{autoClose: true});
                }else if(response.data.success===false){
                    toast.error(response.data.message,{autoClose: true});
                }
            })
            .catch(e => {
                setLoading(false);
                toast.error(e.message,{autoClose: true});
            });
        }
    }
    
    return (
        <div>
            <Header/>
            <Banner/>
            <section className="login_section">
                <div className="container">
                <div className="learner_title">
                    <h2>ACCESS THE SYSTEM</h2>  
                    
                    <form onSubmit={handleLogin}>
                        {error &&  error.message &&(
                            <div className="form-group">
                                <div className="alert alert-danger" role="alert">
                                    {error.message}
                                </div>
                            </div>
                        )}
                        <div className="form-group">
                            <input type="text" className="loginInput" placeholder="Enter your email address" name="useremail" onChange={onChangeUseremail} /> 
                            <span className="errorMsg"> {error && error.useremail}</span>        
                        </div>
                        <div className="form-group">
                            <input type="password" className="loginInput" placeholder="Enter your password"  name="userpassword" onChange={onChangeUserPassword} /> 
                            <span className="errorMsg"> {error && error.userpassword}</span>        
                        </div>       
                        <div className="text-center">
                            <button className="logInBtnAr" disabled={loading}>
                            {loading && (
                                <span className="login_spinner"><i className="fa fa-spinner fa-spin"></i></span>
                            )}
                            
                                LOGIN
                            </button>                            
                        </div>
                    </form>        
                </div>  
                <div>
                    <Button  className="forgetPassBtn" onClick={handleShow}>Forgot Password </Button>
                
                    <Modal show={show} onHide={handleClose} className="forgetPassModal">
                        <Modal.Header closeButton>
                            <Modal.Title>Forgot Password</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <label for="useremail" class="arLabel1">Enter your email : </label>
                            
                            <div class="arGroupOfForgotPass">
                                <input type="text" className="loginInput" placeholder="Enter your email address" name="useremail" onChange={onChangeForgetEmail} />
                            
                            <span className="errorMsg"> {errorP}</span> 
                            <Button variant="primary" className="ar_sendBtn2" onClick={handleForgetPassword}> Send </Button> 
                            </div> 
                        </Modal.Body>
                        <Modal.Footer>
                        </Modal.Footer>
                    </Modal>
                </div>
                </div>
            </section>
            <Footer/>        
        </div>
    );
}

export default Login;