import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import SubjetcService from "../../../../services/SubjetcService";

const SubjectEdit = (props) => {

    const initialSubjectState = {
        name: ""        
    };

    const [currentSubject, setCurrentSubject] = useState(initialSubjectState);
    const [message, setMessage] = useState("");
    const [error, setError]     = useState("");

    const getSubject = (id) => {
        //e.preventDefault();
        SubjetcService.getById(id)
        .then(response => {
            if(response.data.success){
                setCurrentSubject(response.data.data.subjects);
                console.log(response.data.success);
            }else{
                setMessage('Record not found');
            }
        })
        .catch(e => {
            console.log(e);
        });
    }

    useEffect(() => {
        getSubject(props.match.params.id);
        //console.log(props.match.params.id);       
    },[props.match.params.id]);

    const handleInputChange = event => {
        event.preventDefault();
        const { name, value } = event.target;
        setCurrentSubject({ ...currentSubject, [name]: value });
    };
    
    const handleSubject = (e) => {
        e.preventDefault();
        var data = {
            id: props.match.params.id,
            name: currentSubject.name,
        };
        if(data.name==""){
            const errors = "This field is required";
            setError(errors); 
        }else{
            setError("");
            SubjetcService.update(data.id, data)
            .then(response => {
                setCurrentSubject({ ...currentSubject });
                console.log(response.data);
                setMessage("The subject is updated successfully!");
            })
            .catch(e => {
                console.log(e);
            });
        }
    }
    return (
        <div className="row justify-content-center">
            <div className="col-md-9 col-12">
                <div className="d-flex justify-content-center">
                    <div className="w-50">
                    {message ? (
                        <div>
                            <h5>{message}</h5>                       
                        </div>
                    ) : ''}
                        <form  onSubmit={handleSubject}>
                            <div className="greenHeading">
                                Edit subject
                            </div>
                            <div className="form-group">
                                <span className="errorMsg"> </span> 
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control textAra" value={currentSubject.name} name="name" placeholder="Enter subject name" onChange={handleInputChange} />
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

export default SubjectEdit;