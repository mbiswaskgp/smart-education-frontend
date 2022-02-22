import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select, { components } from 'react-select';
import { useDispatch } from "react-redux";

import CommonService from "../../../../services/CommonService";
import { changeCurrentPage } from "../../../../store/actions/nav";
import CustomLoader from "../../../Common/CustomLoader";

import { toast } from 'react-toastify';

const AssignLearner = (props) => {
    const dispatch                            = useDispatch();
    const [allLearners, setAllLearners]       = useState([]);
    const [learners, setLearners]             = useState([]);
    const [tutor, setTutor]                   = useState([]);
    const [loading, setLoading]               = useState(false);
    const [defaultLearner, setDefaultLearner] = useState([]);  
    const [isDisabled, setIsDisabled]         = useState(false);
    
    var tutorId=props.match.params.id;
    
    useEffect(() => {
        setLoading(true);
        getAllLearners();  
        getSelectedLearner(props.match.params.id);
        dispatch(changeCurrentPage('adminTutor'));
    },[props.match.params.id]);

    const getAllLearners = () => {
        CommonService.getAll('tutor/alllearners')
        .then(response => {
            //console.log(response.data.data.allLearners.data);
            setAllLearners(response.data.data.allLearners.data);
            
                        
        })
        .catch(e => {
            console.log(e);
        });
    }

    const getSelectedLearner = (id) => {
        CommonService.getById('tutor/assigne-tutor-learner',id)
        .then(response => {
            //console.log(response.data.data.returnData.allLearners.data);
            setAllLearners(response.data.data.returnData.allLearners.data); 
            setDefaultLearner(response.data.data.returnData.allSelectedLearners.data);   

            console.log(response.data.data.returnData);
                
            var tutors = {
                fname: response.data.data.returnData.tutor.fname,
                lname: response.data.data.returnData.tutor.lname
            }
            setTutor(tutors);
            setLoading(false);                
        })
        .catch(e => {
            console.log(e);
        });
    }

    const handleChange = selectedOption => {
        if(selectedOption===null){
            setLearners([]);
        }else{
            setLearners(selectedOption);
        }      
    }
    const handleSubmitAssignedLearner = (e) => {
        e.preventDefault();
        if(learners.length==0){
            toast.error('Please enter Learner');
        }else{
            setIsDisabled(true);
            var data = {
                learner: learners
            }
            CommonService.update('tutors/updateAssignLearner', props.match.params.id, data)
            .then(response => {
                if(response.data.success){
                    if(response.data.message==='validation_failed'){
                        toast.error('The learner field is required.');
                    }else{
                        toast.success(response.data.message);
                    }
                }
                setIsDisabled(false);
            })
            .catch(e => {
                setIsDisabled(false);
                toast.error(e.message);
            });
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
                            {tutor.fname+ ' '+ tutor.lname}
                        </h2>
                        <div className="assignTutor">
                            <h2>ASSIGN LEARNER to tutor </h2>
                            <div className="form-group">

                                <Select
                                    isMulti
                                    name="learner_id"
                                    options={allLearners}
                                    defaultValue={defaultLearner}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="text-right">                        
                            <button className="addLearner mr-2" disabled={isDisabled}>Save LEARNER</button>
                            <Link to={'/admin/tutor/assign-learner-list/'+tutorId} className="backBtn">Back</Link>
                        </div>
                        </div>                    
                    </div> 
                </form>
            }         
            </div>   
        </div> 

    );
};

export default AssignLearner;