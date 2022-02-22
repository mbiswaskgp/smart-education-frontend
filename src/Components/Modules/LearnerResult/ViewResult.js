import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {render} from 'react-dom';
import MathJax from 'react-mathjax-preview';

import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import CommonService from "../../../services/CommonService";
// import CustomLoader from "../../../Common/CustomLoader";
import CustomLoader from "../../Common/CustomLoader";
import { withRouter } from 'react-router-dom';
import ReactPlayer from 'react-player'

import { changeCurrentPage } from "../../../store/actions/nav";

const ViewResult = (props) => {
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
        CommonService.getById('tutor-learnerAssessment', id)
            .then(response => {
                console.log(response.data.data.assessment)
                if (response.data.success) {
                    let assessmentData = {
                        title:              response.data.data.assessment.name,
                        totalMark:          response.data.data.assessment.total_marks,
                        totalObtainedMarks: response.data.data.assessment.total_obtained_marks,
                        passMark:           response.data.data.assessment.pass_marks,
                        subjectName:        response.data.data.assessment.subjectName,
                        levelName:          response.data.data.assessment.levelName,
                        readingAge:         response.data.data.assessment?.readingAge?.reading_age,
                        subject_id:         response.data.data.assessment?.subject_id,
                        learner_name:       response.data.data.assessment.learner_name
                    }                    
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
        CommonService.getById('tutor-learnerAssessmentAnswer', id)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.data);
                    setQestions(response.data.data.assessments.data);
                    setTotalQestions(response.data.data.assessmentCount.data);
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
    return (
        <div>
            <div className="container">
                {(loader) ?
                <CustomLoader /> : 
                <div>
                    <div className="learner_title">
                        <h3>Result</h3>
                        <h2>{data.title?data.title:''}</h2>
                        <p>There are {totalQuestions} questions in this assessment</p>
                        <p><b>Learner Name : {data.learner_name}</b></p>
                        <p><b>Subject : {data.subjectName}</b> <b>Level : {data.levelName}</b></p>
                        <p><b>Total Marks : {data.totalMark}</b></p>
                        <p><b>Obtained Marks : {data.totalObtainedMarks}</b></p>
                        <p><b>{(data.subject_id==3 && data.readingAge)?'Reading Age : '+data.readingAge+'':''}</b></p>
                    </div>

                    <div className="eachQuestionsWrap2">

                    { 
                        questions.map((question, index) => (

                        <div className="eachQuestions" key={index}>

                            <div>
                                <div className="row">
                                    <div className="col-md-12 col-sm-12 mb-4 text-left">
                                        
                                        <div className="row">
                                                
                                                    <div className="col-md-3 col-sm-6 eachQueFrontLeft">
                                                        Question {index+1}
                                                        <h2>
                                                        {(question.subQuestions?.length)?'i)':''} {(question.question_name)?question.question_name:''}
                                                        </h2>
                                                        {/* <p>{(question.question_description)?question.question_description:''}</p> */}
                                                        {(question.question_description)?
                                                        <MathJax math={String.raw`${question.question_description}`} />
                                                        :''
                                                        }
                                                        
                                                    </div>
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

                                                 <div className="col-md-12 col-sm-12 text-left">
                                                    <div className="col-md-12 col-sm-12">
                                                    <b> System Answer :  </b> {question?.answer_description}
                                                    </div>
                                                 {(function() {
                                                if (question?.learnerAnswer.is_audio_answer=='yes' && question?.learnerAnswer.learner_answer_file_url!='') {    
                                                    return <div className="col-md-12 col-sm-12"> <b>Learner Answer audio : </b>  <audio className="uploadBtnsImg h-40" src={question?.learnerAnswer.learner_answer_file_url} controls />
                                                    </div>
                                                } else if(question.learnerAnswer.learner_answer!='') {
                                                    return <div className="col-md-12 col-sm-12"><b> Learner Answer  : </b>  {question?.learnerAnswer.learner_answer}
                                                    </div>
                                                    }else{
                                                    return <div className="col-md-12 col-sm-12"><b> Learner Answer  : - </b> 
                                                    </div>
                                                    }
                                                })()}
                                                {(function() {
                                                    if (question?.learnerAnswer.show_working_box=='yes') {    
                                                    return <div className="col-md-12 col-sm-12"> <b>Working Box : </b> {question?.learnerAnswer.learner_working_box}
                                                    </div>
                                                    }
                                                })()}

                                                    <div className="col-md-12 col-sm-12">
                                                    <b>Marks / Obtained Marks  :</b> {question?.learnerAnswer.marks} / {question?.learnerAnswer.obtained_marks}          
                                                    </div>

                                                </div>
                                                
                                                    
                                            </div>
                                        </div>
                                       
                                    </div>
                                </div>                        
                            </div>

                            { 
                            question.subQuestions && question.subQuestions.map((subQuestion1, indexSubQuestions) => (  
                                <div  key={indexSubQuestions}>   
                                <div className="row">
                                    
                                <div className="col-md-3 col-sm-6 eachQueFrontLeft">
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
                                {(subQuestion1.question_name)?subQuestion1.question_name:''}
                                    </h2>
                                    {/* <p>{(subQuestion1.question_description)?subQuestion1.question_description:''}</p> */}
                                    {/* <MathJax math={String.raw`${subQuestion1.question_description}`} /> */}

                                    {(subQuestion1.question_description)?
                                        <MathJax math={String.raw`${subQuestion1.question_description}`} />:''
                                    }
                            </div>            
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
                                <div className="col-md-12 col-sm-12">
                                <b>System Answer : </b>  {subQuestion1?.answer_description}

                                    {(function() {
                                        if (subQuestion1?.learnerAnswer.is_audio_answer=='yes' && subQuestion1?.learnerAnswer.learner_answer_file_url!='') {    
                                        return <div className="col-md-12 col-sm-12"><b> Learner Answer :  </b> <audio className="uploadBtnsImg h-40" src={subQuestion1?.learnerAnswer.learner_answer_file_url} controls />
                                        </div>
                                        } else if(subQuestion1.learnerAnswer.learner_answer!='') {
                                        return <div className="col-md-12 col-sm-12"><b> Learner Answer :  </b> {subQuestion1?.learnerAnswer.learner_answer}
                                        </div>
                                        }else{
                                        return <div className="col-md-12 col-sm-12"><b> Learner Answer : - </b> 
                                        </div>
                                        }
                                    })()} 

                                    {(function() {
                                        if (subQuestion1?.learnerAnswer.show_working_box=='yes') {    
                                        return <div className="col-md-12 col-sm-12"> <b>Working Box : </b> {subQuestion1?.learnerAnswer.learner_working_box}
                                        </div>
                                        }
                                    })()}

                                    <div className="col-md-12 col-sm-12">
                                    <b>Marks / Obtained Marks  :</b> {subQuestion1?.marks} / {subQuestion1?.learnerAnswer?.obtained_marks}
                                    </div>                    
                                </div>
                                    

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
        </div>
    )
}

export default withRouter(ViewResult);