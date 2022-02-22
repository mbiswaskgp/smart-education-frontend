import React, { useState } from "react";
import { Link } from "react-router-dom";


import SubjetcService from "../../../../services/SubjetcService";

const SubjectForm = () => {
    const initialSubjectState = {
        subject_name: ""        
    };
    const [subject, setSubject]     = useState(initialSubjectState);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError]         = useState("");

    const onChangeName = (e) => {
        const { name, value } = e.target;
        setSubject({ ...subject, [name]: value });
    };

    const handleSubject = (e) => {
        e.preventDefault();
        var data = {
            name: subject.subject_name,
        };

        if(data.name==""){
            const errors = "This field is required";
            setError(errors); 
        }else{
            setError(""); 
            SubjetcService.create(data)
            .then(response => {
                setSubmitted(true);
                console.log(response);
                setSubject(initialSubjectState);
            })
            .catch(e => {
                console.log(e);
            });
        }

        console.log(error);
    }
    return (
        <div className="row justify-content-center">
            <div className="col-md-9 col-12">
                <div className="d-flex justify-content-center">
                    <div className="w-50">
                    {submitted ? (
                        <div>
                            <h4>Subject save successfully!</h4>                       
                        </div>
                    ) : ''}
                        <form onSubmit={handleSubject}>
                            <div className="greenHeading">
                                {'Add'} subject
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control textAra" value={subject.subject_name} name="subject_name" placeholder="Enter subject name" onChange={onChangeName} />
                                <span className="errorMsg"> {error}</span> 
                            </div>
                            <div className="text-right">
                                <button className="addLearner">Save</button>&nbsp; 
                                <Link to="/admin/subject" className="backBtn">Back</Link>
                            </div>
                        </form>
                    </div>
                    
                </div>
            </div>   
      </div>
    );
};

export default SubjectForm;