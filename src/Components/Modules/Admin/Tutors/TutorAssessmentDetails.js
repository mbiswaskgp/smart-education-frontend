import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import CommonService from "../../../../services/CommonService";
import { changeCurrentPage } from "../../../../store/actions/nav";

import CustomLoader from "../../../Common/CustomLoader";

import { toast } from 'react-toastify';

const TutorAssessmentDetails = (props) => {
    const dispatch                          = useDispatch();
    const [assessments, setAssessments]     = useState([]);
    const [loader, setLoader]               = useState(false);
    const [searchTitle, setSearchTitle]     = useState("");   

    const tutorId=props.match.params.id;

    useEffect(() => {
        retrieveAllAssignAssessments(props.match.params.id)
        dispatch(changeCurrentPage('adminTutor'));
    }, [props.match.params.id]);

    const retrieveAllAssignAssessments = (tutor_id) => {
        setLoader(true);
        CommonService.getById('tutor-assessments-details',tutor_id)
        .then(response => {
            var learnersData = response.data.data.assessments.data; 
            setAssessments(learnersData);
            
            console.log(response.data.data.assessments.data);
            // if(response.data.data.total==0){
            //     toast.info('No record found');
            // }
            console.log(assessments);
            setLoader(false);              
        })
        .catch(e => {
            setLoader(false);
            console.log(e);
            toast.error(e,{autoClose: false});            
        });
    };


    const onChangeSearchTitle = e => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
    };

    const findByTitle = () => {

        setLoader(true);
        var data = {
            title: searchTitle,
        };
        if(searchTitle!=""){
            setAssessments([]);
        
            //console.log(data);
            CommonService.findByTitle('tutor-assessments-details/'+tutorId, data)
                .then(response => {
                    var learnersData1 = response.data.data.assessments.data; 
                    setAssessments(learnersData1);
                    //console.log(response.data);
                    setLoader(false);
                })
                .catch(e => {
                    toast.error(e,{autoClose: false});   
                    setLoader(false);
                });

        }
    };
    //const notify = () => toast.error("Wow so easy !");

    return (
        <div className="row justify-content-center">
            <div className="col-md-12 col-12">
                <div className="input-group-append align-items-center">
                    <span>Search : </span><input type="text" className="form-control col-4 search-field3" onChange={onChangeSearchTitle} />
                        <button className="addLearner" onClick={findByTitle}>Search</button>
                </div>
            </div>
            {/* <div className="col-md-4 col-12">
                <Link to={"/admin/tutor/assign-learner/" + tutorId} className="detailsSection"> Assign Learner <i className="fa fa-plus-circle"></i></Link>
            </div> */}
            <div className="col-md-12 col-12 mt-3">
                
                <div className="table-responsive-md">
                {(loader)?
                    <CustomLoader />:
                    <table className="table table-borderd learner_table">
                        <thead>
                            <tr>
                            <th colSpan="4">Assigned Assessment List</th>                  
                            </tr>
                        </thead>
                        <tbody>
                        {assessments.length>0 &&
                            assessments.map((assessment, index) => (
                            <tr key={assessment.id}>
                                {/* <td>{assessment.title}</td>  */}
                                <td>{assessment.assessment_name}</td> 
                                <td>{assessment.learner_fname+' '+assessment.learner_lname}</td> 
                                <td>{(assessment.status)?assessment.status:'-'}</td>
                                <td>{assessment.active_start_datetime + ' - ' + assessment.active_end_datetime}</td> 
                          
                            </tr>
                        ))}                
                        </tbody>            
                    </table> 
                    }
                </div>
            </div>            
        </div>
    );
};

export default TutorAssessmentDetails;