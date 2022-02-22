import React, { useState, useEffect } from "react";
import Select, { components } from 'react-select';
import { Link  } from "react-router-dom";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";

import CommonService from "../../../../services/CommonService";
import validate from "../../../../Validator";
import { changeCurrentPage } from "../../../../store/actions/nav";
import CustomLoader from "../../../Common/CustomLoader";

import { toast } from 'react-toastify';

const LearnerAddMarks = (props) => {
    
    const initialLearnerState = {
        tutor_id: "",
        assessment_id: "",
        start_date: "",
        end_date: "",
        total_obtained_marks: "",
        show_in_graph: "yes",
    };

    const dispatch                      = useDispatch();
    const [formData, setFormData]       = useState(initialLearnerState);
    const [learner, setLearner]         = useState([]);
    const [allAssessments, setAllAssessments] = useState([]);
    const [allTutors, setAllTutors]     = useState([]);

    const [loader, setLoader]           = useState(false);
    const [errors, setErrors]           = useState([]);  
    const [startDate, setStartDate]     = useState('');
    const [endDate, setEndDate]         = useState('');

    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedAssessmentOption, setSelectedAssessmentOption] = useState(null);

    useEffect(() => {
        getLearner(props.match.params.id);
        getAssessmentsTutors(props.match.params.id);
        dispatch(changeCurrentPage('adminLearner'));
        //console.log(props.match.params.id);       
    },[props.match.params.id]);

    const getLearner = (id) => {
        //e.preventDefault();
        setLoader(true);
        CommonService.getById('learners',id)
        .then(response => {
            //console.log(response);
            if(response.data.success){
                console.log(response.data.data.learners);
                setLearner(response.data.data.learners);
                setLoader(false);
            }else{
                //setMessage('Record not found');
                toast.error('Record not found');
                setLoader(false);
            }
        })
        .catch(e => {
            console.log(e);
            setLoader(false);
        });
    }

    const getAssessmentsTutors = (id) => {
        //e.preventDefault();
        
        CommonService.getById('admin-learnerAssessmentsTutors',id)
        .then(response => {
            //console.log(response);
            if(response.data.success){
                console.log(response.data.data);
                setAllAssessments(response.data.data.assessments.data);
                setAllTutors(response.data.data.tutors.data);
                
            }else{
                //setMessage('Record not found');
                toast.error('Record not found');
                setLoader(false);
            }
        })
        .catch(e => {
            console.log(e);
            setLoader(false);
        });
    }
       
    const handleSubmitLearner = (e) => {
        e.preventDefault();
       
        const { isValid, errors } = validate.createLearnerMarkValidate(formData);
        //console.log(props.match.params.id);
        if (isValid) {
            setErrors("");
            CommonService.updatePost('learnersAssessmentMarksAdd', props.match.params.id, formData)
            .then(response => {
                if(response.data.success){
                    toast.success('Learner Learner Assessment marks inserted successfully'); 
                }
            })
            .catch(e => {
                console.log(e.message);
            });
        }else{
            setErrors(errors);
        }
    }
    const handleTutorChange = selectedOption => {
        setSelectedOption(selectedOption);
        const { level, value } = selectedOption;
        setFormData({ ...formData, ['tutor_id']: value });
    };
    const handleAssessmentChange = selectedAssessmentOption => {
        setSelectedAssessmentOption(selectedAssessmentOption);
        const { level, value } = selectedAssessmentOption;
        setFormData({ ...formData, ['assessment_id']: value });
    }
    const handleInputChange = event => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        //console.log(learner);
    };
    const handleInputChangeStartDate = (data1) => {
        setStartDate(data1);
        setFormData({ ...formData, ['start_date']: data1 });
    }
    const handleInputChangeEndDate = (data1) => {
        setEndDate(data1);
        setFormData({ ...formData, ['end_date']: data1 });
    }
    
    return (
        <div className="learner_title">
            <div className="col-lg-12">
                <div className="register-form">
                    
                    {(loader)?
                        <CustomLoader />:
                        
                    <form onSubmit={handleSubmitLearner} className="w-100">
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
                            onChange={date => handleInputChangeStartDate(date)}
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
                            onChange={date => handleInputChangeEndDate(date)}
                            minDate={startDate}
                            dateFormat="dd/MM/yyyy"
                            autoComplete="off"
                        />
                        <span className="errorMsg">{errors && errors.end_date}</span>
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control textAra" placeholder="Total Obtained Marks" name="total_obtained_marks" value={formData.total_obtained_marks} onChange={handleInputChange} />
                        <span className="errorMsg">{errors && errors.total_obtained_marks}</span>
                    </div>
                    <div className="form-group">
                        <select onChange={handleInputChange} value={formData.show_in_graph} name="show_in_graph" id="show_in_graph" className="form-control textAra" >
                            <option value="yes">Show In Graph</option>
                            <option value="no">Don't Show In Graph</option>
                        </select>
                        <span className="errorMsg">{errors && errors.show_in_graph}</span>
                    </div>
                    <div className="text-right">
                        <Link to={'/admin/learner'} className="addLearner">Back</Link>&nbsp;
                        <button className="addLearner">Save Marks</button>
                    </div>
                    </form>
                    }
                </div>            
            </div>
        </div>
    );
};

export default LearnerAddMarks;