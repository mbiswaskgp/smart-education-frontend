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

function TutorLearnerAssessmentLists(props) {
    const itemNumber          = user_varible.paagingnation_numberOfItems;
    const dispatch                          = useDispatch();
    const [assessments, setAssessments]     = useState([]);
    const [loader, setLoader]               = useState(false);
    const [searchTitle,setSearchTitle]      = useState("");
    const [totalRecords, setTotalRecords]   = useState(0);
    const [activePage, setActivePage]       = useState(1);
    const [limit, setLimit]                 = useState(10);
    const [offset, setOffset]               = useState(0);
    const [sort, setSort]                   = useState({
                                                field: 'id',
                                                order: 'asc'
                                            });
    useEffect(() => {
        retrieveLearnerAssessments(limit, offset, sort, searchTitle);
        dispatch(changeCurrentPage('tutorLearnerAssessment'));
    }, [props?.match?.params?.id]);   
    
    const retrieveLearnerAssessments = (limit, offset, sort, searchTitle) => {
        setLoader(true); 
        var id = props?.match?.params?.id;
        CommonService.getAllWithPage('tutor-learner-assessments/'+id,{ limit, offset, sort, searchTitle })
        .then(response => {
            const assessmentlists = response.data.data.learnerAssessmentData.data;
            console.log(assessmentlists);
            setAssessments(assessmentlists);
            setTotalRecords(response.data.data.total);
            setLoader(false);
            
        })
        .catch(e => {
            console.log(e);
            setLoader(false);
        });
    };

    const onPageChanged = (page) => {
        //console.log(searchTitle);
        const pageOffset = (page - 1) * limit;
        setOffset(pageOffset);
        setActivePage(page);
        retrieveLearnerAssessments(limit, pageOffset, sort,searchTitle);
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
                                <th>Assessment</th>
                                <th>Learner</th>
                                <th>Duration</th>
                                <th>Total Marks</th>
                                <th>Obtained Marks</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assessments &&
                                assessments.map((assessment, index) => (
                                <tr key={assessment.id}>
                                    <td>{assessment.assessment_name}</td> 
                                    <td>{assessment.learner_fname+' '+assessment.learner_lname}</td> 
                                    <td>{assessment.active_start_date +' - '+assessment.active_end_date}</td> 
                                    <td>{assessment.assessment_data.total_marks}</td>
                                    <td>{assessment.total_obtained_marks}</td>
                                    <td>{assessment.status}</td>
                                    <td>
                                        {(function() {
                                            if (assessment.status=='result_out') { 
                                                return <Link to={"/tutor/learner-assessment-result/" + assessment.id +'/'+assessment.learner_user_id} className="detailsSection">View Result <i className="fa fa-angle-right"></i></Link> 
                                            } else if(assessment.status=='completed') {
                                                return <Link to={"/tutor/learner-assessment-answers/" + assessment.id + '/'+assessment.learner_user_id} className="detailsSection">Calculate Result <i className="fa fa-angle-right"></i></Link>
                                            } else if(assessment.add_manual_marks=='yes') { 
                                                return 'Manual Marks Add';
                                            }else {
                                                return assessment.status;
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
                        {(assessments && parseInt(totalRecords)>limit)?
                            <Pagination
                                activePage={parseInt(activePage)}
                                itemsCountPerPage={parseInt(limit)}
                                totalItemsCount={totalRecords}
                                pageRangeDisplayed={5}
                                onChange={(e) => onPageChanged(e)}
                                itemclassName="page-item"
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

export default TutorLearnerAssessmentLists;