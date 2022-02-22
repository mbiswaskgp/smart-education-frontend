import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import CommonService from "../../../../services/CommonService";
import { changeCurrentPage } from "../../../../store/actions/nav";

import CustomLoader from "../../../Common/CustomLoader";

import Pagination from 'react-js-pagination';
import { toast } from 'react-toastify';

//import swal from 'sweetalert';

const MonitorResults = (props) => {
    const dispatch                          = useDispatch();
    const [assessmentData, setAssessmentData]= useState([]);
    const [tutorData, setTutorData]         = useState([]);
    const [learnerAssessments, setLearnerAssessments] = useState([]);
    const [loader, setLoader]               = useState(false);
    const [searchTitle, setSearchTitle]     = useState("");
    const [loaderArr, setLoaderArr]         = useState([]);

    const [totalRecords, setTotalRecords]   = useState(0);
    const [activePage, setActivePage]       = useState(1);
    const [limit, setLimit]                 = useState(10);
    const [offset, setOffset]               = useState(0);
    const [sort, setSort]                   = useState({
                                                field: 'id',
                                                order: 'desc'
                                            }); 

    const assessmentId=props.match.params.assessmentId;
    const tutorId=props.match.params.tutorId;  
    
                                          
    useEffect(() => {
        retrieveAllAssessmentsMonitorResult(limit, offset, sort, props.match.params.assessmentId, props.match.params.tutorId)
        dispatch(changeCurrentPage('adminTutor'));
    }, [props.match?.params?.assessmentId, props.match?.params?.tutorId]);

    const retrieveAllAssessmentsMonitorResult = (limit, offset, sort, assessmentId, tutorId) => {
        setLoader(true);
        var pageData = {
            limit: limit,
            offset: offset,
            sort: sort,
            title: searchTitle,
            tutorId: tutorId,
            assessmentId: assessmentId
        }
        CommonService.findByTitle('tutor-assessment-monitor-results/', pageData)
        .then(response => {
            setLearnerAssessments(response.data.data.learnerAssessments.data);
            
            console.log(response.data.data.learnerAssessments.data);
            setAssessmentData(response.data.data.assessmentData);
            setTutorData(response.data.data.tutorData);
            
            setTotalRecords(response.data.data.total);
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
        retrieveAllAssessmentsMonitorResult(limit, offset, sort, assessmentId, tutorId);
    };
    const onPageChanged = (page) => {
        const pageOffset = (page - 1) * limit;
        setOffset(pageOffset);
        setActivePage(page);
        retrieveAllAssessmentsMonitorResult(limit, pageOffset, sort,assessmentId,tutorId);
    }
    // const onPageChanged = (page, limitParam) => {
    //     const limitData = limitParam ? limitParam : limit;
    //     const pageOffset = (page - 1) * limitData;
    //     setOffset(pageOffset);
    //     setLimit(limitData);
    //     setActivePage(page);
    //     if (!limitParam) retrieveAllAssessmentsMonitorResult(limitData, pageOffset, sort, tutorId);
    // }
    const handleDownloadPdf = (id) => {
        setLoaderArr({ ...loaderArr, id: id });
        var data = {};
        CommonService.getBlobById('learner-certificate-pdf', id)
        .then(response => {
            console.log(response);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'assessment-result.pdf'); //or any other extension
            document.body.appendChild(link);
            link.click();
            //console.log(response.data.data.learnerDataCnt);
            setLoaderArr({ ...loaderArr, id: '' }); 
             
        })
        .catch(e => {
            toast.error(e,{autoClose: true});    
            setLoaderArr({ ...loaderArr, id: '' });       
        });
    }
    return (
        <div className="row justify-content-center">
            <div className="col-md-12 col-12">
                Tutor : {tutorData.fname+' '+tutorData.lname} | Assessment : 
                {assessmentData.name}
            </div>
            <div className="col-md-8 col-12">
                <div className="input-group-append align-items-center">
                    <span>Search : </span><input type="text" className="form-control col-4 search-field3" onChange={onChangeSearchTitle} />
                    <button className="addLearner" onClick={findByTitle}>Search</button>
                </div>
            </div>
            <div className="col-md-4 col-12">
                {/* <Link to={"/admin/tutor/assign-learner/" + tutorId} className="detailsSection"> Assign Learner <i className="fa fa-plus-circle"></i></Link> */}
            </div>
            
            
            <div className="col-md-12 col-12 mt-3">
            {(loader)?
                    <CustomLoader />:
                <div className="table-responsive-md">
                
                    <table className="table table-borderd learner_table">
                        <thead>
                            <tr>
                                <th>Learner</th>
                                <th>Duration</th>
                                <th>Total Marks</th>
                                <th>Obtained Marks</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {learnerAssessments.length>0 &&
                            learnerAssessments.map((assessment) => (
                            <tr key={assessment.id}>
                                
                                <td>
                                    {assessment.learner_fname+' '+assessment.learner_lname}
                                </td>
                                <td>
                                    {assessment.active_start_date+' - '+assessment.active_end_date}
                                </td>
                                <td>
                                    {assessment.assessment_data.total_marks}
                                </td>
                                <td>
                                    {assessment.total_obtained_marks}
                                </td>

                                <td>
                                    {(assessment.add_manual_marks=='yes')?'Historical Assessment':assessment.status}
                                </td>
                                <td>
                                    {(assessment.status=='result_out')?<Link to={'/admin/learner-assessment-result/'+assessment.id+'/'+assessment.assessment_id} className="detailsSection">
                                    <i className="fa fa-file" aria-hidden="true" title="View Result"></i>
                                    </Link>:''}
                                    {(function() {
                                        if (assessment.status=='result_out') {
                                            return <span>
                                                {(loaderArr?.id==assessment.id)?
                                                <i className="fa fa-spinner fa-pulse"></i>
                                                :
                                                <button className="iconButton2" onClick={() => handleDownloadPdf(assessment.id)}><span><i className="fa fa-file-pdf-o" aria-hidden="true"></i></span></button>
                                                }
                                            </span>;
                                        } 
                                    })()}                                   
                                    
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

export default MonitorResults;