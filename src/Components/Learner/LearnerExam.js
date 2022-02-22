import React, { useState, useEffect } from 'react';
// import { Link  } from "react-router-dom";
// import {render} from 'react-dom'
import MathJax from 'react-mathjax-preview'
// import { Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Form from 'react-bootstrap/Form';
import swal from 'sweetalert';

// import { withRouter } from 'react-router-dom';
import ReactPlayer from 'react-player';
import AudioRecorder from "./AudioRecorder";
import PlayAudioFile from "./PlayAudioFile";

import ReactAudioPlayer from 'react-audio-player';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar'

import Banner from "../Layouts/Banner";
import Footer from "../Layouts/Footer";
import LearnerHeaderExam from "../Layouts/Learner/LearnerHeaderExam";
// import LearnerHeader from "../Layouts/Learner/LearnerHeader";
import CommonService from "../../services/CommonService";
import CustomLoader from "../Common/CustomLoader";

import { logout } from "../../store/actions/auth";

//import logo from '../../assets/img/logo.png';

import { changeCurrentPage } from "../../store/actions/nav";

// import ChevronRight  from '../../assets/img/play.png';


// import LearnerDashboard from "./LearnerDashboard";
// import LearnerAssessments from "../Modules/Learner/Assessment/LearnerAssessments";
//import LearnerAssessmentDetails from "../Modules/Learner/Assessment/LearnerAssessmentDetails";
//import LearnerAssessmentMessage from "../Modules/Learner/Assessment/LearnerAssessmentMessage";

// import LearnerArchivedAssessments from "../Modules/Learner/Assessment/LearnerArchivedAssessments";

