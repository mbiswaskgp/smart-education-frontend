import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import CommonService from "../../../../services/CommonService";
import { changeCurrentPage } from "../../../../store/actions/nav";

import CustomLoader from "../../../Common/CustomLoader";

import Pagination from 'react-js-pagination';
import { toast } from 'react-toastify';

//import swal from 'sweetalert';

const TutorAssignAssessment = (props) => {
    const dispatch                          = useDispatch();
    const [assessments, setAssessments]     = useState([]);
    const [loader, setLoader]               = useState(false);
    const [searchTitle, setSearchTitle]     = useState("");
    const [totalRecords, setTotalRecords]   = useState(0);

    const [activePage, setActivePage]       = useState(1);
    const [limit, setLimit]                 = useState(10);
    const [offset, setOffset]               = useState(0);
    const [sort, setSort]                   = useState({
                                                field: 'id',
                                                order: 'desc'
                                            }); 

    const tutorId=props.match.params.id;

    useEffect(() => {
        retrieveAllAssignAssessments(limit, offset, sort, props.match.params.id)
        dispatch(changeCurrentPage('adminTutor'));
    }, [props.match.params.id]);

    const retrieveAllAssignAssessments = (limit, offset, sort, tutor_id) => {
        setLoader(true);
        var pageData = {
            limit: limit,
            offset: offset,
            sort: sort,
            title: searchTitle
        }
        CommonService.findByTitle('tutor-assign-assessments/'+tutor_id, pageData)
        .then(response => {
            var learnersData = response.data.data.assessments.data; 
            setAssessments(learnersData);
            
            console.log(response.data.data.assessments.data);
            // if(response.data.data.total==0){
            //     toast.info('No record found');
            // }
            setTotalRecords(response.data.data.total);
            console.log(assessments);
            setLoader(false);              
        })
        .catch(e => {
            setLoader(false);
            console.log(e);
            toast.error(e,{autoClose: false});            
        });
    };


    const onChangeSearchTitle = e => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
    };

    const findByTitle = () => {
        setActivePage(1);
        setLimit(10);
        setOffset(0);
        retrieveAllAssignAssessments(limit, offset, sort, tutorId);
    };
    const onPageChanged = (page, limitParam) => {
        const limitData = limitParam ? limitParam : limit;
        const pageOffset = (page - 1) * limitData;
        setOffset(pageOffset);
        setLimit(limitData);
        setActivePage(page);
        if (!limitParam) retrieveAllAssignAssessments(limitData, pageOffset, sort,tutorId);
      }
    //const notify = () => toast.error("Wow so easy !");

    return (
        <div className="row justify-content-center">
            <div className="col-md-12 col-12">
                Assigned Assessment List
            </div>
            <div className="col-md-8 col-12">
                <div className="input-group-append align-items-center">
                    <span>Search : </span><input type="text" className="form-control col-4 search-field3" onChange={onChangeSearchTitle} />
                        <button className="addLearner" onClick={findByTitle}>Search</button>
                </div>
            </div>
            <div className="col-md-4 col-12">
                <Link to={"/admin/tutor/assign-learner/" + tutorId} className="detailsSection"> Assign Learner <i className="fa fa-plus-circle"></i></Link>
            </div>
            
            <div className="col-md-12 col-12 mt-3">
            {(loader)?
                    <CustomLoader />:
                <div className="table-responsive-md">
                
                    <table className="table table-borderd learner_table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Number of learner</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {assessments.length>0 &&
                            assessments.map((assessment) => (
                            <tr key={assessment.id}>
                                <td>{assessment.assessment_name}</td> 
                                <td>
                                    <Link to={'/admin/tutor/assessment-details/'+assessment.id} className="detailsSection">
                                    {(assessment.total_learner)?assessment.total_learner:'-'}
                                    </Link>
                                </td>
                                <td>
                                    <Link to={'/admin/tutor/assessment-monitor-results/'+assessment.assessment_id+'/'+assessment.tutor_user_id} className="detailsSection">
                                        Monitor Result
                                    </Link>
                                </td>
                            </tr>
                        ))}                
                        </tbody>            
                    </table> 
                    <div className="rows">
                        <div className="column">
                        <Pagination
                            activePage={parseInt(activePage)}
                            itemsCountPerPage={parseInt(limit)}
                            totalItemsCount={totalRecords}
                            
                            onChange={(e) => onPageChanged(e)}
                            itemclassName="page-item "
                            linkclassName="page-link"
                        />
                        </div>
                    </div>
                </div>
                }
            </div>            
        </div>
    );
};

export default TutorAssignAssessment;