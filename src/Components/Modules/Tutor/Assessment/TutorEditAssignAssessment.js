import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select, { components } from 'react-select';
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";

import CommonService from "../../../../services/CommonService";
import { changeCurrentPage } from "../../../../store/actions/nav";
import CustomLoader from "../../../Common/CustomLoader";
import validate from "../../../../Validator";

import { toast } from 'react-toastify';

const learnerViewOptions = [
    { value: '', label: '' },
    { value: 'no', label: 'No' },
    { value: 'yes', label: 'Yes' }
];

const TutorEditAssignAssessment = (props) => {
    const dispatch                            = useDispatch();
    const [allAssessments, setAllAssessments] = useState([]);
    const [allTutors, setAllTutors]           = useState([]);
    
    const [learnerAssessment, setLearnerAssessment] = useState([]);
    const [loading, setLoading]               = useState(false);
    const [errors, setErrors]                 = useState([]);  
    const [isDisabled, setIsDisabled]         = useState(false);
    const [startDate, setStartDate]           = useState('');
    const [endDate, setEndDate]               = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    
    const [selectedAssessmentOption, setSelectedAssessmentOption] = useState(null);
    const [learnerView, setLearnerView]       = useState(null);
    const [learnerName, setLearnerName]       = useState('');
    
    var learnerId = props.match.params.learnerId;
    var learnerAssessmentId = props.match.params.learnerAssessmentId;
    useEffect(() => {

        setLoading(true);
        getAllTutors();
        getAllAssessments();
        if(props?.match?.params?.learnerAssessmentId){
            getAssessmentData(props.match.params.learnerAssessmentId);
        }        
        //getLearnerAssessment();
        dispatch(changeCurrentPage('tutorLearnerAssessment'));
    },[props.match.params.learnerAssessmentId]);

    const getAllTutors = () => {
        CommonService.getAll('allTutor')
        .then(response => {
            setLoading(false);
            //console.log(response.data.data.tutors.data);
            setAllTutors(response.data.data.tutors.data);
        })
        .catch(e => {
            toast.error(e,{autoClose: true}); 
            //console.log(e);
        });
    }

    const getAllAssessments = () => {
        CommonService.getAll('allAssessment')
        .then(response => {
            setLoading(false);
            //console.log(response.data.data.assessments.data);
            setAllAssessments(response.data.data.assessments.data);
        })
        .catch(e => {
            toast.error(e,{autoClose: true}); 
            //console.log(e);
        });
    }

    const getAssessmentData = (id) => {
        CommonService.getById('tutor-learnerAssessmentEdit', id)
        .then(response => {
            setLoading(false);
            console.log(response.data.data);
            let assessmentData = {
                title: response.data.data.assessmentData.title,
                tutor_id: response.data.data.assessmentData.tutor_user_id,
                assessment_id: response.data.data.assessmentData.assessment_id,
                active_end_datetime: response.data.data.assessmentData.active_end_datetime,
            }
            console.log(response.data.data.assessmentData);
            setLearnerAssessment(assessmentData);
            setSelectedOption(response.data.data.tutorData);
            setSelectedAssessmentOption(response.data.data.assessments);
            var date1 = new Date(response.data.data.assessmentData.active_start_datetime);
            var date2 = new Date(response.data.data.assessmentData.active_end_datetime);
            setStartDate(date1);
            setEndDate(date2);
            if(response.data.data.assessmentData.learner_can_view=='yes'){
                setLearnerView({ value: 'yes', label: 'Yes' });
            }else if(response.data.data.assessmentData.learner_can_view=='no'){
                setLearnerView({ value: 'no', label: 'No' });
            }
            setLearnerName(response.data.data.assessmentData.learner_user.fname+' '+response.data.data.assessmentData.learner_user.lname);
        })
        .catch(e => {
            toast.error(e,{autoClose: true}); 
            setLoading(false);
            //console.log(e);
        });
    }

    const handleAssessmentChange = selectedAssessmentOption => {
        setSelectedAssessmentOption(selectedAssessmentOption);
        const { level, value } = selectedAssessmentOption;
        setLearnerAssessment({ ...learnerAssessment, ['assessment_id']: value });
        console.log(`Option Assessment selected:`, selectedAssessmentOption);
        //console.log(learnerAssessment);
    }
    
    
    // const handleLearnerViewChange = learnerView => {
    //     //console.log(learnerView);
    //     setLearnerView(learnerView);
    //     const { level, value } = learnerView;
    //     setLearnerAssessment({ ...learnerAssessment, ['learner_can_view']: value });        
    // };
    const handleInputChange = event => {
        console.log(event);
        const { name, value } = event.target;
        setLearnerAssessment({ ...learnerAssessment, [name]: value });
    };
    
    // const getSelectedLearner = (id) => {
    //     CommonService.getById('tutor/assigne-tutor-learner',id)
    //     .then(response => {
    //         //console.log(response.data.data.returnData.allLearners.data);
    //         setAllLearners(response.data.data.returnData.allLearners.data); 
    //         setDefaultLearner(response.data.data.returnData.allSelectedLearners.data);   

    //         console.log(response.data.data.returnData);
                
    //         var tutors = {
    //             fname: response.data.data.returnData.tutor.fname,
    //             lname: response.data.data.returnData.tutor.lname
    //         }
    //         setTutor(tutors);
    //         setLoading(false);                
    //     })
    //     .catch(e => {
    //         console.log(e);
    //     });
    // }

    
    const handleSubmitAssignedLearner = (e) => {
        e.preventDefault();

        let assignData = {
            title:learnerAssessment.title, 
            user_id:learnerId, 
            assessment_id: (learnerAssessment.assessment_id)?learnerAssessment.assessment_id:'',
            start_date: startDate,
            end_date: endDate,

        }
      
        const { isValid, errors } = validate.tutorAssigneAssessmentLearnerValidate(assignData);
        console.log(assignData);
        if(isValid){
            setErrors([]);
            CommonService.updatePost('tutor-learnerAssessmentEdit', props.match.params.learnerAssessmentId, assignData)
            .then(response => {
                setLoading(false);
                if(response.data.success){
                    if(response.data.message==='validation_failed'){
                        var validationError = response.data.data[0];
                        setErrors(validationError);                        
                    }else{
                        //setMessage('Learner created successfully');
                        let initData =  {
                                            title:'',                                
                                        };
                                    
                        toast.success(response.data.message);                        
                    }                  
                }else{
                    toast.success(response.data.message); 
                } 
            })
            .catch(e => {
                setLoading(false);
                toast.error(e.message,{autoClose: true});
                //console.log(e.message);
            });
        }else{
            setErrors(errors);
            setLoading(false);
        }
        
    }

    return (
        <div className="row justify-content-center">
            <div className="col-lg-7">
            {(loading)?
                <CustomLoader />:
                <form onSubmit={handleSubmitAssignedLearner} className="w-100">
                    <div className="assign_as_a_tutor">
                    
                        <h2 className="mb-0">
                        </h2>
                        <div className="assignTutor">
                            <h2>ASSIGN Assessment &amp; TUTOR to {learnerName} </h2>
                            <div className="form-group">
                                <input type="text" className="form-control textAra" placeholder="Title" name="title" value={(learnerAssessment.title)?learnerAssessment.title:''} onChange={handleInputChange} />
                                <span className="errorMsg">{errors && errors.title}</span>
                            </div>
                            
                            <div className="form-group">
                                <Select
                                    name="assessment_id"
                                    options={allAssessments}      
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    placeholder="Select Assessment"
                                    onChange={handleAssessmentChange} 
                                    value={selectedAssessmentOption}
                                    defaultValue={selectedAssessmentOption} 
                                />
                                <span className="errorMsg">{errors && errors.assessment_id}</span>
                            </div>
                            <div className="form-group dtpikerBox">
                                <DatePicker
                                    name="start_date"
                                    placeholderText="Assessment Start Date"
                                    className="form-control textAra" 
                                    selected={startDate}
                                    onChange={date => setStartDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    maxDate={endDate}  
                                    autoComplete="off"    
                                    // disabled={true}                         
                                />
                                <span className="errorMsg">{errors && errors.start_date}</span>
                            </div>
                            
                            <div className="form-group dtpikerBox">
                                <DatePicker
                                    name="end_date"
                                    placeholderText="Assessment End Date"
                                    className="form-control textAra"
                                    selected={endDate}
                                    onChange={date => setEndDate(date)}                                   
                                    minDate={startDate}
                                    dateFormat="dd/MM/yyyy"
                                    autoComplete="off"
                                    // disabled={true} 
                                />
                                <span className="errorMsg">{errors && errors.end_date}</span>
                            </div>
                            
                            <div className="text-right">                        
                                <button className="addLearner mr-2" disabled={isDisabled}>Assign ASSESSMENT</button>
                                <Link to={'/tutor/learner/assessment-list/'+learnerId} className="backBtn">Back</Link>
                        </div>
                        </div>                    
                    </div> 
                </form>
            }         
            </div>   
        </div> 

    );
};

export default TutorEditAssignAssessment;