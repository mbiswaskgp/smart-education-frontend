import React, { useState, useEffect } from "react";
import Select, { components } from 'react-select';
import { Link  } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useDispatch } from "react-redux";

import "react-datepicker/dist/react-datepicker.css";
import { changeCurrentPage } from "../../../../store/actions/nav";
import { Multiselect } from 'multiselect-react-dropdown';
import CommonService from "../../../../services/CommonService";
import validate from "../../../../Validator";

import { toast } from 'react-toastify';

function LearnerAdd() {
    const initialLearnerState = {
        fname: "",
        lname: "",
        learner_email: "",
        parent_email: "",
        contact_number: "",
        level_id: {},
        learning_center: '',
        parent_name: "",
        dob: "",
        note: "",
        centre_id: ""
    };
    const dispatch                  = useDispatch();
    const [learner, setLearner]     = useState(initialLearnerState);
    const [loader, setLoader]       = useState(false);
    const [error, setError]         = useState(false);
    const [selectLoading, setSelectLoading] = useState(false);

    const [allCentres, setAllCentres] = useState();
    const [selectedOption, setSelectedOption] = useState(null);  
    const [allTutors, setAllTutors] = useState([]);    
    
    const [allLevels, setAllLevels] = useState();
    const [message, setMessage]     = useState();
    const [startDate, setStartDate] = useState('');

    const [selectedValue, setSelectedValue] = useState([]);

    useEffect(() => {
        getAllCentre();
        getAlllevel();
        getAllTutor();
        dispatch(changeCurrentPage('adminLearner'));
    },[]);

    const getAllCentre = () => {
        CommonService.getAll('centres')
        .then(response => {
            setAllCentres(response.data.data.centres.data);                
        })
        .catch(e => {
            console.log(e);
        });
    }
    const getAllTutor = () => {
        CommonService.getAll('dropdownAllActiveTutors')
        .then(response => {
            console.log(response.data.data.tutors.data);
            setAllTutors(response.data.data.tutors.data);                
        })
        .catch(e => {
            console.log(e);
        });
    }

    const getAlllevel = () => {
        CommonService.getAll('levels')
        .then(response => {
            setAllLevels(response.data.data.levels);
        })
        .catch(e => {
            console.log(e);
        });
    }

    const handleInputChange = event => {
        const { name, value } = event.target;
        setLearner({ ...learner, [name]: value });
    };
    const handleCentreChange = event => {
        setSelectedOption(event);
        const { value } = event;
        setLearner({ ...learner, ['centre_id']: value });
    };
    const handleLevelMultiselectChange = (selectedList) => {
        setLearner({ ...learner, 'level_id': selectedList });
    }
    const removeLevelMultiselectChange = (selectedList) => {
        setLearner({ ...learner, 'level_id': selectedList });
    }
    const handleTutorMultiselectChange = (selectedList) => {
        setLearner({ ...learner, 'tutor_id': selectedList });
    }
    const removeTutorMultiselectChange = (selectedList) => {
        setLearner({ ...learner, 'tutor_id': selectedList });
    }
    const handleDateChange = event =>{
        setStartDate(event);
        setLearner({ ...learner, 'dob': event });
    }

    const handleSubmitLearner = (e) => {
        e.preventDefault();
        setLoader(true);
        const { isValid, errors } = validate.createLearnerValidate(learner);
        //console.log(errors); 
    
        if (isValid) {
            setError("");
            CommonService.create('learners',learner)
            .then(response => {
                setLoader(false);
                if(response.data.success){
                    if(response.data.message==='validation_failed'){
                        var validationError = response.data.data[0];
                        //console.log(validationError);
                        setError(validationError);
                    }else if(response.data.message==='email_send_fail'){
                        var validationError = response.data.data[0];
                        //setMessage('Email send failed');
                        toast.error('Email send failed');
                    }else{
                        toast.success('Learner created successfully');
                        //setMessage('Learner created successfully');
                        setStartDate('');
                        setLearner(initialLearnerState);
                        setSelectedValue([]);
                    }                   
                }
            })
            .catch(e => {
                setLoader(false);
                console.log(e.message);
            });
        }else{
            setLoader(false);
            setError(errors);
        }
    }

    return (
        <div className="learner_title">
            <div className="col-lg-12">
                <div className="register-form">
                    
                    <div>
                        <h5>{message}</h5>                       
                    </div>                    
                    <form onSubmit={handleSubmitLearner} className="w-100">
                    <div className="greenHeading">
                        Register new Learner                        
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control textAra" placeholder="Firstname" name="fname" value={learner.fname} onChange={handleInputChange} />
                        <span className="errorMsg">{error && error.fname}</span> 
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control textAra" placeholder="Lastname" name="lname" value={learner.lname} onChange={handleInputChange} />
                        <span className="errorMsg">{error && error.lname}</span>
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control textAra" placeholder="Learner Email" name="learner_email" value={learner.learner_email} onChange={handleInputChange} />
                        <span className="errorMsg">{error && error.learner_email}</span>
                    </div> 
                    <div className="form-group">
                        <input type="text" className="form-control textAra" placeholder="Parent Email" name="parent_email" value={learner.parent_email} onChange={handleInputChange} />
                        <span className="errorMsg">{error && error.parent_email}</span>
                    </div> 
                    <div className="form-group">
                        <input type="text" className="form-control textAra" placeholder="Telephone" name="contact_number" value={learner.contact_number} onChange={handleInputChange} />
                        <span className="errorMsg">{error && error.contact_number}</span>
                    </div>       
                    <div className="form-group mult-slct-border">
                        <Multiselect
                            name="level_id"
                            id="level_id"
                            placeholder="Year/Level"
                            options={allLevels}
                            displayValue="name"
                            onSelect={handleLevelMultiselectChange}
                            onRemove={removeLevelMultiselectChange}
                            selectionLimit="1"
                            selectedValues={(learner.level_id)?learner.level_id:''}
                            loading={selectLoading}
                        />
                        <span className="errorMsg">{error && error.level_id}</span>
                    </div> 
                    <div className="form-group mult-slct-border">
                        <Multiselect
                            name="tutor_id"
                            id="tutor_id"
                            placeholder="Select Tutor"
                            options={allTutors}
                            displayValue="label"
                            onSelect={handleTutorMultiselectChange}
                            onRemove={removeTutorMultiselectChange}
                            selectedValues={''}
                            loading={selectLoading}
                            closeOnSelect={false}
                        />
                        <span className="errorMsg">{error && error.tutor_id}</span>
                    </div> 
                    {/* <div className="form-group">
                        <input type="text" className="form-control textAra" placeholder="Learning Centre" name="learning_center" value={learner.learning_center} onChange={handleInputChange} />
                    </div> */}
                    <div className="form-group">
                        <Select
                            name="centre_id"
                            options={allCentres}         
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Select Centre"
                            onChange={handleCentreChange}
                            value={selectedOption}                             
                        />
                        <span className="errorMsg">{error && error.centre_id}</span>
                    </div>
                    
                    <div className="form-group">
                        <input type="text" className="form-control textAra" placeholder="Parent/guardian name" name="parent_name" value={learner.parent_name} onChange={handleInputChange} />
                        <span className="errorMsg">{error && error.parent_name}</span>
                    </div> 
                    <div className="form-group dtpikerBox">
                        <DatePicker placeholderText="Enter your dob"
                            className="form-control textAra" 
                            selected={startDate} 
                            maxDate={new Date()}
                            onChange={handleDateChange} 
                            showYearDropdown={true}    
                            dateFormat="dd/MM/yyyy"                    
                        />                        
                    </div>          
                    <div className="form-group">
                        <textarea name="note" cols="30" rows="5" className="form-control textAra" placeholder="Notes" onChange={handleInputChange} value={learner.note}></textarea>
                    </div>
                    <div className="text-right">
                        <Link to={'/admin/learner'} className="addLearner">Back</Link>&nbsp;
                        <button className="addLearner" >ADD LEARNER</button>
                        
                    </div>
                    </form>
                </div>            
            </div>
        </div>
    );
}

export default LearnerAdd;