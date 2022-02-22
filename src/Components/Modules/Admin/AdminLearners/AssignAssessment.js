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

const assessmentSchedules = [
    { value: '', label: 'select Schedule Assessment' },
    { value: '4', label: '4 times in a year' },
    { value: '3', label: '3 times in a year' }
];

const AssignAssessment = (props) => {
    const dispatch                            = useDispatch();
    const [allAssessments, setAllAssessments] = useState([]);
    const [allTutors, setAllTutors]           = useState([]);
    const [learner, setLearner]                = useState([]);
    const [learnerAssessment, setLearnerAssessment] = useState([]);
    const [loading, setLoading]               = useState(false);
    const [errors, setErrors]                 = useState([]);  
    const [isDisabled, setIsDisabled]         = useState(false);
    const [startDate, setStartDate]           = useState('');
    const [endDate, setEndDate]               = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOption2, setSelectedOption2] = useState(null);
    const [selectedAssessmentOption, setSelectedAssessmentOption] = useState(null);
    const [learnerView, setLearnerView]       = useState(null);
    var learnerId=props.match.params.id;
    
    useEffect(() => {
        //console.log(learnerId);
        setLoading(true);
        getAllTutors();
        getAllAssessments();
        getLearnerData(props.match.params.id);
        dispatch(changeCurrentPage('adminLearnerAssessment'));
    },[props.match.params.id]);

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
    const handleAssessmentChange = selectedAssessmentOption => {
        setSelectedAssessmentOption(selectedAssessmentOption);
        const { level, value } = selectedAssessmentOption;
        setLearnerAssessment({ ...learnerAssessment, ['assessment_id']: value });
    }

    const getLearnerData = id => {
        
        CommonService.getById('learners',id)
        .then(response => {
            setLearner(response.data.data.learners);
            console.log(response.data.data.learners);
        })
        .catch(e => {
            toast.error(e,{autoClose: true}); 
        });
        //console.log(learnerAssessment);
    }
    
    const handleTutorChange = selectedOption => {
        setSelectedOption(selectedOption);
        const { level, value } = selectedOption;
        setLearnerAssessment({ ...learnerAssessment, ['tutor_id']: value });

        //console.log(learnerAssessment);
    };
    const handleAssessmentSchedulesChange = selectedOption => {
        console.log(selectedOption);
        setSelectedOption2(selectedOption);
        const { level, value } = selectedOption;
        setLearnerAssessment({ ...learnerAssessment, ['schedule_assessment']: value });

        console.log(learnerAssessment);
    };
    // const handleLearnerViewChange = learnerView => {
    //     //console.log(learnerView);
    //     setLearnerView(learnerView);
    //     const { level, value } = learnerView;
    //     setLearnerAssessment({ ...learnerAssessment, ['learner_can_view']: value });

    //     // console.log(learnerAssessment);
    // };
    const handleInputChange = event => {
        console.log(event);
        const { name, value } = event.target;
        setLearnerAssessment({ ...learnerAssessment, [name]: value });

        console.log(learnerAssessment);
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
        //console.log(learnerAssessment);
        let assignData = {
            user_id:learnerId, 
            tutor_id: (learnerAssessment.tutor_id)?learnerAssessment.tutor_id:'',
            assessment_id: (learnerAssessment.assessment_id)?learnerAssessment.assessment_id:'',
            start_date: startDate,
            end_date: endDate,
            title: learnerAssessment.title,
            schedule_assessment: learnerAssessment.schedule_assessment,
            //learner_can_view: learnerAssessment.learner_can_view,
        }
        console.log(assignData);
        const { isValid, errors } = validate.assigneAssessmentLearnerValidate(assignData);
        
        if(isValid){
            setErrors([]);
            CommonService.create('learnerAssessment',assignData)
            .then(response => {
                setLoading(false);
                if(response.data.success===true){
                    if(response.data.message==='validation_failed'){
                        var validationError = response.data.data[0];
                        setErrors(validationError);                        
                    }else{
                        //setMessage('Learner created successfully');
                        let initData =  {
                                            title: '',   
                                        };
                        setStartDate('');
                        setEndDate('');
                        setLearnerAssessment(initData);
                        setSelectedOption(null);   
                        setSelectedAssessmentOption(null); 
                        setLearnerView(null);             
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
                    
                        <h2 className="mb-0">{(learner && learner.fname)?learner.fname+' '+learner.lname:''}
                        </h2>
                        <div className="assignTutor">
                            <h2>ASSIGN Assessment &amp; TUTOR to LEARNER </h2>
                            <div className="form-group">
                                <input type="text" className="form-control textAra" placeholder="Title" name="title" value={(learnerAssessment.title)?learnerAssessment.title:''} onChange={handleInputChange}  />
                                <span className="errorMsg">{errors && errors.title}</span>
                            </div>
                            <div className="form-group">
                                <Select
                                    name="tutor_id"
                                    options={allTutors}         
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    placeholder="Select Tutor"
                                    onChange={handleTutorChange}
                                    value={selectedOption}  
                                />
                                <span className="errorMsg">{errors && errors.tutor_id}</span> 
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
                                />
                                <span className="errorMsg">{errors && errors.end_date}</span>
                            </div>
                            {/* <div className="form-group">                           
                                <Select
                                    name="learner_can_view"
                                    options={learnerViewOptions}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    placeholder="Select Learner View"
                                    onChange={handleLearnerViewChange}
                                    value={learnerView}
                                    
                                />
                                <span className="errorMsg">{errors && errors.learner_can_view}</span>                        
                            </div>  */}
                            <div className="form-group">
                                <Select
                                    name="schedule_assessment"
                                    options={assessmentSchedules}      
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    placeholder="Schedule Assessments"
                                    onChange={handleAssessmentSchedulesChange} 
                                    value={(selectedOption2)}
                                />
                                <span className="errorMsg">{errors && errors.schedule_assessment}</span>
                            </div>
                            
                            <div className="text-right">                        
                                <button className="addLearner mr-2" disabled={isDisabled}>Assign ASSESSMENT</button>
                                <Link to={'/admin/learner/assign-assessment-list/'+learnerId} className="backBtn">Back</Link>
                        </div>
                        </div>                    
                    </div> 
                </form>
            }         
            </div>   
        </div> 

    );
};

export default AssignAssessment;