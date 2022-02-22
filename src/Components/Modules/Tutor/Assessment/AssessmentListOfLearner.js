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

const  AssessmentListOfLearner = props => {
    const itemNumber                        = user_varible.paagingnation_numberOfItems;
    const dispatch                          = useDispatch();
    const [learnerAssessments, setLearnerAssessments] = useState([]);
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
        console.log(props.match);
        dispatch(changeCurrentPage('tutorLearnerAssessment'));
    }, [props?.match?.params?.assessmentId]);
    const retrieveAllAssessments = (limit, offset, sort, searchTitle) => {
        setLoader(true); 
        var assessmentId = props?.match?.params?.assessmentId;
        CommonService.getAllWithPage('assessment-list-of-learner/'+assessmentId,{ limit, offset, sort, searchTitle })
        .then(response => {
            console.log(response.data.data);
            const assessmentlists = response.data.data.learnerAssessmentData.data;
            console.log(assessmentlists);
            setLearnerAssessments(assessmentlists);
            setTotalRecords(response.data.data.total);
            setLoader(false);
        })
        .catch(e => {
            console.log(e);
            setLoader(false);
        });
    };

    // const onChangeSearchTitle = e => {
    //     const searchTitle = e.target.value;
    //     setSearchTitle(searchTitle);
    //     console.log(searchTitle);
    // };

    // const findByTitle = (e) =>{
    //     //console.log(searchTitle);
         
    //     CommonService.findByTitle('assessment-list-of-learner',{ limit, offset, sort, searchTitle })
    //         .then(response => {
    //             console.log(response.data.data);
    //             setLearnerAssessments(response.data.data.assessments.data);
    //             setTotalRecords(response.data.data.total);
    //         })
    //         .catch(e => {
    //             console.log(e);
    //         });
    // }

    const onPageChanged = (page) => {
        const pageOffset = (page - 1) * limit;
        setOffset(pageOffset);
        setActivePage(page);
        retrieveAllAssessments(limit, pageOffset, sort,searchTitle);
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
                            {learnerAssessments &&
                                learnerAssessments.map((assessment, index) => (
                                <tr key={assessment.id}>
                                    <td>{assessment.learner_fname+ ' ' + assessment.learner_lname}</td>
                                    <td>
                                    <Link to={"/tutor/learner-assessment-list/" + assessment.id } className="iconButton">Details <i className="fa fa-angle-right"></i></Link>
                                    </td>
                                </tr>
                            ))}                      
                            
                        </tbody>            
                        </table>
                    </div>
                    }
                    <div className="rows">
                        <div className="column">
                            
                        {(learnerAssessments && parseInt(totalRecords)>limit)?
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

export default AssessmentListOfLearner;