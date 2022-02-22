import React, { useState, useEffect } from "react";
import { Link  } from "react-router-dom";
import { useDispatch } from "react-redux";
import Select from 'react-select';
import { toast } from 'react-toastify';

import { Multiselect } from 'multiselect-react-dropdown';
import CommonService from "../../../../services/CommonService";
import validate from "../../../../Validator";
import { changeCurrentPage } from "../../../../store/actions/nav";

import CustomLoader from "../../../Common/CustomLoader";

function TutorEdit(props) {
    const dispatch          = useDispatch();
    const initialTutorState = {
        fname: "",
        lname: "",
        email: "",
        contact_number: "",
        subject_id: {},
        level_id: {},
        learning_center_id: "",
    };
    const [tutor, setTutor] = useState(initialTutorState);
    const [currentTutor, setCurrentTutor] = useState(initialTutorState);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);

    const [allSubjects, setAllSubjects] = useState();
    const [allCentres, setAllCentres]           = useState();
    const [allLevels, setAllLevels] = useState();
    const [message, setMessage] = useState();
    const [selectedOption, setSelectedOption]   = useState({}); 
    const [selected, setSelected] = useState([]);
    const [loader, setLoader] = useState([]);

    useEffect(() => {
        getAllSubject();
        getAlllevel();
        getAllCentre();
        getTutor(props.match.params.id);
        dispatch(changeCurrentPage('adminTutor'));        
    },[props.match.params.id]);

    const getTutor = (id) => {
        //e.preventDefault();
        CommonService.getById('tutors',id)
        .then(response => {
            if(response.data.success){
                console.log(response.data.data);
                var tutors = {
                    fname: response.data.data.tutors.fname,
                    lname: response.data.data.tutors.lname,
                    email: response.data.data.tutors.email,
                    contact_number: response.data.data.tutors.contact_number,
                    subject_id: response.data.data.tutors.tutor_subjects,
                    level_id: response.data.data.tutors.tutor_levels,
                    learning_center_id: response.data.data.tutors.learning_center_id,
                    note: response.data.data.tutors.note,
                }
                setSelectedOption(response.data.data.centreData);
                setTutor(tutors);
                setLoader(false);
            }else{
                setMessage('Record not found');
                
                setLoader(false);
            }
        })
        .catch(e => {
            console.log(e);
            setLoader(false);
        });
    }
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

    const handleInputChange = event => {
        const { name, value } = event.target;
        setTutor({ ...tutor, [name]: value });
        //console.log(tutor);
    };
    const handleSubjectMultiselectChange = (selectedList, selectedItem) => {
        console.log(selectedList);
        setTutor({ ...tutor, 'subject_id': selectedList });
        console.log(tutor);
        
    }
    const removeSubjectMultiselectChange = (selectedList, removedItem) => {
        console.log(selectedList);
        setTutor({ ...tutor, 'subject_id': selectedList });
        console.log(tutor);
    }
    const handleLevelMultiselectChange = (selectedList, selectedItem) => {
        console.log(selectedList);
        setTutor({ ...tutor, 'level_id': selectedList });
    }
    const removeleLevelMultiselectChange = (selectedList, removedItem) => {
        console.log(selectedList);
        setTutor({ ...tutor, 'level_id': selectedList });
    }
    const handleCentreChange = event => {
        setSelectedOption(event);
        const { value } = event;      
        setTutor({ ...tutor, ['learning_center_id']: value });
    };
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

    const handleSubmitTutor = (e) => {
        e.preventDefault();
        console.log(tutor);

        const { isValid, errors } = validate.createTutorValidate(tutor);
        console.log(props.match.params.id);
        if (isValid) {
            setError("");
            CommonService.update('tutors', props.match.params.id, tutor)
            .then(response => {
                console.log(response.data);
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
                        //setMessage('Tutor update successfully');
                        toast.success(response.data.message);
                        //setTutor(initialTutorState);
                        //setSelected([]);
                    }                   
                }else{
                    toast.error(response.data.message);
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
            <div className="col-lg-12 ">
                <div className="register-form">
                    
                        <div>
                            <h5>{message}</h5>                       
                        </div>
                        {(loader)?
                            <CustomLoader />:
                        
                    <form onSubmit={handleSubmitTutor} className="w-100">
                    <div className="greenHeading">
                        Edit Tutor                       
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control textAra" placeholder="Firstname" name="fname" value={tutor.fname} onChange={handleInputChange} />
                        <span className="errorMsg">{error && error.fname}</span> 
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control textAra" placeholder="Lastname" name="lname" value={tutor.lname} onChange={handleInputChange} />
                        <span className="errorMsg">{error && error.lname}</span>
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control textAra" placeholder="Email" name="email" value={tutor.email} onChange={handleInputChange} />
                        <span className="errorMsg">{error && error.email}</span>
                    </div> 
                     <div className="form-group">
                        <input type="text" className="form-control textAra" placeholder="Telephone" name="contact_number" value={tutor.contact_number} onChange={handleInputChange} />
                        <span className="errorMsg">{error && error.contact_number}</span>
                    </div>                 
                    <div className="form-group mult-slct-border">
                        <Multiselect
                            name="subject_id"
                            id="subject_id"
                            placeholder="Select Subject"
                            options={allSubjects}
                            selectedValues = {tutor.subject_id}
                            displayValue="name"
                            onSelect={handleSubjectMultiselectChange}
                            onRemove={removeSubjectMultiselectChange}
                        />
                        <span className="errorMsg">{error && error.subject_id}</span>
                    </div>  
                    <div className="form-group mult-slct-border">
                        <Multiselect
                            name="level_id"
                            id="level_id"
                            placeholder="Select Year/Level"
                            options={allLevels}
                            selectedValues = {tutor.level_id}
                            displayValue="name"
                            onSelect={handleLevelMultiselectChange}
                            onRemove={removeleLevelMultiselectChange}
                            labelledBy={"Select"}
                        />
                        <span className="errorMsg">{error && error.level_id}</span>
                    </div>        
                    <div className="form-group">
                        <Select
                            name="learning_center_id"
                            options={allCentres}         
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Select Centre"
                            onChange={handleCentreChange}
                            value={selectedOption}  
                            defaultValue={tutor.learning_center_id}
                        />
                        <span className="errorMsg">{error && error.learning_center}</span>
                    </div> 
                    
                    <div className="form-group">
                        <textarea name="note" cols="30" rows="5" className="form-control textAra" placeholder="Notes" onChange={handleInputChange} defaultValue={tutor.note}></textarea>
                    </div>
                    <div className="text-right">                        
                        <button className="addLearner mr-2">Save Tutor</button>
                        <Link to={'/admin/tutor'} className="backBtn">Back</Link>
                    </div>
                    </form>
                    }
                </div>            
            </div>
        </div>
    );
}

export default TutorEdit;