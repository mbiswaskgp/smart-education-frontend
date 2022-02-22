import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {render} from 'react-dom'
import MathJax from 'react-mathjax-preview'
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import noImg from '../../../../assets/img/no-imgg.png';
import CommonService from "../../../../services/CommonService";
import CustomLoader from "../../../Common/CustomLoader";
import { withRouter } from 'react-router-dom';
import ReactPlayer from 'react-player'
import { toast } from 'react-toastify';
import { changeCurrentPage } from "../../../../store/actions/nav";
const TutorLearnerAssessmentDetails = (props) => {
    const dispatch                          = useDispatch();
    const [loader, setLoader]               = useState(false);
    const [questions, setQestions]          = useState([]);
    const [totalQuestions, setTotalQestions]= useState([]);
    const [data, setData]                   = useState([]);
    const [formData, setFormData]           = useState([]);
    useEffect(() => {
        if (props?.match?.params?.id) {
            getAssessmentDetails(props.match.params.id);
            getAssessmentQuestionDetails(props.match.params.id);
        }
        dispatch(changeCurrentPage('AssessmentPreview'));
    }, []);

    const getAssessmentDetails = (id) => {
        setLoader(true);
        CommonService.getById('learner-learnerAssessment', id)
            .then(response => {
                
                if (response.data.success) {
                    let assessmentData = {
                        title:        response.data.data.assessments.name,
                        instruction:  response.data.data.assessment.instruction,
                        totalMark:    response.data.data.assessments.total_marks,
                        passMark:     response.data.data.assessments.pass_marks,
                        subjectName:  response.data.data.assessments.subjectName,
                        levelName:    response.data.data.assessments.levelName,
                    }
                    console.log(assessmentData)
                    setData(assessmentData);
                    setLoader(false);

                } else {
                    setLoader(false);
                }
            })
            .catch(e => {
                console.log(e);
                setLoader(false);
            });
    }
    const getAssessmentQuestionDetails = (id) => {
        CommonService.getById('learerAssessmentQuestions', id)
            .then(response => {
                if (response.data.success) {
                    
                    console.log(response.data.data.assessments.data);
                    setQestions(response.data.data.assessments.data);
                    setTotalQestions(response.data.data.assessmentCount);
                    setLoader(false);
                } else {
                    setLoader(false);
                }
            })
            .catch(e => {
                console.log(e);
                setLoader(false);
            });
    }
    const handleInputChange = (event,event1) => {
        let { name, value } = event1.target;
        setFormData({ ...formData, [name]: value });
    }
    return (
        <div>
            <div className="container">
                {(loader) ?
                <CustomLoader /> : 
                <div>
                    <div className="learner_title">
                        <h2>{data.title?data.title:''}</h2>
                        <p>There are {totalQuestions} questions in this assessment
                        <b>PLEASE ANSWER ALL THE QUESTIONS</b></p>
                    </div>

                    <div className="learnerTitle">
                    {(data.instruction!=null)?data.instruction:'When you have answered all the questions take a look back over them before you press the SUBMIT button.If any questions have not been answered they will be highlighted to help you find them and answer them. When all questions have been answered please press the SUBMIT button to finish the assessment and see your score.'}
                    </div>
                
                    <div className="eachQuestionsWrap2">
                        { 
                            questions.map((question, index) => (

                        <div className="eachQuestions" key={index}>
                            <div className="row">
                                <div className="col-md-12 col-sm-12 eachQueFrontLeft">
                                    Question {parseInt(index)+1}
                                    <h2> {question.question_name}/ marks {question.marks}</h2>
                                    {/* <p>{question.question_description}</p> */}
                                    <MathJax math={String.raw`${question.question_description}`} />
                                </div>
                                <div className="col-md-12 col-sm-12">
                                    
                                    {(function() {
                                        if (question.mediaFile.file_type=='image') {
                                            return <img width="350" height="300"
                                            src={question?.mediaFile?.file_url} alt="" />;
                                        } else if(question.mediaFile.file_type=='audio') {
                                            return <audio className="uploadBtnsImg h-40" src={question?.mediaFile?.file_url} controls />;
                                        } else if(question.mediaFile.file_type=='video') {
                                            return <ReactPlayer controls width="500px" height="220px" url={question?.mediaFile?.file_url} />;
                                        }
                                    })()}                        
                                
                                    {/* <ul className="d-flex align-items-center eachQuestionFront">
                                        <li className="calcVal1">28</li>
                                        <li className="symbofCalc">+</li>
                                        <li className="calcVal1">7</li>
                                        <li className="symbofCalc">=</li>
                                        <li className="ansInputWrap"></li>
                                    </ul>
                                    <ul className="d-flex align-items-center eachQuestionFront mb-0">
                                        <li className="calcVal1">28</li>
                                        <li className="symbofCalc">+</li>
                                        <li className="calcVal1">7</li>
                                        <li className="symbofCalc">=</li>
                                        <li className="ansInputWrap"></li>
                                    </ul> */}
                                </div>
                                <div className="col-md-12 col-sm-12">
                                <input type="number" className="form-control textAra" placeholder="Marks" name={question.id} value={(formData.obtained_marks)?formData.obtained_marks:''} onChange={event=>handleInputChange(question.id,event)} />
                                    
                                </div>
                            </div>
                        </div>
                        ))
                    }
                        
                        {/* <div className="eachQuestions">
                            <div className="row">
                                <div className="col-md-8 col-sm-6 eachQueFrontLeft">
                                    <h2>Question 2</h2>
                                    <p>Instructions (if any) 
                                        for this question</p>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                    <ul className="d-flex align-items-center eachQuestionFront">
                                        <li className="calcVal1">28</li>
                                        <li className="symbofCalc">+</li>
                                        <li className="calcVal1">7</li>
                                        <li className="symbofCalc">=</li>
                                        <li className="ansInputWrap"></li>
                                    </ul>
                                    <ul className="d-flex align-items-center eachQuestionFront mb-0">
                                        <li className="calcVal1">28</li>
                                        <li className="symbofCalc">+</li>
                                        <li className="calcVal1">7</li>
                                        <li className="symbofCalc">=</li>
                                        <li className="ansInputWrap"></li>
                                    </ul>
                                </div>
                            </div>
                        </div> */}
                        <div className="submitAnsBtn text-center">
                            <button className="addTaskBtn">Submit</button>
                        </div>
                    </div>
                </div>    
                }    
            </div>
        </div>
    )
}

export default withRouter(TutorLearnerAssessmentDetails);