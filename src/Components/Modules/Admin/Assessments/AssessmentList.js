import React, { useState, useEffect } from "react";
import { Link  } from "react-router-dom";

import { useDispatch } from "react-redux";
import { changeCurrentPage } from "../../../../store/actions/nav";
import validate from "../../../../Validator";
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import Pagination from 'react-js-pagination';

import CustomLoader from "../../../Common/CustomLoader";
import CommonService from "../../../../services/CommonService";

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './Assessments.css';

const AssessmentList = (props) => {

  const assessmentData = {
    assessment_title: "",
    subject_id:       "",
    level_id:         ""     
  }
  const errors = {
    assessment_title: "",
    subject_id:       "",
    level_id:         ""     
  }

  const dispatch                            = useDispatch();
  const [loader, setLoader]                 = useState(false);
  const [data, setData]                     = useState([]);
  const [allSubjects, setAllSubjects]       = useState([]);
  const [allLevels, setAllLevels]           = useState([]);
  const [formData, setFormData]             = useState(assessmentData);
  const [errorData, setErrorData]           = useState(errors);

  const [totalRecords, setTotalRecords]     = useState(0);
  const [activePage, setActivePage]         = useState(1);

  const [limit, setLimit]                   = useState(10);
  const [offset, setOffset]                 = useState(0);
  const [sort, setSort]                     = useState({
                                                field: 'id',
                                                order: 'desc'
                                              });

  useEffect(() => {
    retrieveAllAssessments(limit, offset, sort);
    getAllSubject();
    getAlllevel();
    
    dispatch(changeCurrentPage('adminAssessment'));
  }, []);

  const getAllSubject = () => {
    CommonService.getAll('subjects')
      .then(response => {
        setAllSubjects(response.data.data.subjects);
      })
      .catch(e => {
        console.log(e);
      });
  }
  const handleChange = event => {
    let { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }
  const getAlllevel = () => {
    CommonService.getAll('levels')
      .then(response => {
        setAllLevels(response.data.data.levels);
        console.log(response.data.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  const onPageChanged = (page, limitParam) => {
    const limitData = limitParam ? limitParam : limit;
    const pageOffset = (page - 1) * limitData;
    setOffset(pageOffset);
    setLimit(limitData);
    setActivePage(page);
    if (!limitParam) retrieveAllAssessments(limitData, pageOffset, sort);
  }

  const retrieveAllAssessments = (limit, offset, sort) => {
    setLoader(true);
    setData([]);
    var pageData = {
      limit: limit,
      offset: offset,
      sort: sort,
      formData: formData
    }
    console.log(pageData);
    CommonService.create('assessment/search', pageData)
      .then(response => {
        const assessmentsList = response.data.data.assessments.data;
        setTotalRecords(response.data.data.total);
        setData(assessmentsList);
        setLoader(false);
      })
      .catch(e => {
        console.log(e);
        setLoader(false);
      });
  }

  const handleSaveAssessment = (e) => {
    const { isValid, errors } = validate.createAssessmentValidate(formData);
    console.log(errors);
    if(isValid){
      setErrorData([]);
      CommonService.create('assessment', formData)
        .then(response => {
          console.log(response);
          if(response.data.success){
            toast.success(response.data.message);
            props.history.push("/admin/assessment-details/"+response.data.data.assessment_id);
          }            
        })
        .catch(e => {
            console.log(e);
        });
    }else{
      setErrorData(errors);
    }
  }
  const handleSubmitForm = (e) =>{
    e.preventDefault();
    retrieveAllAssessments(limit, 0,  { field: 'id', order: 'desc' });
  }
  const deleteAssessment = (id) => {
    swal({
      title: "Delete This Assessment?",
      text: "Once deleted, you will not be able to recover this!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        CommonService.deleteData('assessment', id)
        .then(response => {
          console.log(response);
          if(response.data.success){
            toast.success(response.data.message);
            setOffset(0);
            retrieveAllAssessments(limit, offset, sort);
          }else{
            toast.error(response.data.message);
          }            
        })
        .catch(e => {
            console.log(e);
        });
      }
    });
  }

  return (
    <div>
      <div className="col-lg-12">
        <div className="text-right mb-3">
        <Link to="/admin/question-answer" className="detailsSection" >Question Answer</Link>
        </div>
        <div className="greenHeading text-left">
          QUICK SEARCH FOR AVAILABLE ASSESSMENTS	
        </div>
        <Form className="d-block" onSubmit={handleSubmitForm}>
          <div className="row align-items-center search_exising_questing">
            <div className="col-md-5 search_By_Subject">
              <Form.Group controlId="formSubject" className="mb-0">
                <Form.Control as="select" className="" name="subject_id" defaultValue="Subject" onChange={handleChange}> 
                  <option value="">Subject</option>
                  {
                    allSubjects.map((subject, index) => {
                      return <option key={index} value={subject.id}>{subject.name}</option>;
                    })
                  }

                </Form.Control>
              </Form.Group>
            </div>

            <div className="col-md-5 ">
              <Form.Group controlId="formLevels" className="mb-0">
                <Form.Control as="select" className="" name="level_id" defaultValue="Level" onChange={handleChange}>
                  <option value="">Level</option>
                  {
                    allLevels.map((level, index) => {
                      return <option key={index} value={level.id}>{level.name}</option>;
                    })
                  }
                </Form.Control>
              </Form.Group>
            </div>
            <div className="col-md-2">
            <button type="submit" className="redBtn2">FIND</button>
            </div>
            

          </div>
        </Form>
        <div className="existingQuestions mt-3 mb-3"></div>          
        <div className="existingheading">EXISTING ASSESSMENTS</div>
        <div className="table-responsive-md">  
          {(loader) ?
            <CustomLoader /> : 
            <div>
              <table className="table table-borderd learner_table">
                <thead>
                  <tr>
                    <th>Available Assessments </th>
                    <th>Level</th>
                    <th>Subject</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                    { data.map((assessment, index) => (
                        <tr key={index}>
                          <td>{assessment.name}</td>
                          <td>{assessment.levelName}</td>
                          <td>{assessment.subjectName}</td>
                          
                          <td>
                            <Link to={"/admin/assessment-details/" + assessment.id} className="detailsSection mr-3">Details <i className="fa fa-angle-right"></i></Link>
                            <button className="detailsSection" onClick={deleteAssessment.bind(this,assessment.id)}>Delete </button>
                          </td>
                        </tr>
                      ))
                    }
                </tbody>            
              </table>
              <div className="rows">
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
            </div>  
          }           
          
          <table className="table table-borderd learner_table tableAssessments mt-5">
            <thead>
              <tr>
                <th>Create New Assessments</th>
                <th>Level</th>
                <th>Subject</th>
                <th></th>
              </tr>
            </thead>            
            <tbody>
              <tr>
                <td>
                  <div className="form-group mb-0">
                    <input className="form-control" type="textbox" placeholder="Assessment Title" name="assessment_title" onChange={handleChange}/>
                    <span className="errorMsg">{errorData && errorData.assessment_title}</span>
                  </div>
                  
                </td>
                <td>
                  <Form.Group controlId="formLevels" className="mb-0">
                    <Form.Control as="select" value={formData.level_id} name="level_id" required className="" onChange={handleChange}>
                      <option>Level</option>
                      {
                        allLevels.map((level, index) => {
                          return <option key={index} value={level.id}>{level.name}</option>;
                        })
                      }
                    </Form.Control>
                    <span className="errorMsg">{errorData && errorData.level_id}</span>
                  </Form.Group>
                  
                </td>
                <td>
                    <Form.Group controlId="formSubject" className="mb-0">
                      <Form.Control as="select" value={formData.subject_id} name="subject_id" required className="" onChange={handleChange}>
                        <option>Subject</option>
                        {
                          allSubjects.map((subject, index) => {
                            return <option key={index} value={subject.id}>{subject.name}</option>;
                          })
                        }
                      </Form.Control>
                      <span className="errorMsg">{errorData && errorData.subject_id}</span>
                    </Form.Group>
                  
                </td>
                <td>
                <Button variant="primary" className="addLearner" type="button" onClick={handleSaveAssessment}>
                  Add
                </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AssessmentList;