import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Pagination from 'react-js-pagination';
import user_varible from '../../../Utils/Utils';
import CommonService from "../../../../services/CommonService";

import CustomLoader from "../../../Common/CustomLoader";
import { changeCurrentPage } from "../../../../store/actions/nav";

import { toast } from 'react-toastify';
import swal from 'sweetalert';

function LearnerAssessments() {
    const dispatch                          = useDispatch();
    const [loader, setLoader]               = useState(false);
    const [searchTitle,setSearchTitle]      = useState("");
    
    useEffect(() => {
        dispatch(changeCurrentPage('adminLearner'));
    }, []);
    return (
        <div>
            <div className="row justify-content-center">
                <div className="col-md-8 col-8">
                    <div className="input-group-append align-items-center">
                        
                    </div>
                </div>
               
                <div className="col-md-12 col-12 mt-3">
                    {(loader)?
                            <CustomLoader />:
                    <div className="table-responsive-md">                        
                        Exam Form submitted successfully 
                        
                    </div>
                    
                    }
                                         
                                            
                </div>   
            </div>
        </div>
    );
}

export default LearnerAssessments;