function LearnerExam(props) {
    const dispatch = useDispatch();
    const [loader, setLoader]               = useState(false);
    const [loading, setLoading]             = useState(false);
    const [deletebutton, setDeletebutton]   = useState({});
    const [page, setPage]                   = useState(1);
    const [learnerAssessmentId, setLearnerAssessmentId] = useState(false);
    const [questionDetailId, setQuestionDetailId] = useState(false);
    const [isOpenAudioRecord, setIsOpenAudioRecord] = useState(false);
    const [question, setQestion]             = useState([]);
    const [totalQuestions, setTotalQestions] = useState([]);
    const [data, setData]                    = useState([]);
    //const [testdata, setTestdata]          = useState('');
    const [formData, setFormData]            = useState([]);
    const [formWorkingData, setFormWorkingData] = useState([]);
    const [slug, setSlug]                    = useState('');
    const [audioData, setAudioData]          = useState({
        audio_name: {},
    });
    const [audioPath, setAudioPath]          = useState([]);

    const [audioDetails, setAudioDetails]    = useState({
        url: null,
        blob: null,
        chunks: null,
            duration: {
                h: null,
                m: null,
                s: null,
            }
        });

    // header
    const { isLoggedIn, user } = useSelector(state => state.auth);

    // const logOut = () => {
    //     dispatch(logout());
    // };
    
    useEffect(() => {
        //console.log(props);
        setLearnerAssessmentId(props?.match?.params?.id);
        getLearerAssessmentStartExam(page,props?.match?.params?.id);        
        dispatch(changeCurrentPage('AssessmentPreview'));
    }, [props?.match?.params?.id]);
    const getLearerAssessmentStartExam = (sl_no,id) => {
        console.log(id); 
        setLoader(true); 
        CommonService.getById('getLearerAssessmentStartExam/'+sl_no,id)
            .then(response => {
                console.log(response.data.data);
                if (response.data.success) {
                    setLoader(false); 
                    let assessmentData = {
                        title: response.data.data.assessment.name,
                        instruction: response.data.data.assessment.instruction,
                        totalMark: response.data.data.assessment.total_marks,
                        passMark: response.data.data.assessment.pass_marks,
                        subjectName: response.data.data.assessment.subjectName,
                        levelName: response.data.data.assessment.levelName,
                    }
                    //console.log('success');
                    setData(assessmentData);
                    
                    setQestion(response.data.data.assessmentQuestions);

                    setTotalQestions(response.data.data.assessmentCount);
                    setSlug(response.data.data.slug);
                    
                    setAudioPath(response.data.data.arrFilePath);
                    if(parseInt(response.data.data.sl_no)>0){
                        setPage(response.data.data.sl_no);
                    }
                } else {
                    //console.log('fail');.
                    setLoader(false);
                    toast.error(response.data.message,{autoClose: true});
                    props.history.push("/learner");
                }
            })
            .catch(e => {
                console.log(e);
                setLoader(false);
            });
    }

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     //console.log(formData);
    //     const dataSubmit = {
    //         answerData: formData,
    //         saveStatus:'final_save'
    //     };

    //     swal({
    //         title: "Are you sure?",
    //         text: "Once submitted, you will not be able to revert back this!",
    //         icon: "warning",
    //         buttons: true,
    //         dangerMode: true,
    //     })
    //     .then((willDelete) => {
            
    //         if (willDelete) {
    //             saveQuestionAnswer(dataSubmit);
    //         }

    //     });   
    // }
    
    
    const handleAudioChange = event => {
        let { name, value } = event.target;  
         
        let fileData = new FileReader();
        const files = event.target.files[0];
        fileData.onloadend = (e) => handleFile(e, name, files);
        fileData.readAsDataURL(event.target.files[0]);
        
        setFormData({ ...formData, [name]: value });        
    }

    const handleChange = event => {
        let { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    const handleWorkingChange = event => {
        let { name, value } = event.target;
        setFormWorkingData({ ...formWorkingData, [name]: value });
    }

    const handleFile = (e, key, filesData) => {
        const file = e.target.result;        
        setAudioData({ ...audioData, [key]: { 'content': file, 'files': filesData } });

    }  

    const onUploadFile = (e, id, step_no) => {
        let dataSend = {
            step: step_no,
            slug:slug,
            audioData: audioData
        }; 
        
        CommonService.updatePost('uploadImage', id, dataSend)
            .then(response => {
                console.log(response.data.success);
                if(response.data.success){
                    toast.success("File upload successfully");
                    setDeletebutton({'id':id});
                    setAudioPath(response.data.data.audioPath);
                }else{
                    toast.error("No file found");
                }               
            })
            .catch(e => {
                console.log(e);
            });
    }
    
    const deleteFileData = (key, type, dat) => {    
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                CommonService.remove('learnerAnswerDeleteFile', key, formData)
                .then(response => {
                    console.log(response);
                    toast.success(response.data.message);  
                    getLearerAssessmentStartExam(page);
                })
                .catch(e => {
                    console.log(e);
                    toast.error(e);                    
                });
            }            
        });
    }

    const saveQuestionAnswer = (dataSubmit) => {
        setLoading(true);
        console.log(dataSubmit);
        
        CommonService.updatePost('saveLearerAssessmentAnswer', slug, dataSubmit)
            .then(response => {
                //console.log(response.data);
                setAudioPath({});
                if (response.data.success) {
                    //console.log(response.data.data);
                    setQestion([]);
                    setLoading(false);

                    if(dataSubmit.saveStatus=='final_save'){
                        toast.success('Your paper successfully submited',{autoClose: true});
                        props.history.push("/learner/message/1");
                        //logOut();
                    }else if(dataSubmit.saveStatus=='take_a_break'){
                        setLoading(false);
                        toast.success('Your paper successfully saved',{autoClose: true});
                        
                    }else if(response.data.data.status=='quit'){
                        toast.error('Your paper successfully submited due to 10 incorrect answers',{autoClose: true});
                        props.history.push("/learner/message/2");
                    }else{
                        setLoading(false);
                        setQestion(response.data.data.assessmentQuestions);
                        setAudioPath(response.data.data.arrFilePath);
                        setPage(response.data.data.page);
                    }
                } else {
                    setLoading(false);
                    toast.error(response.data.message,{autoClose: true});   
                }
            })
            .catch(e => {
                console.log(e);
                setLoading(false);
            });               
    }
    const handleSaveAndNext = (key, type, dat) => {
        
        const dataSubmit3 = {
            answerData: formData,
            workingData: formWorkingData,
            saveStatus:'next_page',
            page:page
        };
        saveQuestionAnswer(dataSubmit3);
    }
    const handleSaveAndPrevious = (e) => {
        const dataSubmitP = {
            answerData: formData,
            workingData: formWorkingData,
            saveStatus:'previous_page',
            page:parseInt(page)
        };
        saveQuestionAnswer(dataSubmitP);
    }
    const saveTakeABreak = (e) => {
        e.preventDefault();
        const dataSubmit2 = {
            answerData: formData,
            workingData: formWorkingData,
            saveStatus:'take_a_break'
        };
        swal({
            title: "Are you sure?",
            text: "Save and finish it later!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            
            if (willDelete) {
                saveQuestionAnswer(dataSubmit2);
            }

        });
    };
    const handleSaveAndFinish = (e) => {
        const dataSubmit4 = {
            answerData: formData,
            workingData: formWorkingData,
            saveStatus:'final_save',
            page:page
        };
        swal({
            title: "Are you sure?",
            text: "If you are ready to send in your assessment to your tutor press O.K!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                saveQuestionAnswer(dataSubmit4);
            }    
        });     
    }
    const onOpenModalRecord = (questionDetailId) =>{
        //console.log(questionDetailId);
        setQuestionDetailId(questionDetailId);
        setIsOpenAudioRecord(true);
    }
  

    const handleClose = () =>{
        setQuestionDetailId('');
        setIsOpenAudioRecord(false);
        getLearerAssessmentStartExam(page,learnerAssessmentId);
    }

    const callbackFunction = (childData) => {
        //console.log(childData);
        setAudioPath(childData);  
        //getLearerAssessmentStartExam(page);          
    }
    return (
        <div>
            <LearnerHeaderExam/>
            <Banner/>
                <section className="question-management">
                    <div className="container">
                        
{(loader) ?
    <CustomLoader /> :
    <div>
        <div className="learner_title">
            
            
            <h2>{data.title ? data.title : ''}</h2>
            <p>There are {totalQuestions} questions in this assessment <b>PLEASE ANSWER ALL THE QUESTIONS</b></p>
            {/* <p>Total Marks - {data.totalMark ? data.totalMark : ''}</p> */}
        </div>

        <div className="learnerTitle">
            {(data.instruction!=null)?data.instruction:'When you have answered all the questions take a look back over them before you press the SUBMIT button.If any questions have not been answered they will be highlighted to help you find them and answer them. When all questions have been answered please press the SUBMIT button to finish the assessment and see your score.'}            
        </div>
        

        {question && (
        <div className="eachQuestionsWrap2">
            {(loading)?
            <CustomLoader />:
            <div key={question?.learnerAssessmentDetail?.id}>
                <div className="eachQuestions"> 
                    
                    <ProgressBar className="progressStyle" now={(question?.learnerAssessmentDetail?.sl_no*100)/totalQuestions} />
                    <div className="row">
                        <div className="col-md-12 col-sm-12 mb-4 text-middle">
                            {(data?.subjectName=='Reading')?<h3 className=""> Part {question?.learnerAssessmentDetail?.sl_no}</h3>:''}
                            
                        </div>
                        <div className="col-md-12 col-sm-12 mb-4 text-left">

                            <div className="sub_qsn">

                            </div>
                           
                            
                            <div className="row">
                            
                               
                                <div className="col-md-8 col-sm-8 questionImgWrap">
                                    {(question.question_description)?
                                        <div className="question_part" dangerouslySetInnerHTML={{__html: question.question_description}} />: <div className="question_part" dangerouslySetInnerHTML={{__html: question.question_name}} />
                                    }    
                                                         
                                    {(function() {
                                        if (question.mediaFile?.file_type=='image') {
                                            return <img src={question?.mediaFile?.file_url} alt="" />;
                                        } else if(question.mediaFile?.file_type=='audio' || question.mediaFile?.file_type=='audio_record') {
                                            return <PlayAudioFile
                                                audioUrl={question?.mediaFile?.file_url}
                                                questionDetailsId={question?.id}
                                                isPlayAudio={(question.learnerAssessmentDetail?.learner_answer)?false:true}                                                
                                                questionType={'question'}
                                            />
                                            // return <audio className="uploadBtnsImg h-40" src={question?.mediaFile?.file_url} controls autoPlay><img alt="Clock" src={require('../../assets/img/play.png')}/></audio>;
                                        //     return <ReactAudioPlayer
                                        //     src={question?.mediaFile?.file_url} 
                                        //     autoPlay
                                        //     controls
                                        //     YourSvg
                                        //   />
                                        } else if(question.mediaFile?.file_type=='video') {
                                            return <ReactPlayer controls width="500px" height="220px" url={question?.mediaFile?.file_url} />;
                                        } else if(question.mediaFile?.file_type=='file') {
                                            return <p className="pdfDownload" onClick={()=> window.open(question?.mediaFile?.file_url, "_blank")}>Preview File</p>;
                                        }
                                    })()}
                                </div>

                                <div className="col-md-4 col-sm-4">
                                    
                                    {(function() {
                                        if (question.learnerAssessmentDetail?.show_working_box=='yes') { 
                                            return <div className="col-md-12 col-sm-12 mt-4">
                                                <Form.Group controlId="exampleForm.ControlTextarea1">                                        
                                                    <Form.Control className="ansInput ansBox2" as="textarea" placeholder="Working Box" name={question.learnerAssessmentDetail?.id} rows={2} onChange={handleWorkingChange} defaultValue={(question.learnerAssessmentDetail?.learner_working_box)?question.learnerAssessmentDetail?.learner_working_box:''} 
                                                    />
                                                </Form.Group>  
                                            </div>
                                        }
                                    })()}
                                    
                                    {(function() {
                                        if (question.learnerAssessmentDetail?.is_audio_answer=='yes') { 
                                        return <div className="col-md-12 col-sm-12 mt-4">
                                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                                        
                                                        <Form.File id="custom-file2" name={question.learnerAssessmentDetail.id} onChange={handleAudioChange} onClick={(e) => e.target.value = null} accept="audio/*" />
                                                    </Form.Group>
                                                    
                                                    <audio className="uploadBtnsImg h-40" src={audioPath && audioPath[question.learnerAssessmentDetail.id]?audioPath[question.learnerAssessmentDetail.id]:''} controls />



                                                    <div className="uploadedBtnGroup">
                                                        <button type="button" onClick={(e) => onUploadFile(e, question.learnerAssessmentDetail?.id, question.learnerAssessmentDetail.sl_no)} className="uploadBtnsImg green_btn"> Upload </button>

                                                        {(deletebutton && deletebutton.id==question.learnerAssessmentDetail?.id || question.learnerAssessmentDetail?.learner_answer_file_name!='')?
                                                        <button type="button" className="uploadBtnsImg red_bg_btn ml-2 mr-2" onClick={deleteFileData.bind(this,question.learnerAssessmentDetail?.id,'audio')}> Delete </button>:''
                                                        }
                                                        <button type="button" onClick={(e) => onOpenModalRecord( question.learnerAssessmentDetail?.id)} className="uploadBtnsImg shadowColor"><i className="fa fa-microphone"></i>
                                                        </button>
                                                    </div>
                                            </div>;
                                        } else { 
                                            return <div className="col-md-12 col-sm-12 text-left">
                                                <Form.Group controlId="exampleForm.ControlTextarea1">                                        
                                                        <Form.Control className="ansInput ansBox2" as="textarea" placeholder="Enter Answer" name={question.learnerAssessmentDetail?.id} rows={2} onChange={handleChange} defaultValue={(question.learnerAssessmentDetail?.learner_answer)?question.learnerAssessmentDetail?.learner_answer:''} 
                                                         disabled = {(question.learnerAssessmentDetail?.learner_answer)?true:''} />
                                                </Form.Group>  
                                                    </div>;
                                        }
                                    })()}


                                </div>
                            </div> 
                        
                        </div>
                    
                    </div> 
                </div>
                    {/* row end */}

                {/* *** */}

                { 
                question.subQuestions && question.subQuestions.map((subQuestion1, indexSubQuestions) => ( 
                    
                    <div className="eachQuestions" key={indexSubQuestions}>   
                        <div className="row text-left">
                            {(function() {
                                // if (subQuestion1.mediaFile?.file_type!='') {
                                    // return <div className="col-md-2 col-sm-2 eachQueFrontLeft">
                                    //     <h2>
                                    //     {(function() {
                                    //         if (indexSubQuestions==0) { 
                                    //             return 'ii) ';
                                    //         } else if (indexSubQuestions==1) { 
                                    //             return 'iii) ';
                                    //         } else if (indexSubQuestions==2) { 
                                    //             return 'iv) ';
                                    //         } else if (indexSubQuestions==3) { 
                                    //             return 'v) ';
                                    //         } else if (indexSubQuestions==4) { 
                                    //             return 'vi) ';
                                    //         }
                                    //     })()}
                                    //     </h2>                                    
                                        
                                        
                                    // </div>
                                // } else {
                                //     return <div className="col-md-8 col-sm-6 eachQueFrontLeft">
                                //         <h2>
                                //         {(function() {
                                //             if (indexSubQuestions==0) { 
                                //                 return 'ii) ';
                                //             } else if (indexSubQuestions==1) { 
                                //                 return 'iii) ';
                                //             } else if (indexSubQuestions==2) { 
                                //                 return 'iv) ';
                                //             } else if (indexSubQuestions==3) { 
                                //                 return 'v) ';
                                //             } else if (indexSubQuestions==4) { 
                                //                 return 'vi) ';
                                //             }
                                //         })()}
                                //         {(subQuestion1.question_name)?subQuestion1.question_name:''}
                                //         </h2>
                                
                                //         {/* <p>{(subQuestion1.question_description)?subQuestion1.question_description:''}</p> */}

                                //         <MathJax math={String.raw`${subQuestion1.question_description}`} /> 
                                        
                                //     </div>        
                                // }
                            })()}
                            <div className="col-md-8 col-sm-8 questionImgWrap"> 

                                {(subQuestion1.question_description)?
                                    // <MathJax className="ar_question_wrp" math={String.raw`${subQuestion1.question_description}`} />:''
                                    <div className="question_part" dangerouslySetInnerHTML={{__html: subQuestion1.question_description}} />:<div className="question_part" dangerouslySetInnerHTML={{__html: subQuestion1.question_name}} />
                                } 
                                {(function() {
                                    if (subQuestion1.mediaFile.file_type=='image') {
                                        return <img src={subQuestion1?.mediaFile?.file_url} alt="" />;
                                    } else if(subQuestion1.mediaFile.file_type=='audio' || subQuestion1.mediaFile?.file_type=='audio_record') {
                                        // return <audio className="uploadBtnsImg h-40" src={subQuestion1?.mediaFile?.file_url} controls />;

                                        return <PlayAudioFile
                                                audioUrl={subQuestion1?.mediaFile?.file_url}
                                                questionDetailsId={subQuestion1?.id}
                                                isPlayAudio={false}
                                                questionType={'subquestion'}
                                            />
                                    } else if(subQuestion1.mediaFile.file_type=='video') {
                                        return <ReactPlayer controls width="500px" height="220px" url={subQuestion1?.mediaFile?.file_url} />;
                                    }
                                })()}
                            </div>

                            <div className="col-md-4 col-sm-4">
                                
                                {(function() {
                                        if (subQuestion1.learnerAssessmentDetail?.show_working_box=='yes') { 
                                            return <div className="col-md-12 col-sm-12 mt-4">
                                                <Form.Group controlId="exampleForm.ControlTextarea1">                                        
                                                    <Form.Control className="ansInput ansBox2" as="textarea" placeholder="Working Box" name={subQuestion1.learnerAssessmentDetail?.id} rows={2} onChange={handleWorkingChange} defaultValue={(subQuestion1.learnerAssessmentDetail?.learner_working_box)?subQuestion1.learnerAssessmentDetail?.learner_working_box:''} 
                                                    />
                                                </Form.Group>  
                                            </div>
                                        }
                                    })()}
                                    
                                {(function() {
                                    if (subQuestion1.learnerAssessmentDetail?.is_audio_answer=='yes') { 
                                    return <div className="col-md-12 col-sm-12">
                                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                                    
                                                    <Form.File id="custom-file2" name={subQuestion1.learnerAssessmentDetail.id} onChange={handleAudioChange} onClick={(e) => e.target.value = null} accept="audio/*" />
                                                </Form.Group>
                                                <audio className="uploadBtnsImg h-40" src={audioPath  && audioPath[subQuestion1.learnerAssessmentDetail.id]} controls />

                                                <div className="uploadedBtnGroup">
                                                    <button type="button" onClick={(e) => onUploadFile(e, subQuestion1.learnerAssessmentDetail?.id, subQuestion1.learnerAssessmentDetail.sl_no)} className="uploadBtnsImg green_btn">  Upload </button>

                                                    {(deletebutton && deletebutton.id==subQuestion1.learnerAssessmentDetail?.id || subQuestion1.learnerAssessmentDetail?.learner_answer_file_name!='')?
                                                    <button type="button" className="uploadBtnsImg red_bg_btn ml-2 mr-2" onClick={deleteFileData.bind(this,subQuestion1.learnerAssessmentDetail?.id,'audio')}> Delete </button>:''
                                                    }
                                                
                                                    <button type="button" onClick={(e) => onOpenModalRecord( subQuestion1.learnerAssessmentDetail?.id)} className="uploadBtnsImg shadowColor"><i className="fa fa-microphone"></i></button>
                                                </div>
                                                
                                        </div>;
                                    } else { 
                                        return <div className="col-md-12 col-sm-12">
                                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                                        <Form.Control className="ansInput ansBox2" as="textarea" placeholder="Enter Answer" name={subQuestion1.learnerAssessmentDetail?.id} rows={2} onChange={handleChange} defaultValue={(subQuestion1.learnerAssessmentDetail?.learner_answer)?subQuestion1.learnerAssessmentDetail?.learner_answer:''} 
                                                        disabled = {(subQuestion1.learnerAssessmentDetail?.learner_answer)?true:''}
                                                        />

                                                    </Form.Group> 
                                                </div>;
                                    }
                                    })()}

                            </div>  
                        </div>
                    </div>
                    
                ))}

                {/* *** */}

            </div>
            }
            <div>
                {(question?.learnerAssessmentDetail?.sl_no>1)?
                    <button className="addTaskBtn mr-3" onClick={handleSaveAndPrevious} disabled={loading}>
                    Previous</button>:''
                }
                {(question?.learnerAssessmentDetail?.char_sl_no=='last')?<button className="addTaskBtn" onClick={handleSaveAndFinish} disabled={loading}>Save And Finish</button>:<button className="addTaskBtn" onClick={handleSaveAndNext.bind(this,question.learnerAssessmentDetail?.id,page)} disabled={loading}>
                    Next</button> 
                }   
            </div>
        </div>
        )}


{/*  */}

    <Modal
        size="lg"
        show={isOpenAudioRecord}
        onHide={handleClose}
        aria-labelledby="example-modal-sizes-title-lg"
        animation={false}
        backdrop={false}
    >
        <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <AudioRecorder
                questionDetailId={questionDetailId}
                parentCallback = {callbackFunction}
            />
        </Modal.Body>
    </Modal>
{/*  */}

    </div>
}
                       
                    </div>
                </section>
            <Footer/>            
        </div>
    );
}

export default LearnerExam;