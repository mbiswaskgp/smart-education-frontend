import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import CommonService from "../../../../services/CommonService";
import { changeCurrentPage } from "../../../../store/actions/nav";

import CustomLoader from "../../../Common/CustomLoader";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import swal from 'sweetalert';
//import swal from 'sweetalert';

const LearnerAssignAssessmentDertailsList  = (props) => {
    const dispatch                              = useDispatch();
    const [learnersAssessments, setLearnersAssessments] = useState([]);
    const [learnersName, setLearnersName]       = useState('');
    const [loader, setLoader]                   = useState(false);
    const [loaderArr, setLoaderArr]             = useState([]);
    const [loaderArr1, setLoaderArr1]           = useState([]);
    const [loaderArr2, setLoaderArr2]           = useState([]);
    const [assessmentId, setAssessmentId]       = useState(0);
    const [learnerId, setLearnerId]             = useState(0);

    // const [searchTitle,setSearchTitle]          = useState("");   
    // const [learnerDataCnt, setLearnerDataCnt]   = useState(0);   
    // const learnerId = props.match.params.learnerId;
    // const assesmentId = props.match.params.assesmentId;
    useEffect(() => {
        retrieveLearnerAssessment(props.match.params.learnerId,props.match.params.assesmentId)
        dispatch(changeCurrentPage('adminLearner'));
        
        setAssessmentId(props.match.params.assesmentId);
        setLearnerId(props.match.params.learnerId);
    }, [props.match.params.learnerId,props.match.params.assesmentId]);

    const retrieveLearnerAssessment = (learnerId,assesmentId) => {
        setLoader(true);
        let data = {};
        CommonService.getAllWithData('assign-learner-assessment/'+learnerId+'/'+assesmentId, data)
        .then(response => {
            var learnersData = response.data.data.assessmentData.data;
            //console.log(learnersData); 
            setLearnersAssessments(learnersData);
            setLearnersName(response.data.data.learnerName);
            
            // if(response.data.data.total==0){
            //     toast.info('No record found');
            // }
            setLoader(false);              
        })
        .catch(e => {
            setLoader(false);
            
            toast.error(e,{autoClose: true});            
        });
    };
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

    const handleDownloadCertificatePdf = (id) => {
        setLoaderArr1({ ...loaderArr1, id: id });
        var data = {};
        CommonService.getBlobById('learner-certificate-pdf', id)
        .then(response => {
            console.log(response);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'assessment-certificate.pdf'); //or any other extension
            document.body.appendChild(link);
            link.click();
            //console.log(response.data.data.learnerDataCnt);
            setLoaderArr1({ ...loaderArr1, id: '' }); 
             
        })
        .catch(e => {
            toast.error(e,{autoClose: true});    
            setLoaderArr1({ ...loaderArr1, id: '' });       
        });
    }
    const handleSendToParent = (id) => {
        swal({
            title: "Are you sure?",
            text: "Do you really want to send this report to the parents",
            icon: "warning",
            buttons:  ["CANCEL", "YES"],
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                setLoaderArr2({ ...loaderArr2, id: id });
                var data = {};
                CommonService.getById('learner-data-send-to-parent', id)
                .then(response => {
                    console.log(response);
                    if(response.data.success){
                        toast.success(response.data.message);  
                        setLoaderArr2({ ...loaderArr2, id: '' }); 
                    }else{
                        toast.error(response.data.message);  
                        setLoaderArr2({ ...loaderArr2, id: '' }); 
                    }    
                })
                .catch(e => {
                    toast.error(e,{autoClose: true});    
                    setLoaderArr1({ ...loaderArr2, id: '' });       
                });
            }
        });  
    }
    // const deleteAssignedLearner = (id) => {
    //     swal({
    //         title: "Are you sure?",
    //         text: "Once deleted, you will not be able to recover this!",
    //         icon: "warning",
    //         buttons: true,
    //         dangerMode: true,
    //     })
    //     .then((willDelete) => {
    //         if (willDelete) {
    //             CommonService.deleteData('learnerAssessment',id)
    //             .then(response => {
    //                 console.log(response.data);
    //                 if(response.data.success){
    //                     retrieveLearnerAssessment(learnerId);
    //                     toast.success(response.data.message);
    //                 }
                    
    //             })
    //             .catch(e => {
    //                 toast.error(e,{autoClose: true});   
    //             });
    //         }
    //     });
    // }

    // const onChangeSearchTitle = e => {
    //     const searchTitle = e.target.value;
    //     setSearchTitle(searchTitle);
    //     //console.log(searchTitle);
    // };

    // const findByTitle = () => {
    //     setLoader(true);
    //     var data = {
    //         title: searchTitle,
    //     };
        
    //     CommonService.findByTitle('assign-learner-assessment/'+learnerId, data)
    //         .then(response => {
                
    //             var assessmentData = response.data.data.assessmentData.data; 
    //             learnersAssessments(assessmentData);
                
    //             setLoader(false);
    //             //console.log(learnersAssessments);
    //         })
    //         .catch(e => {
    //             toast.error(e,{autoClose: true});   
    //             setLoader(false);
    //         });
    // };

    const deleteLearnerAssessment = (id) => {
        console.log(assessmentId);
        console.log(learnerId);
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
                        retrieveLearnerAssessment(learnerId,assessmentId);
                        toast.success(response.data.message);
                    }                    
                })
                .catch(e => {
                    toast.error(e,{autoClose: false});   
                });
            }
        });  
        
    }

    return (
        <div className="row justify-content-center">
            <div className="col-md-8 col-8">
            Learner {learnersName} Assessment List
               
            </div>
            
            <div className="col-md-4 col-4">
                <Link to={"/admin/learner/assign-assessment/" + learnerId} className="detailsSection"> Assign Assessment <i className="fa fa-plus-circle"></i></Link>
            </div>
            
            <div className="col-md-12 col-12 mt-3">
                
                <div className="table-responsive-md tutorWrp">
                
                {(loader)?
                    <CustomLoader />:
                
                    <table className="table table-borderd learner_table">
                        <thead>
                            <tr>
                                <th>Assessment Name</th> 
                                <th>Schedule</th> 
                                <th>Active Duration</th>
                                <th>Status</th> 
                                <th>Marks<br/><small>(Total/Pass/Obtained)</small></th> 
                                <th width="250px">Action</th> 
                            </tr>
                        </thead>
                        <tbody>
                        {learnersAssessments.length>0 &&
                            learnersAssessments.map((assessment, index) => (
                            <tr key={assessment.id}>
                                <td>{assessment?.assessment_data?.name}</td> 
                                <td>{assessment.schedule_assessment}</td> 
                                <td>{assessment.active_start_datetime + ' - ' + assessment.active_end_datetime}</td> 
                                <td>
                                {(function() {
                                    if (assessment.add_manual_marks=='yes') {
                                        return <span>
                                            Historical Assessment
                                        </span>;

                                    } else if (assessment.status=='result_out') {
                                        return <span>
                                            Result Out
                                        </span>;

                                    } else {
                                        return <span>
                                            {(assessment.status)?assessment.status:'-'}
                                        </span>;

                                    }
                                })()}
                                
                                </td>
                                <td>{assessment.assessment_data?.total_marks}/{(assessment.assessment_data?.pass_marks)?assessment.assessment_data?.pass_marks:'-'}/{
                                (assessment.total_obtained_marks?assessment.total_obtained_marks:'-')}</td>
                                <td>
                                   
                                    {(assessment.status==null)?
                                    <Link to={"/admin/learner/edit-assign-assessment/" + assessment.id+'/'+learnerId} className="detailsSection2">Edit <i className="fa fa-angle-right"></i></Link> :''
                                    }
                                    {(assessment.status=='completed')?
                                    <Link to={"/admin/learner-assessment-answers/" + assessment.id + '/'+assessment.learner_user_id} className="detailsSection">Calculate Result <i className="fa fa-angle-right"></i></Link> :''
                                    }
                                    {(assessment.status=='result_out')?<Link to={'/admin/learner-assessment-result/'+assessment.id+'/'+assessment.assessment_id} className="detailsSection2">
                                        Result
                                    </Link>:''}
                                    {(function() {
                                        if (assessment.status=='result_out') {
                                            return <span>
                                                {(loaderArr?.id==assessment.id)?
                                                <i className="fa fa-spinner fa-pulse"></i>
                                                :
                                                <button className="iconButton2" onClick={() => handleDownloadPdf(assessment.id)}><span><i className="fa fa-file-text-o" aria-hidden="true" title="Generate Assessment Marks"></i></span></button>
                                                }
                                            </span>;

                                        } 
                                    })()}
                                    {(function() {
                                        if (assessment.status=='result_out') {
                                            return <span>
                                                {(loaderArr1?.id==assessment.id)?
                                                <i className="fa fa-spinner fa-pulse"></i>
                                                :
                                                <button className="iconButton2" onClick={() => handleDownloadCertificatePdf(assessment.id)}><span><i className="fa fa-file-pdf-o" aria-hidden="true" title="Generate Certificate"></i></span></button>
                                                }
                                            </span>;
                                        } 
                                    })()} 
                                    {(function() {
                                        if (assessment.status=='result_out') {
                                            return <span>
                                                {(loaderArr2?.id==assessment.id)?
                                                <i className="fa fa-spinner fa-pulse"></i>
                                                :
                                                <button className="iconButton2" onClick={() => handleSendToParent(assessment.id)}><span><i className="fa fa-share-square" aria-hidden="true" title="send to parent"></i></span></button>
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
                }
                </div>
            </div>            
        </div>
    );
};

export default LearnerAssignAssessmentDertailsList;