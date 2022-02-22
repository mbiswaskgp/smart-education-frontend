import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import CommonService from "../../services/CommonService";
//import { changeCurrentPage } from "../../store/actions/nav";
import { toast } from 'react-toastify';

function TutorDashboard(props) {
    const dispatch                = useDispatch();
    const [tutor, setTutor]       = useState([]);
    useEffect(() => {
        getTutorData();
    },[]);
    const getTutorData = id => {
        
        CommonService.getAll('tutorData')
        .then(response => {
            setTutor(response.data.data.tutor);
            console.log(response.data.data.tutor);
        })
        .catch(e => {
            toast.error(e,{autoClose: false}); 
        });
        //console.log(learnerAssessment);
    }
    //console.log(props);
    return (
        <div className="dahsbordTable">
            Tutor Dashboard
            <div>
            Name : {tutor.fname+' '+tutor.lname}
            </div>
        </div>
    );
}

export default TutorDashboard;