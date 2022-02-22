import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import CommonService from "../../../../services/CommonService";
import { changeCurrentPage } from "../../../../store/actions/nav";

import CustomLoader from "../../../Common/CustomLoader";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';

import swal from 'sweetalert';

const AssignAssessmenDetailstList = (props) => {
    const dispatch                              = useDispatch();
    const [learnersAssessments, setLearnersAssessments] = useState([]);
    const [loader, setLoader]                   = useState(false);
    const [loaderArr, setLoaderArr]             = useState([]);
    //const [searchTitle,setSearchTitle]        = useState("");   
    const [learnerDataCnt, setLearnerDataCnt]   = useState(0);
    const [assessmentId, setAssessmentId]       = useState(0);
    const [learnerId, setLearnerId]             = useState(0);
       
    
    useEffect(() => {
        retrieveLearnerAssessment(props.match.params.id,props.match.params.id2)
        dispatch(changeCurrentPage('adminLearner'));
        setAssessmentId(props.match.params.id);
        setLearnerId(props.match.params.id2);
    }, [props.match.params.id,props.match.params.id2]);


    const retrieveLearnerAssessment = (assessmentId,learnerId) => {
        console.log(assessmentId);
        console.log(learnerId);
        setLoader(true);
        let data = {};
        CommonService.getAllWithData('assign-learner-assessment-details/'+assessmentId+'/'+learnerId, data)
        .then(response => {
            var learnersData = response.data.data.assessmentData.data; 
            setLearnersAssessments(learnersData);
            
            console.log(response.data.data.assessmentData.data);
            // if(response.data.data.total==0){
            //     toast.info('No record found');
            // }
            setLearnerDataCnt(response.data.data.learnerDataCnt)
            console.log(response.data.data.learnerDataCnt);
            setLoader(false);              
        })
        .catch(e => {
            setLoader(false);
            console.log(e);
            toast.error(e,{autoClose: true});            
        });
    };
    const deleteAssignedLearner = (id) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                CommonService.deleteData('learnerAssessment',id)
                .then(response => {
                    console.log(response.data);
                    if(response.data.success){
                        retrieveLearnerAssessment(learnerId);
                        toast.success(response.data.message);
                    }                    
                })
                .catch(e => {
                    toast.error(e,{autoClose: true});   
                });
            }
        });
    }
    const handleDownloadPdf = (id) => {
        setLoaderArr({ ...loaderArr, id: id });
        var data = {};
        CommonService.getBlobById('learner-assessment-download-pdf', id)
        .then(response => {
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

    const deleteLearnerAssessment = (id) => {
       
        swal({
            title: "Are you sure?",
            text: "Do you really want to delete this leaner assessment?",
            icon: "warning",
            buttons:  ["CANCEL", "YES"],
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                CommonService.remove('adminDeleteLearnerAssessment',id)
                .then(response => {
                    //console.log(response.data);
                    if(response.data.success){
                        
                        retrieveLearnerAssessment(assessmentId,learnerId);
                        toast.success(response.data.message);
                    }                    
                })
                .catch(e => {
                    toast.error(e,{autoClose: false});   
                });
            }
        });  
        
    }
    // const onChangeSearchTitle = e => {
    //     const searchTitle = e.target.value;
    //     setSearchTitle(searchTitle);
    //     //console.log(searchTitle);
    // };

    // const findByTitle = () => {
    //     setLoader(true);
    //     //console.log(searchTitle);
    //     var data = {
    //         title: searchTitle,
    //     };
        
    //     CommonService.findByTitle('assign-learner-assessment/'+learnerId, data)
    //         .then(response => {
                
    //             var assessmentData = response.data.data.assessmentData.data; 
    //             learnersAssessments(assessmentData);
    //             console.log(response.data.data.assessmentData.data);
    //             setLoader(false);
    //             console.log(learnersAssessments);
    //         })
    //         .catch(e => {
    //             toast.error(e,{autoClose: true});   
    //             setLoader(false);
    //         });
    // };

    return (
        <div className="row justify-content-center">
            <div className="col-md-8 col-8">
                
            </div>
            
           
            
            <div className="col-md-12 col-12 mt-3">
                
                <div className="table-responsive-md tutorWrp">
                    <table className="table table-borderd learner_table">
                        <thead>
                            <tr>
                                <th colSpan="7">Learner Assessment List</th>                  
                            </tr>
                        </thead>
                        <tbody>
                        {learnersAssessments.length>0 &&
                            learnersAssessments.map((assessment, index) => (
                            <tr key={assessment.id}>
                                <td>{assessment.learner_fname+' '+assessment.learner_lname}</td> 
                                <td>{assessment.title}</td> 
                                <td>{assessment?.assessment_data?.name}</td> 
                                <td>{assessment.schedule_assessment}</td> 
                                <td>{assessment.active_start_datetime + ' - ' + assessment.active_end_datetime}</td> 
                                <td>{assessment.status}</td>
                                <td>
                                    <span className="detailsSection" onClick={() => deleteAssignedLearner(assessment.id)}>Remove</span>
                                    
                                    {(assessment.add_manual_marks=='yes')?
                                    <Link to={"/admin/learner/edit-assign-assessment/" + assessment.id+'/'+learnerId} className="detailsSection">Edit <i className="fa fa-angle-right"></i></Link>
                                    :''}
                                    &nbsp;

                                    {(assessment.status=='result_out')?<Link to={'/admin/learner-assessment-result/'+assessment.id+'/'+assessment.assessment_id} className="detailsSection">
                                        View Result
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
                                    <button className="iconButton" title="Delete Learner Assessment" onClick={() => deleteLearnerAssessment(assessment.id)}><span><i className="fa fa-trash-o" aria-hidden="true"></i></span></button>
                                    
                                </td>
                            </tr>
                        ))}                
                        </tbody>            
                    </table>                  

                {(loader)?
                    <CustomLoader />:''
                }

                </div>
            </div>            
        </div>
    );
};

export default AssignAssessmenDetailstList;