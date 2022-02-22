import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Pagination from 'react-js-pagination';
import user_varible from '../../../Utils/Utils';
import CommonService from "../../../../services/CommonService";
import Modal from 'react-bootstrap/Modal';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import CustomLoader from "../../../Common/CustomLoader";
import { changeCurrentPage } from "../../../../store/actions/nav";

import { toast } from 'react-toastify';
import swal from 'sweetalert';

function TutorAssessmentLists(props) {
    const itemNumber          = user_varible.paagingnation_numberOfItems;
    const dispatch                          = useDispatch();
    const [assessments, setAssessments]     = useState([]);
    const [loader, setLoader]               = useState(false);
    const [loaderArr, setLoaderArr]         = useState([]);
    const [searchTitle,setSearchTitle]      = useState("");
    const [learnerPassArr, setLearnerPassArr] = useState([]);
    const [totalRecords, setTotalRecords]   = useState(0);
    const [activePage, setActivePage]       = useState(1);
    const [limit, setLimit]                 = useState(10);
    const [offset, setOffset]               = useState(0);
    const [lgShow, setLgShow]               = useState(false);
    const [msg, setMsg]                     = useState('');
    const [sort, setSort]                   = useState({
                                                field: 'id',
                                                order: 'asc'
                                            });
    useEffect(() => {
        retrieveAllAssessments(limit, offset, sort, searchTitle);
        dispatch(changeCurrentPage('tutorLearnerAssessment'));
    }, [props?.match?.params?.id]);
    const retrieveAllAssessments = (limit, offset, sort, searchTitle) => {
        setLoader(true); 
        
        CommonService.getAllWithPage('tutor-assessments-list',{ limit, offset, sort, searchTitle })
        .then(response => {
            console.log(response.data.data);
            const assessmentlists = response.data.data.assessmentsData;
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

    const onChangeSearchTitle = e => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
        console.log(searchTitle);
    };

    const findByTitle = (e) =>{
        //console.log(searchTitle);
         
        CommonService.findByTitle('tutor-learner-assessments',{ limit, offset, sort, searchTitle })
            .then(response => {
                console.log(response.data.data);
                setAssessments(response.data.data.assessments.data);
                setTotalRecords(response.data.data.total);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const onPageChanged = (page) => {
        const pageOffset = (page - 1) * limit;
        setOffset(pageOffset);
        setActivePage(page);
        retrieveAllAssessments(limit, pageOffset, sort,searchTitle);
    }
    // const handleDownloadPassword = (id) => {
    //     //console.log(id);
        
    //     setLoaderArr({ ...loaderArr, id: id });
    //     CommonService.getBlobById('exportLearnerFromAssessment',id)
    //         .then((response) => {

    //             const url = window.URL.createObjectURL(new Blob([response.data]));
    //             const link = document.createElement('a');
    //             link.href = url;
    //             link.setAttribute('download', 'learners-password-file.xlsx'); //or any other extension
    //             document.body.appendChild(link);
    //             link.click();
    //             setLoaderArr({ ...loaderArr, id: '' });              
                
    //         })
    //         .catch(e => {
    //             toast.error(e,{autoClose: false});   
    //         });
    // }

    const handleShowPassword = (id) => {
        setLgShow(true);
        setMsg("");
        setLearnerPassArr([]);
        CommonService.getById('getTutorAssessmentLarnerPasword', id)
            .then(response => {
                if (response.data.success) {
                    // var learners = {
                    //     username:response.data.data.learners.username,
                    //     password:response.data.data.learners.password_code
                    // }
                    //console.log(response.data);
                    setLearnerPassArr(response.data.data.learners);
                    if(response.data.data.learners?.length==0){
                        setMsg("No record found"); 
                    }
                } else {
                    setLoader(false);
                }
            })
            .catch(e => {
                //console.log(e);
                setLoader(false);
            });
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
                            <th colSpan="2">Assessment List</th>                  
                            </tr>
                        </thead>
                        <tbody>
                            {assessments &&
                                assessments.map((assessment, index) => (
                                <tr key={assessment.id}>
                                    <td>{assessment.name}</td>
                                    <td>
                                    <Link to={"/tutor/assessment-list-of-learner/" + assessment.id } className="iconButton">Details <i className="fa fa-angle-right"></i></Link>
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
                                itemclassName="page-item "
                                linkclassName="page-link"
                            />
                            :''
                            }
                        </div>
                    </div>                        
                                            
                </div>  

            </div>
            <Modal
                size="lg"
                show={lgShow}
                onHide={() => {
                    setLgShow(false);
                }}
                aria-labelledby="example-modal-sizes-title-lg"
                animation={false}
                backdrop={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Password
                        
                        
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="crop-container">
                        <Form.Row>
                            {(learnerPassArr?.length==0)?<CustomLoader />:''}
                            <Form.Group controlId="formSubject" className="col-md-2"></Form.Group>
                            <Form.Group controlId="formSubject" className="col-md-10">
                                
                            {learnerPassArr &&
                                learnerPassArr.map((learner, index) => (
                                    <div key={index}>
                                        <p><b>Learner Name </b>: {learner?.fname+' '+learner?.lname}</p>
                                        <p>Username : {learner?.username}</p>
                                        <p>Password : {learner?.password_code}</p>
                                    </div>
                                ))}
                           
                            </Form.Group>
                        </Form.Row>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default TutorAssessmentLists;