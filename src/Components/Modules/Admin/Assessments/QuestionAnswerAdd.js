import { Link  } from "react-router-dom";
import React, { useState, useCallback, useRef, useEffect } from "react";

import {render} from 'react-dom'
import MathJax from 'react-mathjax-preview';

import AudioRecorder from "../../../Utils/AudiRecorder";

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
// import ImageCropper from '../../../Utils/ImageCropper';
import ReactCrop from 'react-image-crop';
// import ReactImageCropper from '../../../Utils/ReactImageCropper';
import ReactPlayer from 'react-player'
import CKEditor4 from 'ckeditor4-react'

import './Assessments.css';


// 

// Increase pixel density for crop preview quality on retina screens.
const pixelRatio = window.devicePixelRatio || 1;

// We resize the canvas down when saving on retina devices otherwise the image
// will be double or triple the preview size.
function getResizedCanvas(canvas, newWidth, newHeight) {
  const tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = newWidth;
  tmpCanvas.height = newHeight;

  const ctx = tmpCanvas.getContext("2d");
  ctx.drawImage(
    canvas,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    0,
    newWidth,
    newHeight
  );

  return tmpCanvas;
}

function generateDownload(previewCanvas, crop) {
    
  if (!crop || !previewCanvas) {
    return;
  }

  const canvas = getResizedCanvas(previewCanvas, crop.width, crop.height);
  //console.log(canvas);
//   canvas.toBlob(
//     (blob) => {
//         const previewUrl = window.URL.createObjectURL(blob);

//         const anchor = document.createElement("a");
//         anchor.download = "cropPreview.png";
//         anchor.href = URL.createObjectURL(blob);
//         anchor.click();

//         window.URL.revokeObjectURL(previewUrl);
//         },
//     "image/png",
//     1
//   );

  var imagess = new Promise((resolve) => {
        const baseurl =  canvas.toDataURL();
        resolve(baseurl);
    })
  //console.log(imagess);

  return imagess;
}

// 
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
    const dispatch                                  = useDispatch();
    const [allSubjects, setAllSubjects]             = useState([]);
    const [allLevels, setAllLevels]                 = useState([]);
    const [allQuestionDropdown, setAllQuestionDropdown] = useState([]);
    const [checkedValue,setCheckedValue]                = useState(false);
    const [checkedWorkingValue,setCheckedWorkingValue]  = useState(false);
    const [primaryQuestion,setPrimaryQuestion]      = useState([]);
    const [previewUrl,setPreviewUrl]                = useState(false);

    const [loader,setLoader]                        = useState(false);
    const [showHideImage, setShowHideImage]         = useState(false);
    const [showHideAudio, setShowHideAudio]         = useState(false);
    const [showHideAudioRecord, setShowHideAudioRecord] = useState(false);
    const [showHideVideo, setShowHideVideo]         = useState(false);
    const [showHideFile, setShowHideFile]           = useState(false);
    
    const [loaderSubQuestion, setLoaderSubQuestion] = useState(false);
    
    const [imageLoader, setImageLoader] = useState(false);
    const [audioLoader, setAudioLoader] = useState(false);
    const [audioRecordLoader, setAudioRecordLoader] = useState(false);
    const [videoLoader, setVideoLoader] = useState(false);
    const [fileLoader, setFileLoader]   = useState(false);
    const [modalPLoader, setModalPLoader]= useState(false);
    const [submitted, setSubmitted]     = useState(true);
    const [formData, setFormData]       = useState(assessmentData);
    const [isOpen, setOpen]             = useState(false);
    const [isOpenImg, setOpenImg]       = useState(false);
    const [lgShow, setLgShow]           = useState(false);
    const [blob, setBlob]               = useState(null);

    const [isOpenAudioRecord, setIsOpenAudioRecord] = useState(false);
    const [questionAudioId, setQuestionAudioId]   = useState('');
    const [questionId, setQuestionId]   = useState('');
    const [audioPath, setAudioPath]     = useState([]);

    const [showQuestion, setShowQuestion] = useState(false);
    const [imageData, setImageData]     = useState({
        image_name: {},
        audio_name: {},
        video_name: {}
    });

