import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import Banner from "../Layouts/Banner";
import Footer from "../Layouts/Footer";
import LearnerHeader from "../Layouts/Learner/LearnerHeader";
import { changeCurrentPage } from "../../store/actions/nav";
import clappingHandsImg from '../../assets/img/clapping-hands.gif';
import { logout } from "../../store/actions/auth";

// import { changeCurrentPage } from "../../store/actions/nav";
import { toast } from 'react-toastify';
function LearnerDashboard(props) {
    const dispatch                  = useDispatch();
    const [mssageId, setMssageId]   = useState(false);

    useEffect(() => {
        console.log(props.match.params.msgId);
        setMssageId(props.match.params.msgId);
        dispatch(changeCurrentPage('frontendLearner'));
    },[props]);
    const logOut = () => {
        dispatch(logout());
    };
    return (
        <div>
            <LearnerHeader/>
                {/*  */}
                <section className="question-management">
                    <div className="container">
                    
                        {(mssageId==1)?
                            <div className="learner_title logOut_part">
                                <h2>Well Done</h2>  
                                <form action="">
                                <div className="form-group">
                                    <img src={clappingHandsImg} alt="" />
                                </div>
                                <div className="form-group">

                                    <h4>You Have completed your assessment.<br/>
                                    all your hard work has been sent to your tutor and they will let you know your score soon.<br/>
                                    you can now log out</h4>         
                                </div>       
                                <div className="text-center">
                                    <button className="logInBtnAr" onClick={logOut}>Logout </button>
                                </div>
                                </form>        
                            </div>  
                        :''}   
                        {(mssageId==2)?
                            <div className="learner_title logOut_part">
                                <h2>Well Done</h2>  
                                <form action="">
                                {/* <div className="form-group">
                                    <img src={clappingHandsImg} alt="" />
                                </div> */}
                                <div className="form-group">
                                    
                                    <h4>Due to 10 incorrect answer your paper automatically submitted </h4>         
                                </div>       
                                <div className="text-center">
                                    <button className="logInBtnAr" onClick={logOut}>Logout </button>
                                </div>
                                </form>        
                            </div>  
                        :''}                         
                    </div>
                </section>
                {/*  */}
            <Footer/>        
        </div>
    );
}

export default LearnerDashboard;