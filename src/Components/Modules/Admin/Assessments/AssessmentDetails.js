import React, { useState, useEffect } from "react";
import { Link  } from "react-router-dom";
import MathJax from 'react-mathjax-preview';
import { useDispatch, useSelector } from "react-redux";
import { changeCurrentPage } from "../../../../store/actions/nav";
//import validate from "../../../Validator";
import { toast } from 'react-toastify';

import CustomLoader from "../../../Common/CustomLoader";
import CommonService from "../../../../services/CommonService";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import swal from 'sweetalert';
//import Button from 'react-bootstrap/Button';
import './Assessments.css';

const AssessmentDetails = (props) => {
  // const initFormData = {
  //   question_id:'',
  //   totalMark: 0,
  //   passMark: 0,
  // }
  
  const dispatch                                = useDispatch();
  const [loader, setLoader]                     = useState(false);
  const [data, setData]                         = useState([]);
  //const [markData, setMarkData]                 = useState([]);
  const [assessmentTitle, setAssessmentTitle]   = useState('');
  const [assessmentTitlePrev, setAssessmentTitlePrev]   = useState('');
  
  const [selected, setSelected]                 = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [addQuestions, setAddQuestions]         = useState([]);
  const [formData , setFormData]                = useState([]);
  const [errorData , setErrorData]              = useState([]);
  const [showModal, setShowModal]               = useState(false);
  const assessmentId = props?.match?.params?.id;
  const { isLoggedIn,userRoleData } = useSelector(state => state.auth);

  useEffect(() => {
    if(props?.match?.params?.id){
      getAssessmentDetails(props.match.params.id);
      getCurrentQuestions(props.match.params.id);
      getAddQuestions(props.match.params.id);
    }
    dispatch(changeCurrentPage('adminAssessmentDetails'));
  }, [props?.match?.params?.id]);

  const getAssessmentDetails = () => {
    setLoader(true);
    CommonService.getById('assessment', assessmentId)
            .then(response => {
              setLoader(false); 
              if (response.data.success) {
                //console.log(response.data.data.assessment);
                let assessmentData = {
                  title:       response.data.data.assessment.name,
                  subjectName: response.data.data.assessment.subjectName,
                  levelName:   response.data.data.assessment.levelName,
                }
                setData(assessmentData);
                setAssessmentTitle(assessmentData.title);
                setAssessmentTitlePrev(assessmentData.title);
                var getFormData = {
                  question_id:  1,
                  totalMark:      response.data.data.assessment.total_marks,
                  passMark:       response.data.data.assessment.pass_marks,
                  instruction:    response.data.data.assessment.instruction,
                  //total_duration: response.data.data.assessment.total_duration
                }
                console.log(getFormData);
                setFormData(getFormData);
                
                // setTotalMark(assessmentData.total_marks);
                // setPassMark(assessmentData.pass_marks);
              }
            })
            .catch(e => {
                console.log(e);
                setLoader(false);
            });
  }

  const getCurrentQuestions = (id) => {
    CommonService.getById('assessmentCurrentQuestions', id)
        .then(response => {
          setLoader(false); 
          if (response.data.success) {
            console.log(response.data.data);
            setCurrentQuestions(response.data.data.currentQuestions.data);
          }
        })
        .catch(e => {
            console.log(e);
            setLoader(false);
        });
  }
  
  const getAddQuestions = (id) => {
      CommonService.getById('allAssessmentQuestions', id)
        .then(response => {
          setLoader(false); 
          if (response.data.success) {
            console.log(response.data.data);
            setAddQuestions(response.data.data.addQuestions.data);
          }
        })
        .catch(e => {
            console.log(e);
            setLoader(false);
        });
  }
  const handleChange = event => {
    // console.log('event');
    // console.log(event);
    let { name, value } = event.target;
    //console.log(value);

    console.log(name);
    setFormData({ ...formData, [name]: value });
  }
  
  const handleInstructionChange = event => {

    let { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSaveAssessmentQuestion = () => {
    setLoader(true);
    setAddQuestions([]);
    var formsData = {
      'assessment_id': assessmentId,
      'question_id': formData.question_id,
    }

    if(formsData.question_id!="" && formsData.question_id){
      console.log(formsData);
      setErrorData("");
      CommonService.create('assessmentQuestion', formsData)
        .then(response => {
          toast.success(response.data.message);
          getCurrentQuestions(props.match.params.id);
          getAddQuestions(props.match.params.id);
          //console.log(response.data.data.totalMarks);
          setLoader(false);
          var marksDatas = {
            totalMark: response.data.data.totalMarks,  
          }
          setFormData(marksDatas);
          setSelected(true);
          //setPassMark(response.data.passMark);
          // props.history.push("/admin/question-answer");
        })
        .catch(e => {
          console.log(e);
          setLoader(false);
        });
    }else{      
      setErrorData("This field is required");
      setLoader(false);
    }    
  }
  
  const saveAssessmentMarks = () => {
      console.log(formData);
      CommonService.updatePost('updateAssessmentMark', props.match.params.id ,formData)
        .then(response => {
            console.log(response.data);
            if (response.data.success) {
              setLoader(false);
              toast.success(response.data.message);
            }
        })
        .catch(e => {
            console.log(e);
            setLoader(false);
        });
  }

  const saveAssessmentInstruction = () => {
    console.log(formData);
    CommonService.updatePost('updateAssessmentInstruction', props.match.params.id , formData)
      .then(response => {
          console.log(response.data);
          if (response.data.success) {
            setLoader(false);
            toast.success(response.data.message);
          }
      })
      .catch(e => {
          console.log(e);
          setLoader(false);
      });
}
  const deleteQuestion = (key, event) => {

    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        var deleteData = {
          assessment_id: assessmentId,
          question_answer_id: key
        }
        CommonService.deleteObj('assessmentQuestionDelete',deleteData)
        .then(response => {
            console.log(response.data.data);
            if(response.data.success){
              let marksDatas = {
                totalMark: response.data.data.totalMarks,            
              }
              setFormData(marksDatas);
              getCurrentQuestions(props.match.params.id);
              getAddQuestions(props.match.params.id);
              toast.success(response.data.message);
            }            
        })
        .catch(e => {
            toast.error(e,{autoClose: false});   
        });
      }
    });   
  }
  const openModalForTitle = () => {
    setShowModal(true);
  }
  const handleChangeAssessmentTitle = (event) => {
      setAssessmentTitle(event.target.value);
  }
  const saveAssessmentTitle = () => {
    //console.log(formData);
    if(assessmentTitle!=""){
      var formData  = {
        'assessmentTitle': assessmentTitle
      }
      CommonService.updatePost('updateAssessmentTitle', props.match.params.id ,formData)
        .then(response => {
            console.log(response.data.data.assessmentTitle);
            if (response.data.success) {
              setLoader(false);
              toast.success(response.data.message);
              setAssessmentTitle(response.data.data.assessmentTitle);
            }else{
              toast.error(response.data.message);
            }
        })
        .catch(e => {
            toast.error(e);
            setLoader(false);
        });
    }else{
      setAssessmentTitle(assessmentTitlePrev);
      toast.error('Please enter assessment name');
    }
    
  }
  return  (
      <div className="row">
            <div className="col-lg-7">
              <div className="assessmentTitle">
                <h2>{assessmentTitle} <button onClick={openModalForTitle}><i className="fa fa-edit"></i></button></h2>
                <div className="subjectAndLevel d-flex">
                  <div className="subject">
                    Subject: <span>{data.subjectName?data.subjectName:''}</span>
                  </div>
                  <div className="questionLevel">
                    Level: <span>{data.levelName?data.levelName:''}</span>
                  </div>
                </div>
              </div>
              {/* modal start */}
              <Modal
                show={showModal}
                onHide={() => {
                  setShowModal(false);
                }}
                aria-labelledby="example-modal-sizes-title-lg"
                animation={false}
                backdrop={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                          Assessment Title
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>

                         <div>
                         <input type="text" name="assessment_title" value={(assessmentTitle)?assessmentTitle:''} className="form-control" onChange={handleChangeAssessmentTitle} />
                        </div>
                        <div className="text-right">
                          <button type="button" className="redBtn" onClick={saveAssessmentTitle}>Update</button>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    
                </Modal.Footer>
            </Modal>
              {/* modal end */}
              <div className="questionSet">
                <div className="questionSetTitle d-flex justify-content-between">
                  <div className="leftAssmentDetail">CURRENT QUESTION SET</div>
                  <div className="rightAssmentDetail">Marks</div>
                </div>
                

                {(loader) ?
                  <CustomLoader /> : 
                <ul>
                  { currentQuestions.map((questiona, indexa) => {
                      return <li key={indexa}>
                        <span className="qtitle">{(questiona.question_name!="")?questiona.question_name: <MathJax className="ar_question_wrp" math={String.raw`${questiona.question_description}`} />}</span>
                        <span className="qMarsk">{questiona.marks}</span>
                        <span className="qMarsk">                          
                          <Link to={"/admin/question-answer/edit/" + questiona.id} className="iconDelBtn"><i className="fa fa-edit"></i></Link>
                          <button type="button" className="iconDelBtn" onClick={deleteQuestion.bind(this, questiona.id)}><i className="fa fa-trash-o" aria-hidden="true"></i></button>
                        </span>
                      </li>;
                    })
                  }
                  
                </ul>
                }
              </div>
              <div className="addQuestons">
                <div className="addQuestionTitle">Add Question</div>
                <div className="selectAndAddQ">
                
                  <Form.Group as={Col} controlId="formLevels">
                    <Form.Control as="select" name="question_id" required className="" onChange={handleChange} defaultValue={''}>
                      <option key="0" value="" defaultValue={selected}>Select Question For Assessment</option>
                      {
                        addQuestions.map((question, index) => {
                          return <option key={index} value={question.id}>{question.question_name} / {question.subject_name} / {question.level_name} </option>;
                        })
                      }
                    </Form.Control>
                    <span className="errorMsg">{errorData}</span>
                  </Form.Group>
                </div>
                
                <div className="text-right mt-2">
                  {(userRoleData===2)?<Link className="redBtn" to="/tutor/assessment-list">Back</Link>:<Link className="redBtn" to="/admin/assessment-list">Back</Link>}
                  
                &nbsp;
                  <button type="button" className="redBtn" onClick={handleSaveAssessmentQuestion}>Add</button>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="manage_parameter">
                <h4>Manage Parameters</h4>
                
                <ul>
                  <li key="index123">
                    <span className="pram">Set maximum marks</span>
                    <span className="pram-value">
                      <input type="text" name="totalMark" value={(formData.totalMark)?formData.totalMark:''} className="arInput1" onChange={handleChange} />
                    </span>
                  </li>
                  <li key="index1234">
                    <span className="pram">Set pass mark</span>
                    <span className="pram-value">
                      <input type="text" name="passMark" value={(formData.passMark)?formData.passMark:''} onChange={handleChange} className="arInput1" />
                    </span>
                  </li>
                  {/* <li key="index12345">
                    <span className="pram">Duration</span>
                    <span className="pram-value">
                      <input type="number" name="total_duration" value={(formData.total_duration)?formData.total_duration:''} onChange={handleChange} className="arInput1" />
                    </span>
                  </li> */}
                </ul>
                <div className="text-right">
                  <button type="button" className="redBtn" onClick={saveAssessmentMarks}>Update</button>
                </div>
                
              </div>

              <div className="manage_parameter">
                <h4>Instruction Header</h4>
                
                <ul>
                  <li key="index1234">
                    <span>
                      <textarea cols="50" rows="5" name="instruction" value={(formData.instruction)?formData.instruction:''} className="arInput1" onChange={handleInstructionChange} />
                    </span>
                  </li>
                  
                  {/* <li key="index12345">
                    <span className="pram">Duration</span>
                    <span className="pram-value">
                      <input type="number" name="total_duration" value={(formData.total_duration)?formData.total_duration:''} onChange={handleChange} className="arInput1" />
                    </span>
                  </li> */}
                </ul>
                <div className="text-right">
                  <button type="button" className="redBtn" onClick={saveAssessmentInstruction}>Update</button>
                </div>
                
              </div>
              

              <div className="monitorAndPreview">
                <ul className="d-flex">
                  <li>
                    {/* <a href="http://crescentek.net/projects/smart-education/assessments.html#" >
                      monitor <br>
                      results
                      <i className="fas fa-angle-right"></i>
                    </a> */}
                    <Link to={"/admin/assessment-result-list/" + assessmentId} className="monitor_results">
                        monitor results                      
                    </Link>
                    
                  </li>
                  <li>
                    {/* <a href="http://crescentek.net/projects/smart-education/assessments.html#" >
                      PREVIEW <br> ASSESSMENT
                      
                    </a> */}
                    <Link className="preview_assissment" to={"/admin/assessment-preview/" + assessmentId}>
                      PREVIEW  ASSESSMENT
                      
                    </Link>
                    
                  </li>
                </ul>
              </div>
            </div>
      </div>

     

    
  );
}

export default AssessmentDetails;