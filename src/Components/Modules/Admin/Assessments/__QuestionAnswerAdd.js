import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import noImg from '../../../assets/img/no-imgg.png';
import CommonService from "../../../services/CommonService";
import CustomLoader from "../../Common/CustomLoader";
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { changeCurrentPage } from "../../../store/actions/nav";

const QuestionAnswerAdd = (props) => {

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
        video_name: "",
        
    }
    const dispatch                      = useDispatch();    
    const [loader, setLoader]           = useState(false);
    const [formData, setFormData]       = useState(assessmentData);
   
    useEffect(() => {
       
        if (props?.match?.params?.id) {
            getQuestionAnswer(props.match.params.id);
        }
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
    const getQuestionAnswer = (id) => {
        CommonService.getById('questionAnswer', id)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.data.questionAnswer);
                    let questionAnswer = {
                        question_name: response.data.data.questionAnswer.question_name,
                        question_description: response.data.data.questionAnswer.question_description,
                        subject_id: response.data.data.questionAnswer.subject_id,
                        level_id: response.data.data.questionAnswer.level_id,
                        answer_description: response.data.data.questionAnswer.answer_description,
                        marks: response.data.data.questionAnswer.marks,
                        isAdditional: response.data.data.questionAnswer.isAdditional,
                    }
                    showFile(id);
                    setFormData(questionAnswer);
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

    const showFile = (id) =>{
        CommonService.getById('questionAnswer/addFile',id)
        .then(response => {

        setImageData({ ...imageData, 'image_name': { 'content': response?.data?.data?.fileData[0]?.encoded_file} });

        })
        .catch(e => {
            console.log(e);
        });
    } 

    const handleSubmit = (event) => {
        console.log(formData);
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
    const handleFile = (e, key, filesData) => {
        const file = e.target.result;
        setImageData({ ...imageData, [key]: { 'content': file, 'files': filesData } });
    }
    const onUploadFile = (e, key) => {
        setLoader(true);
        console.log(imageData);
        let dataSend = {};

        if (key === 'image_name') {
            dataSend = { [key]: imageData.image_name.content };
        } else if (key === 'audio_name') {
            dataSend = { [key]: imageData.audio_name.content };
        } else {
            dataSend = { [key]: imageData.audio_name.content };
        }

        if (!!dataSend.image_name || !!dataSend.audio_name || !!dataSend.video_name) {
            if(props?.match?.params?.id){
                CommonService.updatePost('questionAnswer/addFile', props.match.params.id ,dataSend)
                .then(response => {
                    console.log(response);
                    setFormData({ ...formData, [key]: response.data.data.fileId });
                    toast.success("File upload successfully");
                    setLoader(false);
                })
                .catch(e => {
                    console.log(e);
                    setLoader(false);
                });
            }else{
                CommonService.create('questionAnswer/addFile', dataSend)
                .then(response => {
                    console.log(response);
                    setFormData({ ...formData, [key]: response.data.data.fileId });
                    toast.success("File upload successfully");
                    setLoader(false);
                })
                .catch(e => {
                    console.log(e);
                    setLoader(false);
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
    return (
        <div>

            <div className="col-lg-12 ">
                <div className="register-form">
                    <div className="addQuestions text-left">
                        Add Question
                         </div>
                    <Form onSubmit={handleSubmit}>
                        <div className="">
                            <Form.Group controlId="formTitle1">
                                <Form.Control className="" value={formData.question_name} name="question_name" required  placeholder="Question Name" onChange={handleChange} />

                            </Form.Group>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formSubject">
                                    <Form.Control as="select" value={formData.subject_id} name="subject_id" required className="" onChange={handleChange}>
                                        <option value="">Choose...</option>
                                        {
                                            allSubjects.map((subject, index) => {
                                                return <option key={index} value={subject.id}>{subject.name}</option>;
                                            })
                                        }

                                    </Form.Control>

                                </Form.Group>
                                <Form.Group as={Col} controlId="formLevels">
                                    <Form.Control as="select" value={formData.level_id} name="level_id" required className="" onChange={handleChange}>
                                        <option value="">Choose...</option>
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
                                        <option value="">Marks</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>

                            <div className="eachImgUpWrap">
                                <h4>Add a supporting image</h4>
                                <div className="d-flex eachImgUpBox">
                                    <div className="uploadedimgPReview"> <Form.File
                                        id="custom-file"
                                        name="image_name"
                                        onChange={handleChange}
                                        accept="image/*"
                                    />
                                        <img width="140" height="81" src={imageData?.image_name?.content ? imageData?.image_name?.content : noImg} alt="" />
                                    </div>

                                    <div className="uploadedTxt">
                                        <p>Drag and drop your image
                                        here or click on the icon
                                        to select your file from
                            your file system. JPG  GIF  or  PNG</p>
                                    </div>
                                    <div className="uploadedBtn">
                                        
                                    {(loader) ?
                                <CustomLoader /> : <button type="button" onClick={(e) => onUploadFile(e, 'image_name')} className="uploadBtnsImg">
                                Upload
                        </button>
                            }
                                    </div>


                                </div>
                            </div>
                            <div className="eachImgUpWrap">
                                <h4>Add a supporting sound file</h4>
                                <div className="d-flex eachImgUpBox">
                                    <div className="uploadedimgPReview">
                                        <Form.File
                                            id="custom-file2"
                                            name="audio_name"
                                            onChange={handleChange}
                                            accept="audio/*"
                                        />
                                    </div>
                                    <div className="uploadedTxt">
                                        <p>Drag and drop your image
                                        here or click on the icon
                                        to select your file from
                            your file system. JPG  GIF  or  PNG</p>
                                    </div>
                                    <div className="uploadedBtn">
                                        <button type="button" onClick={(e) => onUploadFile(e, 'audio_name')} className="uploadBtnsImg">
                                            Upload
                                    </button>
                                    </div>


                                </div>
                            </div>
                            <div className="eachImgUpWrap">
                                <h4>Add a supporting video file</h4>
                                <div className="d-flex eachImgUpBox">
                                    <div className="uploadedimgPReview">
                                        <Form.File
                                            id="custom-file3"
                                            name="video_name"
                                            onChange={handleChange}
                                            accept="video/*"
                                        />
                                    </div>
                                    <div className="uploadedTxt">
                                        <p>Drag and drop your image
                                        here or click on the icon
                                        to select your file from
                            your file system. JPG  GIF  or  PNG</p>
                                    </div>
                                    <div className="uploadedBtn">
                                        <button type="button" onClick={(e) => onUploadFile(e, 'video_name')} className="uploadBtnsImg">
                                            Upload
                                    </button>
                                    </div>


                                </div>
                            </div>
                            <div className="green_checkbox">
                                <Form.Group >
                                    <Form.Check id="createquCheck" type="checkbox" name="isAdditional" label="Create an additional or sub question question" onChange={handleChange} />
                                </Form.Group>

                            </div>
                            <div className="text-right mt-4">
                                <Button variant="primary" className="addLearner" type="submit">
                                    {(props?.match?.params?.id) ? 'UPDATE' : 'ADD'}
                                </Button>
                            </div>
                        </div>



                    </Form>


                </div>
                {/* <ToastContainer /> */}
            </div>
        </div>
    )
}

export default withRouter(QuestionAnswerAdd);