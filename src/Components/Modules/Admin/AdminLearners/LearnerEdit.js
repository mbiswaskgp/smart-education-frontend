import React, { useState, useEffect } from "react";
import Select, { components } from 'react-select';
import { Link  } from "react-router-dom";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";

import { Multiselect } from 'multiselect-react-dropdown';
import CommonService from "../../../../services/CommonService";
import validate from "../../../../Validator";
import { changeCurrentPage } from "../../../../store/actions/nav";
import CustomLoader from "../../../Common/CustomLoader";

import { toast } from 'react-toastify';

function LearnerEdit(props) {

    const initialLearnerState = {
        fname: "",
        lname: "",
        email: "",
        learner_email: "",
        parent_email: "",
        contact_number: "",
        level_id: {},
        centre_id: "",
        parent_name: "",
        dob: "",
    };
    const dispatch                              = useDispatch();
    const [learner, setLearner]                 = useState(initialLearnerState);
    const [loader, setLoader]                   = useState(false);
    const [error, setError]                     = useState({});
    const [allTutors, setAllTutors]             = useState([]);
    const [selectedTutors, setSelectedTutors]   = useState([]);
    const [selectLoading, setSelectLoading]     = useState(false);

    const [startDate, setStartDate]             = useState();
    const [allCentres, setAllCentres]           = useState();
    const [selectedOption, setSelectedOption]   = useState(null); 
    const [allLevels, setAllLevels]             = useState();
    const [message, setMessage]                 = useState();

    useEffect(() => {
        getAlllevel();
        getAllCentre();
        getAllTutor();
        getLearner(props.match.params.id);
        dispatch(changeCurrentPage('adminLearner'));
        //console.log(props.match.params.id);       
    },[props.match.params.id]);
    
    const getAllCentre = () => {
        CommonService.getAll('centres')
        .then(response => {
            setAllCentres(response.data.data.centres.data);
            console.log(response.data.data.centres.data);       
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
            //console.log(response.data.data);       
        })
        .catch(e => {
            console.log(e);
        });
    }

    const getLearner = (id) => {
        //e.preventDefault();
        setLoader(true);
        CommonService.getById('learners',id)
        .then(response => {
            //console.log(response);
            if(response.data.success){
                console.log(response.data.data);
                var learners = {
                    fname: response.data.data.learners?.fname,
                    lname: response.data.data.learners?.lname,
                    email: response.data.data.learners?.email,
                    learner_email: response.data.data.learners?.learner_email,
                    parent_email: response.data.data.learners?.parent_email,
                    username: response.data.data.learners.username,
                    contact_number: response.data.data.learners?.contact_number,
                    level_id: response.data.data.learners?.current_level_id,
                    centre_id: response.data.data.learners?.centre_id,
                    learning_center: response.data.data.learners?.learning_center,
                    parent_name: response.data.data.learners?.parent_name,
                    dob: (response.data.data.learners.dob!="")?new Date(response.data.data.learners.dob):'',
                    note: response.data.data.learners.note,
                    tutor_id: response.data.data.tutorData.data
                }
                
                setSelectedOption(response.data.data.centreData);
                console.log(response.data.data.tutorData.data);
                setSelectedTutors(response.data.data.tutorData.data);
                
                if(response.data.data.learners.dob!=""){
                    setStartDate(new Date(response.data.data.learners.dob));
                }else{
                    setStartDate();
                }
                
                setLearner(learners);
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
       
    const handleInputChange = event => {
        const { name, value } = event.target;
        setLearner({ ...learner, [name]: value });
        //console.log(learner);
    };
    const handleCentreChange = event => {
        setSelectedOption(event);
        const { value } = event;      
        setLearner({ ...learner, ['centre_id']: value });
    };
    const handleDateChange = event =>{
        //console.log(event);
        setStartDate(event);
        setLearner({ ...learner, 'dob': event });
    }
    const handleLevelMultiselectChange = (selectedList, selectedItem) => {
        //console.log(selectedList);
        setLearner({ ...learner, 'level_id': selectedList });
    }
    const removeleLevelMultiselectChange = (selectedList, removedItem) => {
        //console.log(selectedList);
        setLearner({ ...learner, 'level_id': selectedList });
    }
    const handleTutorMultiselectChange = (selectedList) => {
        setLearner({ ...learner, 'tutor_id': selectedList });
    }
    const removeTutorMultiselectChange = (selectedList) => {
        setLearner({ ...learner, 'tutor_id': selectedList });
    }
    
    // const getAllSubject = () => {
    //     SubjetcService.getAll()
    //     .then(response => {
    //         setSubjects(response.data.data.subjects);
    //         setLoader(false);
    //     })
    //     .catch(e => {
    //         console.log(e);
    //         setLoader(false);
    //     });
    // }

    const handleSubmitLearner = (e) => {
        e.preventDefault();
        console.log(learner);

        const { isValid, errors } = validate.createLearnerValidate(learner);
        //console.log(props.match.params.id);
        if (isValid) {
            setError("");
            CommonService.update('learners', props.match.params.id, learner)
            .then(response => {
                
                if(response.data.success){
                    if(response.data.message==='validation_failed'){
                        var validationError = response.data.data[0];
                        setError(validationError);
                        
                    }else if(response.data.message==='email_send_fail'){
                        var validationError = response.data.data[0];
                        //setError(validationError);
                        //setMessage('Email send failed');
                        toast.error('Email send failed');
                    }else{
                        //setMessage('Learner update successfully');
                        toast.success('Learner update successfully');
                        //setLearner(initialLearnerState);
                        //setSelected([]);
                    }                   
                }
            })
            .catch(e => {
                console.log(e.message);
            });
        }else{
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
                        {(loader)?
                            <CustomLoader />:
                        
                    <form onSubmit={handleSubmitLearner} className="w-100">
                    <div className="greenHeading">
                        Edit Learner                       
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
                        <input type="text" className="form-control textAra" placeholder="Username" name="email" value={learner.username} disabled />
                        <span className="errorMsg">{error && error.username}</span>
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
                            placeholder="Select Year/Level"
                            options={allLevels}
                            selectedValues = {learner.level_id}
                            displayValue="name"
                            onSelect={handleLevelMultiselectChange}
                            onRemove={removeleLevelMultiselectChange}
                            labelledBy={"Select"}
                            selectionLimit="1"
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
                            selectedValues={selectedTutors}
                            loading={selectLoading}
                            closeOnSelect={false}
                        />
                        <span className="errorMsg">{error && error.tutor_id}</span>
                    </div>
                    {/* <div className="form-group">
                        <input type="text" className="form-control textAra" placeholder="Learning Centre" name="learning_center" value={(learner.learning_center)?learner.learning_center:''} onChange={handleInputChange} />
                    </div>         */}
                    <div className="form-group">
                        <Select
                            name="centre_id"
                            options={allCentres}         
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Select Centre"
                            onChange={handleCentreChange}
                            value={selectedOption}  
                            defaultValue={3}
                        />
                        <span className="errorMsg">{error && error.centre_id}</span>
                    </div> 
                    <div className="form-group">
                        <input type="text" className="form-control textAra" placeholder="Parent/guardian name" name="parent_name" value={learner.parent_name} onChange={handleInputChange} />
                        <span className="errorMsg">{error && error.parent_name}</span>
                    </div>
                    <div className="form-group dtpikerBox">
                        <DatePicker 
                        className="form-control textAra" 
                        selected={startDate} 
                        onChange={handleDateChange} 
                        maxDate={new Date()}
                        placeholderText="Enter your dob"
                        showYearDropdown={true}
                        dateFormat="dd/MM/yyyy"
                        />                        
                    </div> 
                    <div className="form-group">
                        <textarea name="note" cols="30" rows="5" className="form-control textAra" placeholder="Notes" value={learner.note} onChange={handleInputChange} />
                    </div>
                    <div className="text-right">
                        <Link to={'/admin/learner'} className="addLearner">Back</Link>&nbsp;
                        <button className="addLearner">Save LEARNER</button>
                    </div>
                    </form>
                    }
                </div>            
            </div>
        </div>
    );
}

export default LearnerEdit;