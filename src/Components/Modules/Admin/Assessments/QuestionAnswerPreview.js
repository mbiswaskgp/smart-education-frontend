import React, { useState, useEffect } from 'react';

import ReactPlayer from 'react-player'
import { toast } from 'react-toastify';
//import Modal from 'react-bootstrap/Modal';

import Form from 'react-bootstrap/Form';
import MathJax from 'react-mathjax-preview';
import CustomLoader from "../../../Common/CustomLoader";
import CommonService from "../../../../services/CommonService";


const QuestionAnswerPreview = (props) => {
    
    const [loader, setLoader]      = useState(false);
    const [question, setQuestion]  = useState(false);
    const [audioPath, setAudioPath]  = useState(false);
    
    useEffect(() => {
        console.log(props?.match?.params?.id);
        getQuestionOfAssessment(props?.match?.params?.id); 
        
    }, []);

    const getQuestionOfAssessment = (questionId) =>{
        setLoader(true); 
        CommonService.getById('questionAnswer',questionId)
            .then(response => {
                console.log(response.data.data);
                if (response.data.success) {
                    setLoader(false); 
                    
                    console.log('success');
                    // setData(assessmentData);
                    
                    setQuestion(response.data.data.questionAnswer);


                    
                    // setTotalQestions(response.data.data.assessmentCount);
                    // setSlug(response.data.data.slug);
                    
                    // setAudioPath(response.data.data.arrFilePath);
                    // if(parseInt(response.data.data.sl_no)>0){
                    //     setPage(response.data.data.sl_no);
                    // }
                } else {
                    console.log('fail');
                    setLoader(false);
                    toast.error(response.data.message,{autoClose: true});
                }
            })
            .catch(e => {
                console.log(e);
                setLoader(false);
            });
    }
    
    const handleChange = (e) => {

    }
    const handleAudioChange = (e) => {

    }
    const onUploadFile = (e, id, step_no) => {

    }
    const onOpenModalRecord = (questionDetailId) =>{

    }
    return (
        <div>
            {(loader)?
            <CustomLoader />:
                   
            <div className="eachQuestionsWrap2">
                {question && (
         
                 <div className="col-md-12 col-sm-12 mb-4 text-left">
                     
 
                  
                 
                    <div className="row">
                         {(function() {

                            return <div className="col-md-3 col-sm-6 eachQueFrontLeft">
                                        <h2>
                                            {(question.question_name)?question.question_name:''}
                                        </h2>                                    
                                    </div>
                             
                         })()}
 
                        <div className="col-md-5 col-sm-6 questionImgWrap">
                            <MathJax className="ar_question_wrp" math={String.raw`${question.question_description}`} />
                            {(function() {
                                if (question.file_data?.file_type=='image') {
                                    return <img src={question?.file_data?.file_url} alt="" />;
                                } else if(question.file_data?.file_type=='audio' || question.file_data?.file_type=='audio_record') {
                                    return <audio className="uploadBtnsImg h-40" src={question?.file_data?.file_url} controls />;
                                } else if(question.file_data?.file_type=='video') {
                                    return <ReactPlayer controls width="500px" height="220px" url={question?.file_data?.file_url} />;
                                } else if(question.file_data?.file_type=='file') {
                                    return <p className="pdfDownload" onClick={()=> window.open(question?.file_data?.file_url, "_blank")}>Preview File</p>;
                                }
                            })()}
                        </div>
 
                        <div className="col-md-4 col-sm-6">
                            {(function() {
                                if (question.is_audio_answer=='yes') { 
                                return <div className="col-md-12 col-sm-12 mt-4">
                                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                                <Form.File id="custom-file2" name={question.id} onChange={handleAudioChange} onClick={(e) => e.target.value = null} accept="audio/*" />
                                            </Form.Group>
                                            
                                            <audio className="uploadBtnsImg h-40" src={audioPath && audioPath[question.id]?audioPath[question.id]:''} controls />

                                            <div className="uploadedBtnGroup">
                                                <button type="button" onClick={(e) => onUploadFile(e, question.id, question.sl_no)} className="uploadBtnsImg green_btn">  Upload </button>
                                                <button type="button" onClick={(e) => onOpenModalRecord( question.id)} className="uploadBtnsImg red_bg_btn"> <i className="fa fa-microphone"></i> </button>
                                            </div>
                                    </div>;
                                } else { 
                                    return <div className="col-md-12 col-sm-12 text-left">
                                                <Form.Group controlId="exampleForm.ControlTextarea1">                   <Form.Control className="ansInput ansBox2" as="textarea" placeholder="Enter Answer" name={question.id} rows={2} onChange={handleChange} defaultValue={(question.learner_answer)?question.learner_answer:''} />
                                                </Form.Group>  
                                            </div>;
                                }
                            })()}
                        </div>
                    </div> 
                </div>
                )}
            </div> 
            
            }
        </div>
    );
};

export default QuestionAnswerPreview;