import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import MathJax from 'react-mathjax-preview';
import { useDispatch } from "react-redux";
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
import CKEditor4 from 'ckeditor4-react'

const AssessmentPreview = (props) => {
    
    const dispatch                          = useDispatch();
    const [loader, setLoader]               = useState(false);
    const [questions, setQestions]          = useState([]);
    const [totalQuestions, setTotalQestions]= useState([]);
    const [data, setData]                   = useState([]);
    useEffect(() => {
        if (props?.match?.params?.id) {
            getAssessmentDetails(props.match.params.id);
            getAssessmentQuestionDetails(props.match.params.id);
        }
        dispatch(changeCurrentPage('AssessmentPreview'));
    }, []);

    const getAssessmentDetails = (id) => {
        setLoader(true);
        CommonService.getById('assessment', id)
            .then(response => {
                
                if (response.data.success) {
                    let assessmentData = {
                        title:        response.data.data.assessment.name,
                        instruction: response.data.data.assessment.instruction,
                        totalMark:    response.data.data.assessment.total_marks,
                        passMark:     response.data.data.assessment.pass_marks,
                        subjectName:  response.data.data.assessment.subjectName,
                        levelName:    response.data.data.assessment.levelName,
                    }
                    //console.log(assessmentData)
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
        CommonService.getById('assessmentQuestions', id)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.data.assessments);
                    setQestions(response.data.data.assessments.data);
                    setTotalQestions(response.data.data.assessmentCount);
                    setLoader(false);
                    console.log(response.data.data.assessments.data);
                } else {
                    setLoader(false);
                }
            })
            .catch(e => {
                console.log(e);
                setLoader(false);
            });
    }
    return (
        <div className="container">
            {(loader) ?
            <CustomLoader /> : 
            <div>
                <div className="learner_title">
                    <h2>{data.title ? data.title : ''}</h2>
                    <p>There are {totalQuestions} questions in this assessment <b>PLEASE ANSWER ALL THE QUESTIONS</b></p>
                    <p>Total Marks {data.totalMark ? data.totalMark : ''}</p>
                </div>

                <div className="learnerTitle">
                {(data.instruction!=null)?data.instruction:'When you have answered all the questions take a look back over them before you press the SUBMIT button.If any questions have not been answered they will be highlighted to help you find them and answer them. When all questions have been answered please press the SUBMIT button to finish the assessment and see your score.'}
                </div>

                           
                <div className="eachQuestionsWrap2">
                    { 
                        questions.map((question, index) => (
                        <div className="eachQuestions" key={index}>
                            <div>
                                <div className="row">
                                    <div className="col-md-12 col-sm-12 mb-4 text-left">
                                        <div className="row">
                                        {(function() {
                                            if (question.mediaFile?.file_type!='') {
                                                return <div className="col-md-3 col-sm-6 eachQueFrontLeft">
                                                    <h2> Question {index+1} {(question.subQuestions?.length)?'.i)':''} </h2>
                                                    {/* <h2>
                                                      {(question.subQuestions?.length)?'i)':''} {(question.question_name)?question.question_name:''}
                                                    </h2> */}

                                                    {(question.question_description)?
                                                        <MathJax className="ar_question_wrp" math={String.raw`${question.question_description}`} />:''
                                                    }                            
                                                </div>
                                            } else {
                                                return <div className="col-md-8 col-sm-6 eachQueFrontLeft">
                                                   <h2> Question {index+1} {(question.subQuestions?.length)?'.i)':''}</h2> 
                                                    {/* <h2>
                                                    {(question.question_name)?question.question_name:''}
                                                    </h2> */}
                                                  
                                                    {(question.question_description)?
                                                        <MathJax className="ar_question_wrp" math={String.raw`${question.question_description}`} />:''
                                                    }
                                                </div>        
                                            }
                                        })()}

                                            <div className="col-md-5 col-sm-6 questionImgWrap">
                                               
                                                {(function() {
                                                    if (question.mediaFile?.file_type=='image') {
                                                        return <img src={question?.mediaFile?.file_url} alt="" />;
                                                    } else if(question.mediaFile?.file_type=='audio') {
                                                        return <audio className="uploadBtnsImg h-40" src={question?.mediaFile?.file_url} controls />;
                                                    } else if(question.mediaFile?.file_type=='video') {
                                                        return <ReactPlayer controls width="500px" height="220px" url={question?.mediaFile?.file_url} />;
                                                    } else if(question.mediaFile?.file_type=='file') {
                                                        return <p className="pdfDownload" onClick={()=> window.open(question?.mediaFile?.file_url, "_blank")}>Preview File</p>;
                                                    }
                                                })()}
                                            </div>

                                            
                                            <div className="col-md-4 col-sm-6">
                                                <div className="marksarss">marks {question.marks}</div>

                                                {(function() {
                                                    if (question?.is_audio_answer=='yes') { 
                                                    return <div className="col-md-12 col-sm-12 mt-4">
                                                        <Form.Group controlId="exampleForm.ControlTextarea1">
                                                            
                                                            <Form.File id="custom-file2" name={question.id}  accept="audio/*" />
                                                        </Form.Group>
                                                                
                                                        <audio className="uploadBtnsImg h-40" controls />
                                                        <div className="uploadedBtn">
                                                            <button type="button" className="uploadBtnsImg green_btn">  Upload </button>
                                                        </div>
                                                        <button type="button" className="uploadBtnsImg red_bg_btn">  Record </button>             
                                                    </div>;
                                                    } else { 
                                                        return <div className="col-md-12 col-sm-12 text-left">
                                                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                                                <Form.Control className="ansInput ansBox2" as="textarea" name={question.id} rows={3}  />
                                                            </Form.Group>
                                                        </div>;
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                       
                                    </div>
                                </div>                        
                            </div>
                            { 
                                question.subQuestions && question.subQuestions.map((subQuestion1, indexSubQuestions) => (  
                                <div key={indexSubQuestions}>   
                                    <div className="row">
                                    {(function() {
                                    if (subQuestion1.mediaFile?.file_type!='') {
                                        return <div className="col-md-3 col-sm-6 eachQueFrontLeft">
                                            <h2>
                                            {(function() {
                                                if (indexSubQuestions==0) { 
                                                    return 'ii) ';
                                                } else if (indexSubQuestions==1) { 
                                                    return 'iii) ';
                                                } else if (indexSubQuestions==2) { 
                                                    return 'iv) ';
                                                } else if (indexSubQuestions==3){ 
                                                    return 'v) ';
                                                } else if (indexSubQuestions==4) { 
                                                    return 'vi) ';
                                                }
                                            })()}

                                       {/* {(subQuestion1.question_name)?subQuestion1.question_name:''} */}
                                        </h2>                                    
                                        {/* <p>{(subQuestion1.question_description)?subQuestion1.question_description:''}</p> */}
                                        {(subQuestion1.question_description)?
                                            <MathJax className="ar_question_wrp" math={String.raw`${subQuestion1.question_description}`} />:''
                                        }
                                    </div>
                                } else {
                                    return <div className="col-md-8 col-sm-6 eachQueFrontLeft">
                                        <h2>
                                        {(function() {
                                            if (indexSubQuestions==0) { 
                                                return 'ii) ';
                                            } else if (indexSubQuestions==1) { 
                                                return 'iii) ';
                                            } else if (indexSubQuestions==2) { 
                                                return 'iv) ';
                                            } else if (indexSubQuestions==3) { 
                                                return 'v) ';
                                            } else if (indexSubQuestions==4) { 
                                                return 'vi) ';
                                            }
                                        })()}
                                        {/* {(subQuestion1.question_name)?subQuestion1.question_name:''} */}
                                        </h2>
                                
                                        {/* <p>{(subQuestion1.question_description)?subQuestion1.question_description:''}</p> */}
                                        {(subQuestion1.question_description)?
                                            <MathJax className="ar_question_wrp" math={String.raw`${subQuestion1.question_description}`} />:''
                                        }
                                    </div>        
                                }
                            })()}

                            <div className="col-md-5 col-sm-6 questionImgWrap">
                                {(function() {
                                    if (subQuestion1.mediaFile.file_type=='image') {
                                        return <img src={subQuestion1?.mediaFile?.file_url} alt="" />;
                                    } else if(subQuestion1.mediaFile.file_type=='audio') {
                                        return <audio className="uploadBtnsImg h-40" src={subQuestion1?.mediaFile?.file_url} controls />;
                                    } else if(subQuestion1.mediaFile.file_type=='video') {
                                        return <ReactPlayer controls width="500px" height="220px" url={subQuestion1?.mediaFile?.file_url} />;
                                    }
                                })()}
                            </div>

                            <div className="col-md-4 col-sm-6">
                                <div className="marksarss">marks {subQuestion1.marks}</div>
                                {(function() {
                                    if (subQuestion1.is_audio_answer=='yes') { 
                                    return <div className="col-md-12 col-sm-12">
                                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                                    
                                                    <Form.File id="custom-file2" name={subQuestion1.id}  accept="audio/*" />
                                                </Form.Group>
                                                <audio className="uploadBtnsImg h-40" controls />

                                                <div className="uploadedBtn">
                                                    <button type="button" className="uploadBtnsImg green_btn"> Upload </button>
                                                </div>
                                                <button type="button" className="uploadBtnsImg red_bg_btn"> Record </button>
                                        </div>;
                                    } else { 
                                        return <div className="col-md-12 col-sm-12">
                                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                                        <Form.Control className="ansInput ansBox2" as="textarea" name={subQuestion1.id} rows={3} />
                                                    </Form.Group> 
                                                </div>;
                                    }
                                    })()}

                            </div>
                                
                                    </div>
                                </div>
                            ))}
                        </div>                              
                    ))}
                </div>
            </div>    
            }    
        </div>
    )
}

export default withRouter(AssessmentPreview);