// 
    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: false });
    const [completedCrop, setCompletedCrop] = useState(null);

    // const onSelectFile = (e) => {
    //     if (e.target.files && e.target.files.length > 0) {
    //         const reader = new FileReader();
    //         reader.addEventListener("load", () => setUpImg(reader.result));
    //         reader.readAsDataURL(e.target.files[0]);
    //     }
    // };

    const onLoad = useCallback((img) => {
        imgRef.current = img;
        //console.log(previewCanvasRef.current, completedCrop);
    }, []);

// 

    // const getBlob = (blob) => {
    //     setBlob(blob)
    // }
    const handleQuestionClose = () => {
        setShowQuestion(false);
        setPrimaryQuestion([]);
        setAllQuestionDropdown([]);
    }

    const handleQuestionShow  = (event) => {
        
        let checkValue = event.target.checked;
        
        if(checkValue){
            // console.log(event.target);
            setShowQuestion(true);
            if (props?.match?.params?.id) {
                getAllSubQuestion(props?.match?.params?.id); 
            }else{
                getAllSubQuestion();
            }
        }else{
            if (props?.match?.params?.id) {
                setQuestionId(props?.match?.params?.id);
            }else{
                setFormData({ ...formData, 'primary_question_id': '' });
            }
            //console.log(formData);        
        }       
    }

    useEffect(() => {
        getAllSubject();
        getAlllevel();
        if (props?.match?.params?.id) {
            getSelectedSubQuestion(props?.match?.params?.id);
            getQuestionAnswer(props.match.params.id);  
            getAllSubQuestion(props?.match?.params?.id); 
            setQuestionId(props?.match?.params?.id);                     
        }else{
            getAllSubQuestion();    
        }
        dispatch(changeCurrentPage('adminQuestionList'));
       
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }
        
        const image   = imgRef.current;
        const canvas  = previewCanvasRef.current;
        const crop    = completedCrop;
    
        const scaleX  = image.naturalWidth / image.width;
        const scaleY  = image.naturalHeight / image.height;
        const ctx     = canvas.getContext("2d");
    
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;
    
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";
    
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
    }, [completedCrop]);

    const getAllSubject = () => {
        CommonService.getAll('subjects')
            .then(response => {
                setAllSubjects(response.data.data.subjects);
            })
            .catch(e => {
                //console.log(e);
                toast.error(e);
            });
    }

    const getAlllevel = () => {
        CommonService.getAll('levels')
            .then(response => {
                setAllLevels(response.data.data.levels);
            })
            .catch(e => {
                //console.log(e);
                toast.error(e);
            });
    }
    const getAllSubQuestion = (id) => {
        var url ;
        if(id!='' && id!=undefined){
            url = 'subQuestionDropdown/'+id;
        }else{
            url = 'subQuestionDropdown/';
        }
        setPrimaryQuestion([]);
        
        CommonService.getAllWithData(url, formData)
            .then(response => {
                setAllQuestionDropdown(response.data.data.questionAnswers.data);
                if(id!='' && id!=undefined){
                   
                    setPrimaryQuestion(response.data.data?.questionData);
                }
            })
            .catch(e => {
                console.log(e);
            });
    }
    const handleChangePrimaryQuestion = (e) => {
        
        //console.log(e.target.value);
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        //console.log(formData);
        const primaryQuestionFormData = {
            primary_question_id: e.target.value,
            subject_id: formData.subject_id,
            level_id: formData.level_id,
        }
        
        if(e.target.value!=""){
            setModalPLoader(true);
            CommonService.updatePost('getPrimaryQuestionData', props.match.params.id, primaryQuestionFormData)
            .then(response => {
                //console.log(response.data.data.questionData);
                setPrimaryQuestion(response.data.data.questionData);
                setModalPLoader(false);
            })
            .catch(e => {
                toast.error("File not upload");
                setModalPLoader(false);
            });
        } 
    }
    const getSelectedSubQuestion = (id) => {
        CommonService.getById('getSubQuestionAnswer', id)
            .then(response => {
                //console.log(response.data.data);
                if (response.data.success && response.data.data.retData) {
                    //setPrimaryQuestion(response.data.data.questionData);
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
    const getQuestionAnswer = (id) => {
        setLoader(true)
        CommonService.getById('questionAnswer', id)
            .then(response => {
                if (response.data.success) {
                    setLoader(false);
                    // let asciimath = response.data.data.questionAnswer.question_description;
                    console.log(response.data.data.questionAnswer);
                    let questionAnswer = {
                        question_name: response.data.data.questionAnswer.question_name,
                        question_description: response.data.data.questionAnswer.question_description,
                        subject_id: response.data.data.questionAnswer.subject_id,
                        level_id: response.data.data.questionAnswer.level_id,
                        answer_description: response.data.data.questionAnswer.answer_description,
                        answer_instruction: response.data.data.questionAnswer.answer_instruction,
                        marks: response.data.data.questionAnswer.marks,
                        file_type: response.data.data.questionAnswer.file_type,
                        isAdditional: response.data.data.questionAnswer.isAdditional,
                        primary_question_id: response.data.data.questionAnswer.primary_question_id,
                        isAudioAnswer: response.data.data.questionAnswer.is_audio_answer,
                        showWorkingBox: response.data.data.questionAnswer.show_working_box,
                        
                    }
                    if(response.data.data.questionAnswer.show_working_box){
                        setCheckedWorkingValue(true);
                    }
                    console.log(response.data.data.questionAnswer.is_audio_answer);
                    console.log(response.data.data.questionAnswer.show_working_box);
                    //(response.data.data.questionAnswer.file_type);
                    showFile(id);
                    setFormData(questionAnswer);
                    
                    if(response.data.data.questionAnswer.file_type=='image'){
                        setShowHideImage(true);
                        setShowHideAudio(false);
                        setShowHideAudioRecord(false);
                        setShowHideVideo(false);
                        setShowHideFile(false);
                    }else if(response.data.data.questionAnswer.file_type=='audio'){
                        setShowHideImage(false);
                        setShowHideAudio(true);
                        setShowHideAudioRecord(false);
                        setShowHideVideo(false);
                        setShowHideFile(false);
                    }else if(response.data.data.questionAnswer.file_type=='audio_record'){
                        setShowHideImage(false);
                        setShowHideAudio(false);
                        setShowHideAudioRecord(true);
                        setShowHideVideo(false);
                        setShowHideFile(false);
                    }else if(response.data.data.questionAnswer.file_type=='video'){
                        setShowHideImage(false);
                        setShowHideAudio(false);
                        setShowHideAudioRecord(true);
                        setShowHideVideo(true);
                        setShowHideFile(false);
                    }else if(response.data.data.questionAnswer.file_type=='file'){
                        setShowHideImage(false);
                        setShowHideAudio(false);
                        setShowHideAudioRecord(true);
                        setShowHideVideo(false);
                        setShowHideFile(true);
                    }
                } else {
                    setLoader(false);
                }
            })
            .catch(e => {
                //console.log(e);
                setLoader(false);
            });
    }

    const showFile = (id) => {
        setImageLoader(true)
        setVideoLoader(true)
        setAudioLoader(true)
        setFileLoader(true)
        CommonService.getById('questionAnswer/addFile', id)
            .then(response => {
                
                if (response.data.success) {
                    setImageData({ ...imageData, 'image_name': { 'content': response?.data?.data?.fileData['image']?.file_url }, 'audio_name': { 'content': response?.data?.data?.fileData['audio']?.file_url }, 
                    'audio_record_name': { 'content': response?.data?.data?.fileData['audio_record']?.file_url },'video_name': { 'content': response?.data?.data?.fileData['video']?.file_url } });
                    if(response?.data?.data?.fileData['file']?.file_url){
                        setPreviewUrl(response?.data?.data?.fileData['file']?.file_url);
                    }
                    // console.log(response?.data?.data?.fileData['file']?.file_url);
                    // console.log();
                    setImageLoader(false)
                    setVideoLoader(false)
                    setAudioLoader(false)
                    setFileLoader(false)
                }
            })
            .catch(e => {
                //console.log(e);
                toast.error(e);
                setImageLoader(false)
                setVideoLoader(false)
                setAudioLoader(false)
                setFileLoader(false)
            });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(false);
        if (props?.match?.params?.id) {
            CommonService.update('questionAnswer', props.match.params.id, formData)
                .then(response => {
                    setSubmitted(false);
                    if(response.data.message=='validation_failed'){
                        toast.error(JSON.stringify(response.data.data));
                    }else{
                        if(response.data.success){
                            toast.success(response.data.message);
                            props.history.push("/admin/question-answer");
                        }
                    }
                })
                .catch(e => {
                    //console.log(e);
                    toast.error(e);
                });
        } else {
            CommonService.create('questionAnswer', formData)
                .then(response => {
                    setSubmitted(false);
                    if(response.data.message=='validation_failed'){
                        toast.error(JSON.stringify(response.data.data));
                    }else{
                        if(response.data.success){
                            toast.success(response.data.message);
                            props.history.push("/admin/question-answer");
                        }
                    }                    
                })
                .catch(e => {
                    //console.log(e);
                    toast.error(e);
                });
        }
    }

    const onCropped = async (previewCanvas, crop) => {
       
        var croppedImage = await generateDownload(previewCanvas, crop);
        setBlob(croppedImage);
        //console.log('blob',croppedImage);
        setImageData({ ...imageData, ['image_name']: { 'content': croppedImage } });
        
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
        } else if(key === 'video_name'){
            setVideoLoader(true);
            dataSend = { [key]: imageData?.video_name?.content };
        }
        else if(key === 'file_name'){
            setFileLoader(true);
            dataSend = { [key]: imageData?.file_name?.content };
        }
        setSubmitted(false);
        if (!!dataSend.image_name || !!dataSend.audio_name || !!dataSend.video_name || !!dataSend.file_name) {
            if (props?.match?.params?.id) {
                CommonService.updatePost('questionAnswer/addFile', props.match.params.id, dataSend)
                    .then(response => {
                        setFormData({ ...formData, [key]: response.data.data.fileId });
                        if(key === 'file_name'){
                            setPreviewUrl(response.data.data?.urlPath);
                        }
                        toast.success("File upload successfully");
                        setImageLoader(false)
                        setVideoLoader(false)
                        setAudioLoader(false)
                        setFileLoader(false)
                        setSubmitted(true);

                    })
                    .catch(e => {
                        setImageLoader(false)
                        setVideoLoader(false)
                        setAudioLoader(false)
                        setFileLoader(false)
                        setSubmitted(true);
                    });
            } else {
                CommonService.create('questionAnswer/addFile', dataSend)
                    .then(response => {
                        
                        setFormData({ ...formData, [key]: response.data.data.fileId });
                        if(key === 'file_name'){
                            setPreviewUrl(response.data.data?.urlPath);
                        }
                        toast.success("File upload successfully");
                        setImageLoader(false)
                        setVideoLoader(false)
                        setAudioLoader(false)
                        setFileLoader(false)
                        setSubmitted(true);
                        //console.log(response.data.data.fileId);
                        //console.log(formData);
                    })
                    .catch(e => {
                        //console.log(e);
                        toast.error(e);
                        setImageLoader(false)
                        setVideoLoader(false)
                        setAudioLoader(false)
                        setFileLoader(false)
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
        } else if (name === 'isAudioAnswer') {
            value = event.target.checked;
        } else if (name === 'image_name') {
            let fileData = new FileReader();
            const files = event.target.files[0];
            fileData.onloadend = (e) => handleFile(e, 'image_name', files);
            fileData.addEventListener("load", () => setUpImg(fileData.result));
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
        } else if (name === 'file_name') {
            let fileData = new FileReader();
            const files = event.target.files[0];
            fileData.onloadend = (e) => handleFile(e, 'file_name', files);
            fileData.readAsDataURL(event.target.files[0]);
        }

        if (name === 'showWorkingBox') {
            value = event.target.checked;
        }

        //console.log(value);
        setFormData({ ...formData, [name]: value });
    }
    
    const handleShowHideChange = event => {
        let { name, value } = event.target;
        
        setFormData({ ...formData, [name]: value });
        switch (value) {
            case "image":
                setShowHideImage(true);
                setShowHideAudio(false);
                setShowHideAudioRecord(false);
                setShowHideVideo(false);
                setShowHideFile(false);
                break;
            case "audio":
                setShowHideImage(false);
                setShowHideAudio(true);
                setShowHideAudioRecord(false);
                setShowHideVideo(false);
                setShowHideFile(false);
                break;
            case "audio_record":
                setShowHideImage(false);
                setShowHideAudio(false);
                setShowHideAudioRecord(true);
                setShowHideVideo(false);
                setShowHideFile(false);
                break;
            case "video":
                setShowHideImage(false);
                setShowHideAudio(false);
                setShowHideAudioRecord(false);
                setShowHideVideo(true);
                setShowHideFile(false);
                break;
            case "file":
                setShowHideImage(false);
                setShowHideAudio(false);
                setShowHideAudioRecord(false);
                setShowHideVideo(false);
                setShowHideFile(true);
                break;
            default:
                setShowHideImage(false);
                setShowHideAudio(false);
                setShowHideVideo(false);
                setShowHideFile(false);
        }
    }
    

    const deleteFileData = (key, type, dat) => {    
        
        swal({
            title: "Delete This Question?",
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
                }else if(type=='audio_record'){                        
                    setAudioRecordLoader(true)
                }else if(type=='video'){
                    setVideoLoader(true)
                }else if(type=='file'){
                    setFileLoader(true)
                }
                var qid = '';
                if(props.match.params.id){
                    qid = props.match.params.id;
                }
                 
                CommonService.updatePost('questionAnswer/deleteFile', qid, formData)
                .then(response => {
                    //console.log(response);
                    if (response.data.success) {
                        toast.success(response.data.message);
                        showFile(props.match.params.id);
                        //props.history.push("/admin/question-answer");
                        if(type=='image'){
                            setImageLoader(false)
                        }else if(type=='audio'){                        
                            setAudioLoader(false)
                        }else if(type=='audio_record'){                        
                            setAudioRecordLoader(false)
                        }else if(type=='video'){
                            setVideoLoader(false)
                        }else if(type=='file'){
                            setFileLoader(false)
                        }
                    }                    
                })
                .catch(e => {
                    //console.log(e);
                    toast.error(e);
                    if(type=='image'){
                        setImageLoader(false)
                    }else if(type=='audio'){                        
                        setAudioLoader(false)
                    }else if(type=='audio_record'){                        
                        setAudioRecordLoader(false)
                    }else if(type=='video'){
                        setVideoLoader(false)
                    }else if(type=='file'){
                        setFileLoader(false)
                    }
                });
            }            
        });
    }
    const handleSaveSubQuestion = (e) => {
        //console.log(formData);
        setLoaderSubQuestion(true);
        if(formData.primary_question_id===""){
            toast.error('Select Sub Question');
        }
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
                    //console.log(e);
                    toast.error(e);
                    setLoaderSubQuestion(false); 
                });
        } 
    }
    const handleChange1 = (event) => {
        //console.log(event.editor.getData());
        setFormData({ ...formData, 'question_description': event.editor.getData() });
    }

    // const handleChange2 = (event) => {
    //     console.log('fffff');
    // }
    //audio recording

    const onOpenModalRecord = (questionDetailId) =>{
        //console.log(questionDetailId);
        //setQuestionDetailId(questionDetailId);
        setIsOpenAudioRecord(true);
    }

    const handleClose = () =>{
        setQuestionAudioId('');
        setIsOpenAudioRecord(false);
    }

    const callbackFunction = (childData) => {
        //console.log(childData);
        setAudioPath(childData.audioPath); 
        if(childData?.audioPath){
            setImageData({ ...imageData, 'audio_record_name': { 'content': childData?.audioPath }});
            setFormData({ ...formData, 'audio_record_name': {'content': childData?.fileUrl?.path }, 'audio_record_id': {'content': childData?.fileId?.id} });
        }        
    }

    const deleteQuestion = () => {
       
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                CommonService.remove('deleteQuestion',props.match.params.id)
                .then(response => {
                    console.log(response.data);
                    if(response.data.success){
                        toast.success(response.data.message);
                        props.history.push("/admin/question-answer");
                    }else{
                        toast.error(response.data.message);
                    }                    
                })
                .catch(e => {
                    toast.error(e,{autoClose: false});   
                });
            }
        });
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
                                <Form.Row>
                                    <Form.Group className="col-md-6" controlId="question_name">
                                        <Form.Control className="" value={formData.question_name} name="question_name" placeholder="Question Name" onChange={handleChange} />
                                    </Form.Group>
                                    <Form.Group className="col-md-6" controlId="formGridState">
                                        <Form.Control as="select" name="marks" value={formData.marks} className="" required onChange={handleChange}>
                                            <option value="">Mark</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Form.Row>
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
                                <Form.Group controlId="formTitle2">
                                    {/* <MathJax math={String.raw`${formData.question_description}`} />         */}
                                    <CKEditor4
                                        name="question_description"
                                        data={formData.question_description}
                                        config={{
                                            extraPlugins: ['ckeditor_wiris'],
                                            allowedContent: true,
                                            height: 300,
                                            startupFocus: 'end',
                                            skin: 'moono',   
                                                                               
                                        }}
                                        onBeforeLoad={(CKEDITOR) => {
                                            CKEDITOR.plugins.addExternal('ckeditor_wiris', 'https://www.wiris.net/demo/plugins/ckeditor/', 'plugin.js');
                                        }}
                                        
                                        onChange={handleChange1}
                                        onReady={ editor => {
                                            // You can store the "editor" and use when it is needed.
                                            // console.log( 'Editor1 is ready to use!', editor );
                                        } }
                                    />
                                </Form.Group>
                                <Form.Row>
                                    <Form.Group className="col-md-8">
                                        <Form.Control className="" value={formData.answer_instruction} name="answer_instruction" placeholder="Answer Instruction" onChange={handleChange} />
                                    </Form.Group>
                                    
                                
                                    <Form.Group className="col-md-8">
                                        <textarea className="form-control" placeholder="Expected Answer" id="answer_description" name="answer_description" rows="3" onChange={handleChange} value={formData.answer_description}></textarea>
                                        
                                    </Form.Group>
                                    <Form.Group className="col-md-4">Use '||' as a separator for multiple Answer. (Ex - 4||4pm||4:00||4.00)</Form.Group>
                                </Form.Row>
                                <Form.Group controlId="formTitle2" className="selectUpType">
                                    <Form.Control as="select" name="file_type" value={formData.file_type} onChange={handleShowHideChange}>
                                        <option value="">Select Upload Type</option>
                                        <option value="image">Image</option>
                                        <option value="file">Pdf File</option>
                                        <option value="audio">Audio</option>
                                        <option value="audio_record">Audio Record</option>
                                        <option value="video">Video</option> 
                                    </Form.Control>
                                </Form.Group>
                                {/* <Form.Group controlId="formTitle2" className="selectUpType">
                                    <ReactCrop src="/demo.jpg" crop={crop} onChange={newCrop => setCrop(newCrop)} />
                                </Form.Group>             */}
                                                                
                                {showHideImage &&
                                <div className="eachImgUpWrap imageDiv mt-4" >
                                    <h4>Add a supporting image</h4>
                                    <div className="d-flex eachImgUpBox">
                                        <div className="uploadedimgPReview"> 
                                            <Form.File
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
                                                <CustomLoader /> : <button type="button" onClick={(e) => onUploadFile(e, 'image_name')} className="uploadBtnsImg green_btn"> Upload </button>
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
                                            <p>Drag and drop your MP3 audio file here or click on the icon to select your file from your file system</p>
                                            {imageData?.audio_name?.content && <audio className="uploadBtnsImg h-40" src={imageData?.audio_name?.content} controls />}
                                            
                                        </div>
                                        
                                        <div className="uploadedBtn">
                                            {(audioLoader) ?
                                                <CustomLoader /> : <button type="button" onClick={(e) => onUploadFile(e, 'audio_name')} className="uploadBtnsImg green_btn">
                                                    Upload </button>
                                            }
                                            <button type="button" onClick={(e) => onOpenModalRecord(e)} className="uploadBtnsImg red_bg_btn">  Record </button>

                                            {imageData?.audio_name?.content && <button type="button" onClick={deleteFileData.bind(this,props?.match?.params?.id,'audio')} className="uploadBtnsImg ml-3 red_bg_btn"> Delete </button>
                                            }
                                        </div>
                                    </div>
                                </div>
                                }
                                {showHideAudioRecord &&
                                <div className="eachImgUpWrap audioDiv mt-4">
                                    <h4>Add a supporting sound file</h4>
                                    <div className="d-flex eachImgUpBox">
                                        

                                        <div className="uploadedTxt">
                                            <p>Drag and drop your MP3 audio file here or click on the icon to select your file from your file system</p>
                                            {imageData?.audio_record_name?.content && <audio className="uploadBtnsImg h-40" src={imageData?.audio_record_name?.content} controls />}
                                            
                                        </div>
                                        
                                        <div className="uploadedBtn">
                                            {(audioRecordLoader) ?
                                                <CustomLoader /> : 
                                                
                                                <button type="button" onClick={(e) => onOpenModalRecord(e)} className="uploadBtnsImg red_bg_btn">  Record </button>
                                            }
                                            {imageData?.audio_record_name?.content && <button type="button" onClick={deleteFileData.bind(this,props?.match?.params?.id,'audio_record')} className="uploadBtnsImg ml-3 red_bg_btn"> Delete </button>
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
                                            <p>Drag and drop your MP4 video file here or click on the icon to select your file from your file system</p>
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
                                {showHideFile &&
                                <div className="eachImgUpWrap fileDiv mt-4">
                                    <h4>Add a supporting pdf file</h4>
                                    <div className="d-flex eachImgUpBox">
                                        <div className="uploadedimgPReview">
                                            <Form.File
                                                id="custom-file2"
                                                name="file_name"
                                                onChange={handleChange}
                                                onClick={(e) => e.target.value = null}
                                            />
                                            <img width="140" height="81"
                                                src={noImg} alt="" />
                                        </div>
                                        
                                        <div className="uploadedTxt">
                                        
                                            <p>Drag and drop your pdf file here or click on the icon to select your file from your file system</p>
                                            {(previewUrl)?<p className="pdfDownload" onClick={()=> window.open(previewUrl, "_blank")}>Preview File</p>:''}
                                            
                                        </div>
                                        
                                        <div className="uploadedBtn">
                                            {(fileLoader) ?
                                                <CustomLoader /> : <button type="button" onClick={(e) => onUploadFile(e, 'file_name')} className="uploadBtnsImg green_btn">
                                                    Upload </button>
                                            }

                                            {imageData?.file_name?.content && <button type="button" onClick={deleteFileData.bind(this,props?.match?.params?.id,'file')} className="uploadBtnsImg ml-3 red_bg_btn"> Delete </button>
                                            }
                                        </div>
                                    </div>
                                </div>
                                }
                                
                                <div className="green_checkbox">
                                    <Form.Group>
                                        <Form.Check id="isAdditional" type="checkbox" name="isAdditional" label="Add primary question for this question" onClick={handleQuestionShow} 
                                        defaultChecked={checkedValue} />
                                    </Form.Group>                               
                                </div>
                                
                                <div className="green_checkbox">
                                    <Form.Group>
                                        <Form.Check id="isAudioAnswer" type="checkbox" name="isAudioAnswer" label="Is an audio recording answer" onClick={handleChange} 
                                        defaultChecked={formData.isAudioAnswer} value="yes" />
                                    </Form.Group>                               
                                </div>
                                
                                <div className="green_checkbox">
                                    <Form.Group>
                                        <Form.Check id="showWorkingBox" type="checkbox" name="showWorkingBox" label="Show Working Box" onClick={handleChange} 
                                        defaultChecked={formData.showWorkingBox} value="yes" />
                                    </Form.Group>                               
                                </div>
                                <div className="text-right mt-4">
                                    <Link to={'/admin/question-answer'} className="addLearner">Back</Link>&nbsp;
                                    {(props?.match?.params?.id) ?
                                        <Button variant="primary" className="addLearner" type="button" disabled={!submitted} onClick={deleteQuestion} >
                                            Delete                                       
                                        </Button>:''
                                    }
                                        &nbsp;
                                    <Button variant="primary" className="addLearner" type="submit" disabled={!submitted}>
                                        {(props?.match?.params?.id) ? 'UPDATE' : 'ADD'}
                                        {!submitted && (
                                            <span className="login_spinner"><i className="fa fa-spinner fa-spin"></i></span>
                                        )}
                                    </Button>
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
                        <Button onClick={()=>onCropped(previewCanvasRef.current, completedCrop)}>Save</Button>
                        
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="crop-container">

                        {/* <ImageCropper
                            getBlob={getBlob}
                            inputImg={imageData?.image_name?.content}
                        /> */}

                        {/* <ReactImageCropper
                            getBlob={getBlob}
                            inputImg={imageData?.image_name?.content} 
                        /> */}


                        {/* <ReactCrop
                            src={upImg}
                            onImageLoaded={onLoad}
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                        /> */}
                        <ReactCrop
                            src={upImg}
                            onImageLoaded={onLoad}
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                        /> 
                        <div>
                            <canvas className="hide"
                            ref={previewCanvasRef}
                            // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                            style={{
                                width: Math.round(completedCrop?.width ?? 0),
                                height: Math.round(completedCrop?.height ?? 0)
                            }}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    
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

            <Modal size="lg" className="questionModal" show={showQuestion} onHide={handleQuestionClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Main Question</Modal.Title>
                </Modal.Header>
                <Modal.Body>                   
                    <Form.Row>
                        <Form.Group as={Col} controlId="formLevels">
                            <Form.Control as="select" value={formData.primary_question_id} name="primary_question_id" required className="" onChange={handleChangePrimaryQuestion}>
                                <option value="">Question</option>
                                {
                                    allQuestionDropdown && allQuestionDropdown.map((question, index) => {
                                        return <option key={index} value={question.id}>{question.question_name} </option>;
                                    })
                                }
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    {(modalPLoader)?<CustomLoader />:             
                    <Form.Row>
                        {(primaryQuestion.question_description)?
                            <Form.Group as={Col}>
                                <MathJax math={String.raw`${primaryQuestion.question_description}`} />
                            </Form.Group>
                        :''}
                        
                        <Form.Group as={Col}>
                        {(function() {
                            if (primaryQuestion?.file_type=='image') {
                                return <img src={primaryQuestion?.file_data?.file_url} alt="" />;
                            } else if(primaryQuestion?.file_type=='audio') {
                                return <audio className="uploadBtnsImg h-40" src={primaryQuestion?.file_data?.file_url} controls />;
                            } else if(primaryQuestion?.file_type=='video') {
                                return <ReactPlayer controls width="500px" height="220px" url={primaryQuestion?.file_data?.file_url} />;
                            } else if(primaryQuestion?.file_type=='file') {
                                return <p className="pdfDownload" onClick={()=> window.open(primaryQuestion?.file_data?.file_url, "_blank")}>Preview File</p>;
                            }
                        })()}
                        </Form.Group>
                    </Form.Row>
                    }
                    {(props?.match?.params?.id?
                        <Button variant="primary" className="addLearner" type="button" onClick={handleSaveSubQuestion}>
                        Save Question
                        </Button>
                        :''
                        )}
                        
                </Modal.Body>
                <Modal.Footer>
                    
                </Modal.Footer>
            </Modal>

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
                        questionId={questionId}
                        questionAxiosUrl={'saveQuestionRecording'}
                        parentCallback = {callbackFunction}
                    />
                </Modal.Body>
            </Modal>
        </div>

    )
}
export default withRouter(QuestionAnswerAdd);