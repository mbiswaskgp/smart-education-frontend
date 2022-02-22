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

function LearnerAssignAssessment(props) {
    const dispatch                            = useDispatch();
    const [allAssessments, setAllAssessments] = useState([]);
    const [learner, setLearner]               = useState([]);
    const [learnerAssessment, setLearnerAssessment] = useState([]);
    const [loading, setLoading]               = useState(false);
    const [errors, setErrors]                 = useState([]);  
    const [isDisabled, setIsDisabled]         = useState(false);
    const [startDate, setStartDate]           = useState('');
    const [endDate, setEndDate]               = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedAssessmentOption, setSelectedAssessmentOption] = useState(null);
    const [learnerView, setLearnerView]       = useState(null);
    const [selectedOption2, setSelectedOption2] = useState(null);
    var learnerId=props.match.params.id;

    useEffect(() => {
        //console.log(learnerId);
        setLoading(true);
        
        getAllAssessments();
        getLearnerData(props.match.params.id);
        dispatch(changeCurrentPage('adminLearnerAssessment'));
    },[props.match.params.id]);

    const getAllAssessments = () => {
        CommonService.getAll('allAssessment')
        .then(response => {
            setLoading(false);
            //console.log(response.data.data.assessments.data);
            setAllAssessments(response.data.data.assessments.data);
        })
        .catch(e => {
            toast.error(e,{autoClose: false}); 
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
            toast.error(e,{autoClose: false}); 
        });
        //console.log(learnerAssessment);
    }
 
    const handleInputChange = event => {
        
        const { name, value } = event.target;
        setLearnerAssessment({ ...learnerAssessment, [name]: value });

        // console.log(learnerAssessment);
    };
    
    const handleSubmitAssignedLearner = (e) => {
        e.preventDefault();
        console.log(learnerAssessment);
        let assignData = {
            user_id:learnerId, 
            tutor_id: '99999',
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
            let reassignData = {
                user_id:learnerId, 
                assessment_id: (learnerAssessment.assessment_id)?learnerAssessment.assessment_id:'',
                start_date: startDate,
                end_date: endDate,
                title: learnerAssessment.title,
                schedule_assessment: learnerAssessment.schedule_assessment,
                //learner_can_view: learnerAssessment.learner_can_view,
            }
            setErrors([]);
            CommonService.create('tutorLearnerAssessment',assignData)
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
                toast.error(e.message);
                //console.log(e.message);
            });
        }else{
            setErrors(errors);
            setLoading(false);
        }        
    }

    const handleAssessmentSchedulesChange = selectedOption => {
        //console.log(selectedOption);
        setSelectedOption2(selectedOption);
        const { level, value } = selectedOption;
        setLearnerAssessment({ ...learnerAssessment, ['schedule_assessment']: value });

        ///console.log(learnerAssessment);
    };
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
                                <Link to={'/tutor/learner'} className="backBtn">Back</Link>
                        </div>
                        </div>                    
                    </div> 
                </form>
            }         
            </div>   
        </div> 
    );
}

export default LearnerAssignAssessment;