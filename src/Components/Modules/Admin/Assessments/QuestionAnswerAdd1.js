import { Link  } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import noImg from '../../../../assets/img/no-imgg.png';
import noAudio from '../../../../assets/img/no-audio.jpg';
import noVideo from '../../../../assets/img/no-video.jpg';
import CommonService from "../../../../services/CommonService";
import CustomLoader from "../../../Common/CustomLoader";
//import validate from "../../../Validator";
import { changeCurrentPage } from "../../../../store/actions/nav";
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import ModalVideo from 'react-modal-video';
import Modal from 'react-bootstrap/Modal';
import ImageCropper from '../../../Utils/ImageCropper';
import './Assessments.css';
const AssessmentAdd = (props) => {

    const assessmentData = {
        question_name: "",
        question_description: "",
        subject_id: "",
        level_id: "",
        answer_description: "",
        marks: "",
        isAdditional: false,
        image_name: "",
        audio_name: "",
        video_name: ""
    }
    const dispatch                                      = useDispatch();
    const [allSubjects, setAllSubjects]                 = useState([]);
    const [allLevels, setAllLevels]                     = useState([]);
    const [allQuestionDropdown, setAllQuestionDropdown] = useState([]);

    const [loader,setLoader]                        = useState(false);
    const [showHideImage, setShowHideImage]         = useState(false);
    const [showHideAudio, setShowHideAudio]         = useState(false);
    const [showHideVideo, setShowHideVideo]         = useState(false);
    const [loaderSubQuestion, setLoaderSubQuestion] = useState(false);
    const [checkedValue,setCheckedValue]            = useState(false);
    
    const [imageLoader, setImageLoader] = useState(false);
    const [audioLoader, setAudioLoader] = useState(false);
    const [videoLoader, setVideoLoader] = useState(false);
    const [submitted, setSubmitted]     = useState(true);
    const [formData, setFormData]       = useState(assessmentData);
    const [isOpen, setOpen]             = useState(false);
    const [isOpenImg, setOpenImg]       = useState(false);
    const [lgShow, setLgShow]           = useState(false);
    const [blob, setBlob]               = useState(null);
    const [showQuestion, setShowQuestion] = useState(false);
    const [imageData, setImageData]     = useState({
        image_name: {},
        audio_name: {},
        video_name: {}
    });
    const getBlob = (blob) => {
        setBlob(blob);
        console.log('blob',blob);
    }
    const handleQuestionClose = () => setShowQuestion(false);
    const handleQuestionShow  = (event) => {
        let checkValue = event.target.checked;
        if(checkValue){
            console.log(event.target);
            setShowQuestion(true);
        }       
    }

    useEffect(() => {
        getSelectedSubQuestion(props?.match?.params?.id);
        getAllSubject();
        getAlllevel();
        if (props?.match?.params?.id) {
            getQuestionAnswer(props.match.params.id);            
        }
        getAllSubQuestion(props?.match?.params?.id);
        dispatch(changeCurrentPage('adminQuestionList'));
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
    const getAllSubQuestion = (id) => {
        let data = {

        };
        CommonService.getAllWithData('subQuestionDropdown/'+id, data)
            .then(response => {
                console.log(response.data.data);
                setAllQuestionDropdown(response.data.data.questionAnswers.data)
            })
            .catch(e => {
                console.log(e);
            });
    }
    const getQuestionAnswer = (id) => {
        setLoader(true)
        CommonService.getById('questionAnswer', id)
            .then(response => {
                if (response.data.success) {
                    setLoader(false);
                    console.log(response.data.data.questionAnswer);
                    let questionAnswer = {
                        question_name: response.data.data.questionAnswer.question_name,
                        question_description: response.data.data.questionAnswer.question_description,
                        subject_id: response.data.data.questionAnswer.subject_id,
                        level_id: response.data.data.questionAnswer.level_id,
                        answer_description: response.data.data.questionAnswer.answer_description,
                        marks: response.data.data.questionAnswer.marks,
                        file_type: response.data.data.questionAnswer.file_type,
                        isAdditional: response.data.data.questionAnswer.isAdditional,
                        sub_question_id: response.data.data.questionAnswer.sub_question_id
                    }
                    showFile(id);
                    setFormData(questionAnswer);
                    if(response.data.data.questionAnswer.file_type=='image'){
                        setShowHideImage(true);
                        setShowHideAudio(false);
                        setShowHideVideo(false);
                    }else if(response.data.data.questionAnswer.file_type=='audio'){
                        setShowHideImage(false);
                        setShowHideAudio(true);
                        setShowHideVideo(false);
                    }else if(response.data.data.questionAnswer.file_type=='video'){
                        setShowHideImage(false);
                        setShowHideAudio(false);
                        setShowHideVideo(true);
                    }
                } else {
                    setLoader(false);
                }
            })
            .catch(e => {
                console.log(e);
                setLoader(false);
            });
    }

    const showFile = (id) => {
        setImageLoader(true)
        setVideoLoader(true)
        setAudioLoader(true)
        CommonService.getById('questionAnswer/addFile', id)
            .then(response => {
                console.log(response.data);
                if (response.data.success) {
                    setImageData({ ...imageData, 'image_name': { 'content': response?.data?.data?.fileData['image']?.file_url }, 'audio_name': { 'content': response?.data?.data?.fileData['audio']?.file_url }, 'video_name': { 'content': response?.data?.data?.fileData['video']?.file_url } });
                    setImageLoader(false)
                    setVideoLoader(false)
                    setAudioLoader(false)
                }
            })
            .catch(e => {
                console.log(e);
                setImageLoader(false)
                setVideoLoader(false)
                setAudioLoader(false)
            });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (props?.match?.params?.id) {
            CommonService.update('questionAnswer', props.match.params.id, formData)
                .then(response => {
                    console.log(response);
                    toast.success(response.data.message);
                    props.history.push("/admin/question-answer");
                })
                .catch(e => {
                    console.log(e);
                });
        } else {
            CommonService.create('questionAnswer', formData)
                .then(response => {
                    console.log(response);
                    toast.success(response.data.message);
                    props.history.push("/admin/question-answer");
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }

    const onCropped = () => {

        setImageData({ ...imageData, ['image_name']: { 'content': blob } });
        setLgShow(false);
    }
    const handleFile = (e, key, filesData) => {
        const file = e.target.result;
        setImageData({ ...imageData, [key]: { 'content': file, 'files': filesData } });
    }

    const onUploadFile = (e, key) => {
        let dataSend = {};

        if (key === 'image_name') {
            setImageLoader(true)
            dataSend = { [key]: imageData?.image_name?.content };
        } else if (key === 'audio_name') {
            setAudioLoader(true)
            dataSend = { [key]: imageData?.audio_name?.content };
        } else {
            setVideoLoader(true);
            dataSend = { [key]: imageData?.video_name?.content };
        }
        setSubmitted(false);
        if (!!dataSend.image_name || !!dataSend.audio_name || !!dataSend.video_name) {
            if (props?.match?.params?.id) {
                CommonService.updatePost('questionAnswer/addFile', props.match.params.id, dataSend)
                    .then(response => {
                        setFormData({ ...formData, [key]: response.data.data.fileId });
                        toast.success("File upload successfully");
                        setImageLoader(false)
                        setVideoLoader(false)
                        setAudioLoader(false)
                        setSubmitted(true);
                    })
                    .catch(e => {
                        console.log(e);
                        setImageLoader(false)
                        setVideoLoader(false)
                        setAudioLoader(false)
                        setSubmitted(true);
                    });
            } else {
                CommonService.create('questionAnswer/addFile', dataSend)
                    .then(response => {
                        console.log(response);
                        setFormData({ ...formData, [key]: response.data.data.fileId });
                        toast.success("File upload successfully");
                        setImageLoader(false)
                        setVideoLoader(false)
                        setAudioLoader(false)
                        setSubmitted(true);
                    })
                    .catch(e => {
                        console.log(e);
                        setImageLoader(false)
                        setVideoLoader(false)
                        setAudioLoader(false)
                        setSubmitted(true);
                    });
            }

        } else {
            toast.error('Please upload first');
            setLoader(false);
        }
    }

    const handleChange = event => {

        let { name, value } = event.target;
        if (name === 'isAdditional') {
            value = event.target.checked;
        } else if (name === 'image_name') {
            let fileData = new FileReader();
            const files = event.target.files[0];
            fileData.onloadend = (e) => handleFile(e, 'image_name', files);
            fileData.readAsDataURL(event.target.files[0]);
            setLgShow(true);
        } else if (name === 'audio_name') {
            let fileData = new FileReader();
            const files = event.target.files[0];
            fileData.onloadend = (e) => handleFile(e, 'audio_name', files);
            fileData.readAsDataURL(event.target.files[0]);
        } else if (name === 'video_name') {
            let fileData = new FileReader();
            const files = event.target.files[0];
            fileData.onloadend = (e) => handleFile(e, 'video_name', files);
            fileData.readAsDataURL(event.target.files[0]);

        }
        setFormData({ ...formData, [name]: value });
    }
    
    const handleShowHideChange = event => {
        let { name, value } = event.target;
        console.log(value);
        setFormData({ ...formData, [name]: value });
        switch (value) {
            case "image":
                setShowHideImage(true);
                setShowHideAudio(false);
                setShowHideVideo(false);
                break;
            case "audio":
                setShowHideImage(false);
                setShowHideAudio(true);
                setShowHideVideo(false);
                break;
            case "video":
                setShowHideImage(false);
                setShowHideAudio(false);
                setShowHideVideo(true);
                break;
            default:
                setShowHideImage(false);
                setShowHideAudio(false);
                setShowHideVideo(false);
        }
    }
    const getSelectedSubQuestion = (id) => {
        CommonService.getById('getSubQuestionAnswer', id)
            .then(response => {
                if (response.data.success && response.data.data.retData) {
                    setCheckedValue(true);
                } else {
                    setCheckedValue(false);
                }
            })
            .catch(e => {
                console.log(e);
                setLoader(false);
            });
    }
    const deleteFileData = (key, type, dat) => {
        
        console.log(type);
        
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                if(type=='image'){
                    setImageLoader(true)
                }else if(type=='audio'){                        
                    setAudioLoader(true)
                }else if(type=='video'){
                    setVideoLoader(true)
                }
                CommonService.remove('questionAnswer/deleteFile', props.match.params.id, formData)
                .then(response => {
                    console.log(response);
                    toast.success(response.data.message);
                    showFile(props.match.params.id);
                    //props.history.push("/admin/question-answer");
                    if(type=='image'){
                        setImageLoader(false)
                    }else if(type=='audio'){                        
                        setAudioLoader(false)
                    }else if(type=='video'){
                        setVideoLoader(false)
                    }
                })
                .catch(e => {
                    console.log(e);
                    toast.error(e);
                    if(type=='image'){
                        setImageLoader(false)
                    }else if(type=='audio'){                        
                        setAudioLoader(false)
                    }else if(type=='video'){
                        setVideoLoader(false)
                    }
                });
            }            
        });
    }
    const handleSaveSubQuestion = (e) => {
        console.log(formData);
        setLoaderSubQuestion(true);
        if (props?.match?.params?.id) {
            CommonService.update('saveSubQuestion', props.match.params.id, formData)
                .then(response => {
                    if(response.data.message==='validation_failed'){
                        toast.error(response.data.data); 
                    }else{
                        toast.success(response.data.message);  
                    } 
                    setLoaderSubQuestion(false);                   
                })
                .catch(e => {
                    console.log(e);
                    setLoaderSubQuestion(false); 
                });
        } 
    }
    return (
        <div>

            <div className="col-lg-12 ">
                <div className="register-form">
                    <div className="addQuestions text-left">
                    {(props?.match?.params?.id) ? 'UPDATE' : 'ADD'} Question
                         </div>
                    {(loader) ?
                    <CustomLoader /> : 
                        <Form onSubmit={handleSubmit}>
                            <div className="">
                                <Form.Group controlId="formTitle1">
                                    <Form.Control className="" value={formData.question_name} name="question_name" required placeholder="Question Name" onChange={handleChange} />

                                </Form.Group>
                                <Form.Row>
                                    <Form.Group controlId="formSubject" className="col-md-6">
                                        <Form.Control as="select" value={formData.subject_id} name="subject_id" required className="" onChange={handleChange}>
                                            <option value="">Subject</option>
                                            {
                                                allSubjects.map((subject, index) => {
                                                    return <option key={index} value={subject.id}>{subject.name}</option>;
                                                })
                                            }

                                        </Form.Control>

                                    </Form.Group>
                                    <Form.Group controlId="formLevels" className="col-md-6">
                                        <Form.Control as="select" value={formData.level_id} name="level_id" required className="" onChange={handleChange}>
                                            <option value="">Level</option>
                                            {
                                                allLevels.map((level, index) => {
                                                    return <option key={index} value={level.id}>{level.name}</option>;
                                                })
                                            }
                                        </Form.Control>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Group controlId="formTitle2" >
                                    <Form.Control className="" required value={formData.question_description} name="question_description" placeholder="Question Description" onChange={handleChange} />
                                </Form.Group>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formAnswer">
                                        <Form.Control className="" required value={formData.answer_description} name="answer_description" placeholder="Expected Answer" onChange={handleChange} />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formGridState">
                                        <Form.Control as="select" name="marks" value={formData.marks} className="" onChange={handleChange}>
                                            <option value="">Mark</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="7">9</option>
                                            <option value="8">10</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Group controlId="formTitle2" className="selectUpType">
                                    <Form.Control as="select" name="file_type" value={formData.file_type} onChange={handleShowHideChange}>
                                        <option value="">Select Upload Type</option>
                                        <option value="image">image</option>
                                        <option value="audio">audio</option>
                                        <option value="video">video</option> 
                                    </Form.Control>
                                </Form.Group>                                
                                {showHideImage &&
                                <div className="eachImgUpWrap imageDiv mt-4" >
                                    <h4>Add a supporting image</h4>
                                    <div className="d-flex eachImgUpBox">
                                        <div className="uploadedimgPReview"> <Form.File
                                            id="custom-file"
                                            name="image_name"
                                            onChange={handleChange}
                                            onClick={(e) => e.target.value = null}
                                            accept="image/*"
                                        />
                                            <img width="140" height="81"
                                                src={imageData?.image_name?.content ? imageData?.image_name?.content : noImg} alt="" />
                                        </div>


                                        <div className="uploadedTxt">
                                            <p>Drag and drop your image
                                            here or click on the icon
                                            to select your file from your file system. JPG  GIF  or  PNG</p>
                                            <button type="button" className="uploadBtnsImg h-25 mt-2" onClick={() => setOpenImg(true)}>Preview</button>
                                        </div>
                                        {/* {imageData?.image_name?.content &&
                                            <button type="button" className="uploadBtnsImg h-25 mr-" onClick={() => setOpenImg(true)}>Preview</button>} */}
                                            
                                        <div className="uploadedBtn">

                                            {(imageLoader) ?
                                                <CustomLoader /> : <button type="button" onClick={(e) => onUploadFile(e, 'image_name')} className="uploadBtnsImg green_btn">  Upload </button>
                                            }
                                            <button type="button" onClick={deleteFileData.bind(this,props?.match?.params?.id,'image')} className="uploadBtnsImg red_bg_btn ml-3"> Delete </button>
                                        </div>


                                    </div>
                                </div>
                                }
                                {showHideAudio &&
                                <div className="eachImgUpWrap audioDiv mt-4">
                                    <h4>Add a supporting sound file</h4>
                                    <div className="d-flex eachImgUpBox">
                                        <div className="uploadedimgPReview">
                                            <Form.File
                                                id="custom-file2"
                                                name="audio_name"
                                                onChange={handleChange}
                                                onClick={(e) => e.target.value = null}
                                                accept="audio/*"
                                            />
                                            <img width="140" height="81"
                                                src={noAudio} alt="" />
                                        </div>

                                        <div className="uploadedTxt">
                                            <p>Drag and drop your image
                                            here or click on the icon
                                            to select your file from your file system. JPG  GIF  or  PNG</p>
                                            {imageData?.audio_name?.content && <audio className="uploadBtnsImg h-40" src={imageData?.audio_name?.content} controls />}
                                            
                                        </div>
                                        
                                        <div className="uploadedBtn">
                                            {(audioLoader) ?
                                                <CustomLoader /> : <button type="button" onClick={(e) => onUploadFile(e, 'audio_name')} className="uploadBtnsImg green_btn">
                                                    Upload </button>
                                            }

                                            {imageData?.audio_name?.content && <button type="button" onClick={deleteFileData.bind(this,props?.match?.params?.id,'audio')} className="uploadBtnsImg ml-3 red_bg_btn"> Delete </button>
                                            }
                                        </div>
                                    </div>
                                </div>
                                }
                                {showHideVideo &&
                                <div className="eachImgUpWrap videoDiv mt-4">
                                    <h4>Add a supporting video file</h4>
                                    <div className="d-flex eachImgUpBox">
                                        <div className="uploadedimgPReview">
                                            <Form.File
                                                id="custom-file3"
                                                name="video_name"
                                                onChange={handleChange}
                                                onClick={(e) => e.target.value = null}
                                                accept="video/*"
                                            />
                                            <img width="140" height="81"
                                                src={noVideo} alt="" />
                                        </div>
                                        <div className="uploadedTxt">
                                            <p>Drag and drop your image
                                            here or click on the icon
                                            to select your file from your file system. JPG  GIF  or  PNG</p>
                                            {imageData?.video_name?.content && <button type="button" className="uploadBtnsImg h-25 mt-2" onClick={() => setOpen(true)}>Preview</button>}
                                        </div>

                                                                              
                                        <ModalVideo className="modal-video-close-btn" channel='custom' url={imageData?.video_name?.content} isOpen={isOpen} onClose={() => setOpen(false)} />

                                        <div className="uploadedBtn">
                                            {(videoLoader) ?
                                                <CustomLoader /> : <button type="button" onClick={(e) => onUploadFile(e, 'video_name')} className="uploadBtnsImg green_btn">
                                                    Upload
                                                </button>
                                            }
                                            <button type="button" onClick="" className="uploadBtnsImg ml-3 red_bg_btn" onClick={deleteFileData.bind(this,props?.match?.params?.id,'video')}> Delete </button>
                                        </div>


                                    </div>
                                </div>
                                }
                                <div className="green_checkbox">
                                    <Form.Group >
                                    <Form.Check id="isAdditional" type="checkbox" name="isAdditional" label="Create an additional or sub question question" onClick={handleQuestionShow} 
                                        defaultChecked={checkedValue} />
                                    </Form.Group>

                                </div>
                                <div className="text-right mt-4">
                                <Link to={'/admin/assessment-list'} className="addLearner">Back</Link>&nbsp;
                                    {submitted && <Button variant="primary" className="addLearner" type="submit">
                                        {(props?.match?.params?.id) ? 'UPDATE' : 'ADD'}
                                    </Button>}
                                </div>
                            </div>
                        </Form>
                    }   
                </div>
                {/* <ToastContainer /> */}
            </div>
            <Modal
                size="lg"
                show={lgShow}
                onHide={() => {
                    setLgShow(false);
                    setImageData(null)
                }}
                aria-labelledby="example-modal-sizes-title-lg"
                animation={false}
                backdrop={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Crop Image First
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="crop-container">

                        <ImageCropper
                            getBlob={getBlob}
                            inputImg={imageData?.image_name?.content}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onCropped}>Save</Button>
                </Modal.Footer>
            </Modal>

            <Modal
                size="lg"
                show={isOpenImg}
                onHide={() => {
                    setOpenImg(false);
                }}
                aria-labelledby="example-modal-sizes-title-lg"
                animation={false}
                backdrop={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Image Preview
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="img-prev">
                   <img src={imageData?.image_name?.content} alt="alt"/>
                </Modal.Body>
            </Modal>

            <Modal className="questionModal" show={showQuestion} onHide={handleQuestionClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Manage Sub-Question</Modal.Title>
                </Modal.Header>
                <Modal.Body>                   
                    <Form.Row>
                        <Form.Group as={Col} controlId="formLevels">
                            <Form.Control as="select" value={formData.sub_question_id} name="sub_question_id" required className="" onChange={handleChange}>
                                <option value="">Question</option>
                                {
                                    allQuestionDropdown.map((question, index) => {
                                        return <option key={index} value={question.id}>{question.question_name} / {question.marks}</option>;
                                    })
                                }
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Button variant="primary" className="addLearner" type="button" onClick={handleSaveSubQuestion}>
                        Save SubQuestion
                    </Button>    
                </Modal.Body>
                <Modal.Footer>
                    
                </Modal.Footer>
            </Modal>
        </div>

    )
}

export default withRouter(AssessmentAdd);
