import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Form from 'react-bootstrap/Form';
// import Col from 'react-bootstrap/Col';
// import Button from 'react-bootstrap/Button';
// import noImg from '../../../../assets/img/no-imgg.png';
import CommonService from "../../../../services/CommonService";
import CustomLoader from "../../../Common/CustomLoader";
import { withRouter } from 'react-router-dom';
import ReactPlayer from 'react-player'
import { toast } from 'react-toastify';
import { changeCurrentPage } from "../../../../store/actions/nav";
import './LearnerAssessment.css';
// import Timer from 'react-compound-timer';
import swal from 'sweetalert';

const LearnerAssessmentDetails = (props) => {

    const dispatch = useDispatch();
    const [loader, setLoader]       = useState(false);
    const [loading, setLoading]     = useState(false);
    
    const [questions, setQestions]  = useState([]);
    const [totalQuestions, setTotalQestions] = useState([]);
    const [data, setData]           = useState([]);
    const [formData, setFormData]   = useState([]);
    useEffect(() => {
       
        getLearerAssessmentStartExam();        
        dispatch(changeCurrentPage('AssessmentPreview'));
    }, []);

    const handleChange = event => {
        let { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    const getLearerAssessmentStartExam = (id) => { 
        setLoader(true); 
        CommonService.getData('getLearerAssessmentStartExam')
            .then(response => {
                console.log(response.data);
                if (response.data.success) { 
                    console.log(response.data.data);                   
                    setLoader(false); 
                    let assessmentData = {
                        title: response.data.data.assessment.name,
                        totalMark: response.data.data.assessment.total_marks,
                        passMark: response.data.data.assessment.pass_marks,
                        subjectName: response.data.data.assessment.subjectName,
                        levelName: response.data.data.assessment.levelName,
                    }
                    console.log(assessmentData)
                    setData(assessmentData);

                    setQestions(response.data.data.assessmentQuestions.data);
                    setTotalQestions(response.data.data.assessmentCount);
                    
                } else {
                    setLoader(false);
                    toast.error(response.data.message,{autoClose: true});                    
                }
            })
            .catch(e => {
                console.log(e);
                setLoader(false);
            });
    }
    // const getAssessmentDetails = (id) => {
    //     setLoader(true);
    //     CommonService.getById('learner-learnerAssessment', id)
    //         .then(response => {
    //             console.log(response.data.data.assessments);
    //             if (response.data.success) {
    //                 let assessmentData = {
    //                     title: response.data.data.assessments.name,
    //                     totalMark: response.data.data.assessments.total_marks,
    //                     passMark: response.data.data.assessments.pass_marks,
    //                     subjectName: response.data.data.assessments.subjectName,
    //                     levelName: response.data.data.assessments.levelName,
    //                 }
    //                 console.log(assessmentData)
    //                 setData(assessmentData);
    //                 setLoader(false);

    //             } else {
    //                 setLoader(false);
    //             }
    //         })
    //         .catch(e => {
    //             console.log(e);
    //             setLoader(false);
    //         });
    // }
    
    // const getAssessmentQuestionDetails = (id) => {
    //     CommonService.getData('learerAssessmentQuestions')
    //         .then(response => {
    //             if (response.data.success) {

    //                 console.log(response.data.data.assessmentCount);
    //                 setQestions(response.data.data.assessments.data);
    //                 setTotalQestions(response.data.data.assessmentCount);
    //                 setLoader(false);
    //             } else {
    //                 setLoader(false);
    //             }
    //         })
    //         .catch(e => {
    //             console.log(e);
    //             setLoader(false);
    //         });
    // }

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log(formData);
        const dataSubmit = {
            answerData: formData
        };
        const answer_id = props?.match?.params?.id;
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
                CommonService.updatePost('saveLearerAssessmentAnswer', answer_id, dataSubmit)
                    .then(response => {
                        console.log(response.data);
                        if (response.data.success) {
                            toast.success(response.data.message,{autoClose: true});
                            setLoading(false);
                            props.history.push("/learner/message/succ");

                        } else {
                            props.history.push("/learner/message/notdone");
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
        <div className="container">
            {(loader) ?
                <CustomLoader /> :
                <div>
                    <div className="learner_title">
                        <h2>{data.title ? data.title : ''}</h2>
                        <p>There are {totalQuestions} questions in this assessment
                        <b>PLEASE ANSWER ALL THE QUESTIONS</b></p>
                        <p>Total Marks  {data.totalMark ? data.totalMark : ''}</p>
                    </div>

                    <div className="learnerTitle">
                        When you have answered all the questions take a look back over them before you press the SUBMIT button.
                        If any questions have not been answered they will be highlighted to help you find them and answer them.
                        When all questions have been answered please press the SUBMIT button to finish the assessment and see your
                        score.
                    </div>
                    <Form onSubmit={handleSubmit}>
                    <div className="eachQuestionsWrap2">
                        <div className="eachQuestionsWrap2">
                            { 
                            questions.map((question, index) => (
                                <div className="eachQuestions" key={index}>
                                    <div>
                                        <div className="row">
                                            <div className="col-md-12 col-sm-12 eachQueFrontLeft">
                                            <h2> Question {parseInt(index)+1}</h2>
                                                {/* <h2> {question.question_name} / marks {question.marks}</h2> */}
                                                <p>{(question.subQuestions && question.subQuestions.length)?'.i) ':''}{question.question_description}</p>
                                            </div>
                                            <div className="col-md-12 col-sm-12">
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

                                            <div className="col-md-12 col-sm-12">
                                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                                    
                                                    {(function() {
                                        if (question.is_audio_answer=='yes') { 
                                            return '<Form.Label>Answer Box</Form.Label><Form.File id="custom-file2" name="audio_name" onChange={handleChange} onClick={(e) => e.target.value = null}accept="audio/*" />';
                                        } else { 
                                            return '<Form.Label>Answer Box</Form.Label><Form.Control as="textarea" name={question.id} rows={3} onChange={handleChange} />';
                                        }
                                        })()}
                                                    
                                                </Form.Group>

                                            </div>
                                            
                                            
                                        </div>                        
                                    </div>
                                    { 
                                    question.subQuestions && question.subQuestions.map((subQuestion1, indexSubQuestions) => (  
                                        <div key={indexSubQuestions}>   
                                            <div  className="row">
                                                <div className="col-md-12 col-sm-12 eachQueFrontLeft">
                                                    {/* <h2> {subQuestion1.question_name}</h2> */}
                                                    <p>{(function() {
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
                                                {subQuestion1.question_description}</p>
                                                </div>
                                                <div className="col-md-12 col-sm-12">
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

                                                <div className="col-md-12 col-sm-12">
                                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                                        <Form.Label>Answer Box</Form.Label>
                                                        <Form.Control as="textarea" name={subQuestion1.id} rows={3} onChange={handleChange} />
                                                    </Form.Group>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>                              
                                ))}
                            </div>
                            <div className="submitAnsBtn text-center">
                                <button className="addTaskBtn" disabled={loading}>
                                {loading && (
                                    <span className="login_spinner"><i className="fa fa-spinner fa-spin"></i></span>
                                )}Submit</button>

                            </div>
                        </div>    
                    </Form>
                    
                </div>
            }
        </div>
    )
}

export default withRouter(LearnerAssessmentDetails);