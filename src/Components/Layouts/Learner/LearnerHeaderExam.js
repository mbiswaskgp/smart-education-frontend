import React, { useState } from 'react';
import { Link  } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import swal from 'sweetalert';
import { logout } from "../../../store/actions/auth";
import { toast } from 'react-toastify';

import logo from '../../../assets/img/logo.png';

const LearnerHeaderExam = (props) => {

    const dispatch                          = useDispatch();
    const { currentNav }                    = useSelector(state => state.nav);
    const { isLoggedIn, user }              = useSelector(state => state.auth);
    const [formData, setFormData]           = useState([]);
    const logOut = () => {
        dispatch(logout());
    };

    const saveTakeABreak = (e) => {
        e.preventDefault();
        const dataSubmit2 = {
            answerData: formData,
            saveStatus:'take_a_break'
        };
        swal({
            title: "Are you sure?",
            text: "Save and finish it later!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            
            if (willDelete) {
                saveQuestionAnswer(dataSubmit2);
            }

        });
    };
    const saveQuestionAnswer = (dataSubmit) => {
        toast.success('Your paper successfully saved',{autoClose: true});
    }
    
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
                        <div className="col log_in_group d-flex">
                            <div className="takeAbreak">
                                <h2>take a break</h2>
                                <p>Save and finish it later</p>
                                <button className="saveActivity" onClick={saveTakeABreak}>SAVE</button>
                            </div>
                        </div>
                        </div>
                    </div>
                </section>
                <section className="bottom_container">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col menu_part">
                                <nav className="customNav">
                                    <ul className="navbar-nav flex-lg-row">
                                        <li className={(currentNav=="adminDashboard")?"nav-item active":"nav-item"} >
                                            <Link to="/learner" className="nav-link">DASHBOARD</Link>                                   
                                        </li>
                                        <li><h4 className="learnerNamessf">{user.user.fname + ' ' + user.user.lname}</h4></li>
                                    </ul>
                                </nav>
                            </div>
                        
                            <div className="col-auto search_part">     
                                    
                                {(isLoggedIn)?
                                <Link to="/login" className="logOutBtn" onClick={logOut}>LOGOUT</Link>
                                :
                                <Link to="/login" className="LogOutBtn">LOGIN</Link>
                                }
                                
                            </div>
                        </div>
                    </div>
                </section>
            </header>                
        </div>
    );
}

export default LearnerHeaderExam;