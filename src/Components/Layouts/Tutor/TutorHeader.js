
import React, { Component } from 'react';
import { Link  } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../../store/actions/auth";

import logo from '../../../assets/img/logo.png';

const TutorHeader = (props) => {

    const dispatch = useDispatch();
    const { currentNav } = useSelector(state => state.nav);
    const { isLoggedIn, user } = useSelector(state => state.auth);

    const logOut = () => {
        dispatch(logout());
    };

    return (            
        <div>
            <header className="main_header">
                <section className="top_header">
                    <div className="container">
                        <div className="row">
                        <div className="logo_part col-auto">
                            <Link to="/">
                            <img src={logo} alt="" />
                            </Link>
                        </div>
                        <div className="col log_in_group">

                            <ul className="d-flex justify-content-end">                              
                                
                               {(isLoggedIn)?
                                <li><Link to="/login" className="LogOutBtn" onClick={logOut}>LOGOUT</Link></li>
                               :
                                <li><Link to="/login" className="LogOutBtn">LOGIN</Link></li>
                               }
                                      
                            </ul>

                               <div className="usrNameHeadTxt">
                               {user.user.fname + ' ' + user.user.lname}
                               </div>
                            
                        </div>
                        </div>
                    </div>
                </section>
                <section className="bottom_container">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col menu_part">
                                <button className="hambergerBtn">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </button>
                                <nav className="customNav">
                                    <ul className="navbar-nav flex-lg-row">
                                        {/* <li className="nav-item active" > */}
                                        <li className={(currentNav=="tutorDashboard")?"nav-item active":"nav-item"} >
                                            <Link to="/tutor/dashboard" className="nav-link">DASHBOARD</Link>   
                                        </li>
                                        <li className={(currentNav=="tutorLearner" || currentNav=="adminLearner")?"nav-item active":"nav-item"} >
                                            <Link to="/tutor/learner" className="nav-link">Learner</Link>   
                                        </li>   
                                        <li className={(currentNav=="tutorLearnerAssessment")?"nav-item active":"nav-item"} >
                                            <Link to="/tutor/assessment-list" className="nav-link">Assessments</Link>   
                                        </li> 
                                        <li className={(currentNav=="tutorChangePassword")?"nav-item active":"nav-item"} >
                                            <Link to="/tutor/change-password" className="nav-link">Change Password</Link>   
                                        </li>                        
                                    </ul>
                                </nav>
                            </div>
                            <div className="col-auto search_part">
                                <div className="search-wrap">
                                    <button><i className="fa fa-search"></i></button>
                                    <input type="text" className="search_field"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </header>                
        </div>
    );
}

export default TutorHeader;