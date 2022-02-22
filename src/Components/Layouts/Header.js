import React from 'react';
import { Link  } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import logo from '../../assets/img/logo.png';

import { logout } from "../../store/actions/auth";

const Header = (props) => {
    const { isLoggedIn,userRoleData } = useSelector(state => state.auth);
    const dispatch = useDispatch();

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
                                
                                    <li className="nav-item ">
                                        <Link to="/login" className="nav-link">&nbsp;</Link>
                                    </li>
                                    {/* <li className="nav-item">
                                        <Link to="/login"  className="nav-link">TUTORS</Link>
                                    </li>
                                    <li className="nav-item ">
                                        <Link to="/login" className="nav-link">ASSESSMENTS</Link>
                                    </li> */}
                                </ul>
                            </nav>
                            </div>
                            <div className="col-auto search_part">
                                <div className="search-wrap">
                                    {/* <button>
                                        <i className="fa fa-search"></i>
                                    </button>
                                    <input type="text" className="search_field"/> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </header>                
        </div>
    );
}
export default Header;