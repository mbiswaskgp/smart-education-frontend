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


function TutorLearnerDetails(props) {
    const itemNumber                        = user_varible.paagingnation_numberOfItems;
    const dispatch                          = useDispatch();
    const [learner, setLearner]             = useState({note: ''});
    const [learnerData, setLearnerData]     = useState([]);
    const [learnerAssessments, setLearnerAssessments] = useState([]);
    const [loader1, setLoader1]             = useState(false);
    const [loader2, setLoader2]             = useState(false);
    const [loader3, setLoader3]             = useState(false);

    const [loaderArr, setLoaderArr]         = useState([]);
    const [loaderArr1, setLoaderArr1]       = useState([]);
    const [loaderArr2, setLoaderArr2]       = useState([]);

    const [learnerId, setLearnerId]         = useState("");

    const [totalRecords, setTotalRecords]   = useState(0);
    const [activePage, setActivePage]       = useState(1);
    const [limit, setLimit]                 = useState(5);
    const [offset, setOffset]               = useState(0);
    const [sort, setSort]                   = useState({
                                                field: 'id',
                                                order: 'desc'
                                            });
    useEffect(() => {
        getLearner(props.match.params.id);
        getLearnerAssessment(props.match.params.id, limit, offset, sort);
        dispatch(changeCurrentPage('adminLearner'));
        setLearnerId(props.match.params.id);
        //console.log(props.match.params.id);       
    },[props.match.params.id]);

    const getLearner = (id) => {
        //e.preventDefault();
        setLoader1(true);
        CommonService.getById('tutorGetLearners',id)
        .then(response => {
            console.log(response.data);
            if(response.data.success){
                console.log(response.data.data);
                var learners = {
                    fname: response.data.data.learner.fname,
                    lname: response.data.data.learner.lname,
                    email: response.data.data.learner.email,
                    contact_number: response.data.data.learner.contact_number,
                    level_id: response.data.data.learner.current_level_id,
                    learning_center: response.data.data.learner.learning_center,
                    parent_name: response.data.data.learner.parent_name,
                    note: response.data.data.learner.note,
                }
                setLearnerData(learners);
                setLearner({note: response.data.data.learner.note});
                setLoader1(false);
            }else{
                toast.error(response.data.message,{autoClose: true});  
                setLoader1(false);
            }
        })
        .catch(e => {
            console.log(e);
            toast.error(e,{autoClose: false});  
            setLoader1(false);
        });
    }

    const getLearnerAssessment = (id, limit, offset, sort) => {
        setLoader3(true);
        var pageData = {
            limit: limit,
            offset: offset,
            sort: sort,
            id: id
        }
        CommonService.getAllWithPage('getLearnerAssessment', pageData)
          .then(response => {
            const learnerAssessment = response.data.data.learnerAssessment.data;
            setTotalRecords(response.data.data.totalLearnerAssessment);
            setLearnerAssessments(learnerAssessment);
            setLoader3(false);
            console.log(response.data.data.learnerAssessment.data);
          })
          .catch(e => {
            console.log(e);
            setLoader3(false);
          });
    }
    const handleInputChange = event => {
        const { name, value } = event.target;
        setLearner({ ...learner, [name]: value });
        //console.log(learner);
    };
    const onPageChanged = (page, limitParam) => {
        const limitData = limitParam ? limitParam : limit;
        const pageOffset = (page - 1) * limitData;
        setOffset(pageOffset);
        setLimit(limitData);
        setActivePage(page);
        if (!limitParam) getLearnerAssessment(props.match.params.id, limitData, pageOffset, sort);
    }
    const handleSubmitLearner = (e) => {
        //e.preventDefault();
        if(learner.note!=""){
            setLoader2(true);
            CommonService.updatePost('saveLearnerNote', props.match.params.id, learner)
            .then(response => {
                console.log(response.data);
                if (response.data.success) {
                    toast.success(response.data.message,{autoClose: false});
                    setLoader2(false);              
                } else {
                    setLoader2(false);
                    toast.error(response.data.message,{autoClose: false});   
                }
            })
            .catch(e => {
                console.log(e);
                setLoader2(false);
            });
        }else{
            alert("Enter the value in note");
            setLoader2(false);
        }
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
                    //console.log(response);
                    setLoaderArr1({ ...loaderArr2, id: '' });                     
                })
                .catch(e => {
                    toast.error(e,{autoClose: true});    
                    setLoaderArr1({ ...loaderArr2, id: '' });       
                });
            }
        });  
        
    }

    return (
        <div>
            {(loader1)?
                            <CustomLoader />:
            <div className="learner_title text-left">
                <div className="col-lg-8 ml-auto mr-auto ">
                    <div className="learner_details_saveed">
                        
                            <div>
                                <h4>
                                    Learner Details                        
                                </h4>
                                <div>
                                    <b>Name</b>: {learnerData.fname+ ' ' +learnerData.lname}                      
                                </div>
                                <div>
                                    <b>Contact Details</b> : {learnerData.contact_number}
                                </div>
                                <div >
                                    <b>Parent/Gurdian Name</b>: {learnerData.parent_name}
                                </div> 
                                <div>
                                    <b>Year/Level</b>: {learnerData.current_level_name}
                                </div>
                                
                                <div className="form-group mt-4">
                                    <p>Note</p>
                                    <textarea name="note" cols="30" rows="3" className="form-control textAra" placeholder="Notes" onChange={handleInputChange} value={learner.note}></textarea>

                                </div>
                                <div className="text-right">
                                    <button className="addLearner" onClick={handleSubmitLearner}>Update {(loader2)?<i className="fa fa-spinner fa-spin"></i>:''}</button>
                                </div>    
                            </div>   
                       
                    </div>            
                </div>

                <div className="row justify-content-center">
                
                    <div className="col-md-8 col-8 ml-auto mr-auto mt-3">
                    {(loader3)?
                                <CustomLoader />:
                            <div>
                                <div className="table-responsive-md">
                                    <table className="table table-borderd learner_table">
                                        <thead>
                                            <tr>
                                                <th colSpan="3">Assignment Taken</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {learnerAssessments.map((assessment, index) => (
                                            <tr key={assessment.id}>
                                                <td>{assessment.assessment_name}</td> 
                                                <td>{(assessment.total_obtained_marks)?assessment.total_obtained_marks:'-'}</td>
                                                <td>
                                                    {(assessment.status!="")? <Link to={"/tutor/learner-assessment-answers/"+assessment.id+'/'+learnerId} className="detailsSection">View<i className="fa fa-angle-right"></i></Link>:
                                                    <Link to={"/tutor/learner/edit-assign-assessment/"+assessment.id+'/'+learnerId} className="detailsSection">Edit<i className="fa fa-angle-right"></i></Link>
                                                    }

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
                                                </td>
                                            </tr>
                                        )) }
                                        </tbody>            
                                    </table>       
                                
                                </div>
                                <div className="column">
                                    <Pagination
                                    activePage={parseInt(activePage)}
                                    itemsCountPerPage={parseInt(limit)}
                                    totalItemsCount={totalRecords}
                                    pageRangeDisplayed={5}
                                    onChange={(e) => onPageChanged(e)}
                                    itemclassName="page-item "
                                    linkclassName="page-link"
                                    />
                                </div>
                            </div>
                        }
                    </div>            
                </div>
            </div>
        }
        </div>
    );
}

export default TutorLearnerDetails;