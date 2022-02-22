import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Pagination from 'react-js-pagination';
import user_varible from '../../../Utils/Utils';
import CommonService from "../../../../services/CommonService";

import CustomLoader from "../../../Common/CustomLoader";
import { changeCurrentPage } from "../../../../store/actions/nav";

// import { toast } from 'react-toastify';
// import swal from 'sweetalert';

function AssessmentResultList(props) {
    const itemNumber          = user_varible.paagingnation_numberOfItems;
    const dispatch                          = useDispatch();
    const [learnerAssessments, setLearnerAssessments] = useState([]);
    const [loader, setLoader]               = useState(false);
    const [searchTitle,setSearchTitle]      = useState("");
    const [totalRecords, setTotalRecords]   = useState(0);
    const [activePage, setActivePage]       = useState(1);
    const [limit, setLimit]                 = useState(5);
    const [offset, setOffset]               = useState(0);
    const [sort, setSort]                   = useState({
                                                field: 'id',
                                                order: 'asc'
                                            });
    useEffect(() => {
        setActivePage(1);
        retrieveLearnerAssessments(limit, offset, sort, activePage, searchTitle);
        dispatch(changeCurrentPage('Admin-Learner-Assessment'));
    }, [props?.match?.params?.id]);  
    
    const retrieveLearnerAssessments = (limit, offset, sort, page, searchTitle) => {
        setLoader(true); 
        var assessment_id = props?.match?.params?.id;
        CommonService.getAllWithPage('admin-learner-assessments/'+assessment_id,{ limit, offset, sort, page, searchTitle })
        .then(response => {
            console.log(response.data.data);
            const learnerassessmentlists = response.data.data.learnerAssessmentData.data;
            
            setLearnerAssessments(learnerassessmentlists);
            setTotalRecords(response.data.data.total);
            setLoader(false);
            console.log(learnerAssessments);
        })
        .catch(e => {
            console.log(e);
            setLoader(false);
        });
    }; 

    const onPageChanged = (page, limitParam) => {
        const limitData = limitParam ? limitParam : limit;
        const pageOffset = (page - 1) * limitData;
        setOffset(pageOffset);
        setLimit(limitData);
        setActivePage(page);
        if (!limitParam) retrieveLearnerAssessments(limitData, pageOffset, sort, page);
    }                                     
    return (
        <div>
            <div className="row justify-content-center">
                <div className="col-md-8 col-8">
                    <div className="input-group-append align-items-center">
                        {/* <span>Search : </span><input type="text" className="form-control col-4 search-field3" onChange={onChangeSearchTitle} />
                            <button className="addLearner" onClick={findByTitle} >Search</button> */}
                    </div>
                </div>
                <div className="col-md-12 col-12 mt-3">
                    {(loader)?
                            <CustomLoader />:
                    <div className="table-responsive-md">                        
                        <table className="table table-borderd learner_table">
                        <thead>
                            <tr>
                            <th colSpan="5">Learner Assessment List</th>                  
                            </tr>
                        </thead>
                        <tbody>
                            {learnerAssessments &&
                                learnerAssessments.map((learnerAssessment, index) => (
                                <tr key={learnerAssessment.id}>
                                    <td>{learnerAssessment.title}</td> 
                                    <td>{learnerAssessment.learner_fname+' '+learnerAssessment.learner_lname}</td> 
                                    <td>{learnerAssessment.total_marks}</td>
                                    <td>{learnerAssessment.total_obtained_marks}</td>
                                    <td>
                                        {(function() {
                                            if (learnerAssessment.status=='result_out') { 
                                                return <Link to={"/admin/learner-assessment-result/" + learnerAssessment.id +'/'+learnerAssessment.learner_user_id} className="detailsSection">View Result <i className="fa fa-angle-right"></i></Link> 
                                            } else {
                                                return learnerAssessment.status;
                                            }
                                        })()}
                                    
                                    </td>
                                </tr>
                            ))}                      
                            
                        </tbody>            
                        </table>
                    </div>
                    }
                    <div className="rows">
                        <div className="column">
                        {(learnerAssessments && parseInt(totalRecords)>5)?
                            <Pagination
                                activePage={parseInt(activePage)}
                                itemsCountPerPage={parseInt(limit)}
                                totalItemsCount={totalRecords}
                                pageRangeDisplayed={5}
                                onChange={(e) => onPageChanged(e)}
                                itemclassName="page-item "
                                linkclassName="page-link"
                            />
                            :''
                            }
                        </div>
                    </div>                        
                                            
                </div>  

            </div>
        </div>
    );
}

export default AssessmentResultList;