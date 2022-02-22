import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {render} from 'react-dom'
import MathJax from 'react-mathjax-preview'
import Form from 'react-bootstrap/Form';

import CommonService from "../../../../services/CommonService";
import CustomLoader from "../../../Common/CustomLoader";
import { withRouter } from 'react-router-dom';
import ReactPlayer from 'react-player'
import { toast } from 'react-toastify';
import { changeCurrentPage } from "../../../../store/actions/nav";
import swal from 'sweetalert';

const rx_live = /^[+-]?\d*(?:[.,]\d*)?$/;

const TutorLearnerAssessmentAnswers = (props) => {
    const dispatch                          = useDispatch();
    const [loader, setLoader]               = useState(false);
    const [loading, setLoading]             = useState(false);

    const [questions, setQestions]          = useState([]);
    const [questionsJson, setQuestionsJson] = useState([]);
    const [assessmentId, setAssessmentId]   = useState([]);
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
        CommonService.getById('tutor-learnerAssessment', id)
            .then(response => {
                //console.log(response.data.data)
                if (response.data.success) {
                    let assessmentData = {
                        title:        response.data.data.assessment.name,
                        totalMark:    response.data.data.assessment.total_marks,
                        passMark:     response.data.data.assessment.pass_marks,
                        subjectName:  response.data.data.assessment.subjectName,
                        levelName:    response.data.data.assessment.levelName,
                        learnerName:  response.data.data.userData.fname+' '+response.data.data.userData.lname,
                        totalObtainedMarks:    response.data.data.assessment.total_obtained_marks,
                        
                    }
                    setAssessmentId(response.data.data.assessment.id);
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
        CommonService.getById('tutor-learnerAssessmentAnswer', id)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.data);
                    setQestions(response.data.data.assessments.data);
                    setQuestionsJson(response.data.data.assessments.data.answer_description_json);
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

    const handleChange = (event,val) => {
        // console.log(val);
        // console.log(event.target.value);
        let { name, value } = event.target;

        if(parseFloat(value)>val){
            alert('Please enter max '+val);
            event.target.value = "";             
        }else{
            if (rx_live.test(event.target.value) && parseFloat(value)<=val)
            setFormData({ ...formData, [name]: value });
        }

        
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log(formData);
        const dataSubmit = {
            marksData: formData,
            learnerId: props?.match?.params?.id2
        };
        const marks_id = props?.match?.params?.id;
        swal({
            title: "Are you sure?",
            text: "Once submitted, you will not be able to revert back this!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            
            if (willDelete) {
                setLoading(true);
                CommonService.updatePost('tutor-saveLearerAssessmentMarks', marks_id, dataSubmit)
                    .then(response => {
                        //console.log(response.data);
                        if (response.data.success) {
                            if(response.data.data.user_type=='admin'){
                                toast.success(response.data.message,{autoClose: true});
                                setLoading(false);
                                props.history.push("/admin/learner/assessment-details-list/"+response.data.data.learner_user_id+'/'+response.data.data.assessment_id);
                            }else {
                                toast.success(response.data.message,{autoClose: true});
                                setLoading(false);
                                props.history.push("/tutor/learner-details-result/"+props?.match?.params?.id2);
                            }
                           
                        } else {
                            //props.history.push("/learner/message/notdone");
                            setLoading(false);
                            toast.error(response.data.message,{autoClose: true});   
                        }
                    })
                    .catch(e => {
                        console.log(e);
                        setLoading(false);
                    });
            }            
        });        
    }
    return (
        <div>
            <div className="container">
                {(loader) ?
                <CustomLoader /> : 
                <div>
                    <div className="learner_title">
                        <h2>{data.title?data.title:''}</h2>
                        <p>{data.learnerName?data.learnerName:''}</p>
                        <p>There are {totalQuestions} questions in this assessment</p>
                        <p>Total Marks: {data.totalMark}</p>
                        <p>Total Obtained Marks: {data.totalObtainedMarks}</p>
                        
                    </div>

                    <div className="eachQuestionsWrap2">
                        <Form onSubmit={handleSubmit}>
                        
                        { 
                        questions.map((question, index) => (
                        <div className="eachQuestions" key={index}>
                            <div>
                                <div className="row">
                                    <div className="col-md-12 col-sm-12 mb-4 text-left">
                                        
                                        <div className="row">
                                        <div className="col-md-4 col-sm-6 eachQueFrontLeft">
                                            Question {index+1}
                                            <h2>
                                            <div className="noOfQuestions">          
                                                {(question.subQuestions && question.subQuestions?.length)?'i)':''}
                                            
                                            </div>
                                                {(question.question_name)?question.question_name:''}                                
                                            </h2>
                                        
                                            {/* <p>{(question.question_description)?question.question_description:''}</p> */}
                                            {(question.question_description)?<MathJax math={String.raw`${question.question_description}`} />:''}
                                            
                                            </div>

                                            <div className="col-md-5 ansWrapInfo">
                                                {(function() {
                                                    if (question.mediaFile.file_type=='image') {
                                                        // return <img width="140" height="81"
                                                        // src={question?.mediaFile?.file_url} alt="" />;
                                                        return <img src={question?.mediaFile?.file_url} alt="" />;
                                                    } else if(question.mediaFile.file_type=='audio') {
                                                        return <audio className="uploadBtnsImg h-40" src={question?.mediaFile?.file_url} controls />;
                                                    } else if(question.mediaFile.file_type=='video') {
                                                        return <ReactPlayer controls width="500px" height="220px" url={question?.mediaFile?.file_url} />;
                                                    }
                                                })()}  
                                                 
                                            </div>
                                            <div  className="col-md-3">
                                                <div className="marksarss">marks {question.marks}</div>
                                                <ul>
                                                    <li> <b>System Answer :</b> {question?.answer_description}</li>
                                                    
                                                    {(function() {
                                                    if (question?.learnerAnswer.is_audio_answer=='yes' && question?.learnerAnswer.learner_answer_file_url!='') {    
                                                        return <li> <b>Learner Answer audio : </b> <audio className="uploadBtnsImg h-40" src={question?.learnerAnswer.learner_answer_file_url} controls />
                                                        </li>
                                                        } else if(question.learnerAnswer.learner_answer!='') {
                                                        return <li> <b>Learner Answer  : </b>{question?.learnerAnswer.learner_answer}
                                                        </li>
                                                        }else{
                                                        return <li><b> Learner Answer  : </b> -
                                                        </li>
                                                        }
                                                    })()} 
                                                    
                                                    {(function() {
                                                    if (question?.learnerAnswer.show_working_box=='yes') {    
                                                        return <li> <b>Working Box : </b> {question?.learnerAnswer.learner_working_box}
                                                        </li>
                                                        }
                                                    })()} 
                                                    
                                                    
                                                </ul>
                                                    {/* {question?.answer_description_json}
                                                    dd{JSON.stringify(question?.answer_description_json).match(question.learnerAnswer.learner_answer)} */}
                                                {(function() {
                                                    if (question.learnerAnswer.learner_answer!="" && question?.answer_description_json && JSON.stringify(question?.answer_description_json).match(question.learnerAnswer.learner_answer)) {
                                                        return <input type="text" className="form-control" placeholder="Marks" name={question.learnerAnswer.id} defaultValue={question?.marks} max={question?.marks} readOnly />;
                                                    } else {
                                                        return <input type="text" className="form-control" placeholder="Marks" name={question.learnerAnswer.id} defaultValue={(question.learnerAnswer.obtained_marks)?question.learnerAnswer.obtained_marks:''} onChange={e => handleChange(e,question?.marks)} max={question?.marks} min='0'  /> ;
                                                    } 
                                                })()}
                                            </div>
                                        </div>             
                                    </div>
                                </div>                        
                            </div>
                            { 
                            question.subQuestions && question.subQuestions.map((subQuestion1, indexSubQuestions) => (  
                                <div  key={indexSubQuestions}>   
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
                                            {(subQuestion1.question_name)?subQuestion1.question_name:''}
                                            </h2> 
                                            {/* <p>{(subQuestion1.question_description)?subQuestion1.question_description:''}</p> */}

                                            {(subQuestion1.question_description)?<MathJax math={String.raw`${subQuestion1.question_description}`} />:''}
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
                                            {(subQuestion1.question_name)?subQuestion1.question_name:''}
                                            </h2>
                                    
                                            {/* <p>{(subQuestion1.question_description)?subQuestion1.question_description:''}</p> */}
                                            <MathJax math={String.raw`${subQuestion1.question_description}`} />
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
                                    <div className="col-md-12 col-sm-12">
                                    <b>System Answer</b> : {subQuestion1?.answer_description}

                                        {(function() {
                                            if (subQuestion1?.learnerAnswer.is_audio_answer=='yes' && subQuestion1?.learnerAnswer.learner_answer_file_url!='') {    
                                            return <div className="col-md-12 col-sm-12">  <b>Learner Answer </b>: <audio className="uploadBtnsImg h-40" src={subQuestion1?.learnerAnswer.learner_answer_file_url} controls />
                                            </div>
                                            } else if(subQuestion1.learnerAnswer.learner_answer!='') {
                                            return <div className="col-md-12 col-sm-12"> <b> Learner Answer</b> : {subQuestion1?.learnerAnswer.learner_answer}
                                            </div>
                                            }else{
                                            return <div className="col-md-12 col-sm-12">  <b>Learner Answer </b>: -
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
                                        {(function() {
                                                // if (subQuestion1?.learnerAnswer?.learner_answer==subQuestion1?.answer_description && formData.obtained_marks==null) {

                                                if(subQuestion1.learnerAnswer.learner_answer!="" && subQuestion1?.answer_description_json && JSON.stringify(subQuestion1?.answer_description_json).match(subQuestion1.learnerAnswer.learner_answer)){
                                                    return <input type="number" className="form-control" placeholder="Marks" name={subQuestion1?.learnerAnswer?.id} defaultValue={subQuestion1?.marks} max={subQuestion1?.marks} readOnly />;
                                                } else {
                                                    return <input type="text" 
                                                    className="form-control" placeholder="Marks" name={subQuestion1?.learnerAnswer?.id} defaultValue={(subQuestion1?.learnerAnswer?.obtained_marks)?subQuestion1?.learnerAnswer?.obtained_marks:''} onChange={handleChange} max={subQuestion1?.marks} min='0' /> ;
                                                } 
                                            })()}
                                        </div>                    
                                    </div>
                                        

                                </div>
                            </div>









                                </div>
                            ))}
                        </div>                              
                    ))}
                            
                            
                            <div className="submitAnsBtn text-center">
                                <button className="addTaskBtn">Submit</button>
                            </div>

                        </Form>
                    </div>
                </div>    
                }    
            </div>
        </div>
    )
}

export default withRouter(TutorLearnerAssessmentAnswers);