import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import CommonService from "../../../../services/CommonService";
import { changeCurrentPage } from "../../../../store/actions/nav";

import CustomLoader from "../../../Common/CustomLoader";

import { toast } from 'react-toastify';

import swal from 'sweetalert';

const AssignLearnerList = (props) => {
    const dispatch                          = useDispatch();
    const [learners, setLearners]           = useState([]);
    const [loader, setLoader]               = useState(false);
    const [searchTitle,setSearchTitle]      = useState("");   

    const tutorId=props.match.params.id;

    useEffect(() => {
        retrieveAllAssignLearners(props.match.params.id)
        dispatch(changeCurrentPage('adminTutor'));
    }, [props.match.params.id]);

    const retrieveAllAssignLearners = (tutor_id) => {
        setLoader(true);
        CommonService.getById('tutor-assign-learners',tutor_id)
        .then(response => {
            var learnersData = response.data.data.learners.data; 
            setLearners(learnersData);
            
            console.log(response.data.data.learners.data);
            // if(response.data.data.total==0){
            //     toast.info('No record found');
            // }
            console.log(learners);
            setLoader(false);              
        })
        .catch(e => {
            setLoader(false);
            console.log(e);
            toast.error(e,{autoClose: false});            
        });
    };
    const deleteAssignedLearner = (id) =>{
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                CommonService.remove('tutor/delete-assign-learner',id)
                .then(response => {
                    console.log(response.data);
                    if(response.data.success){
                        retrieveAllAssignLearners(tutorId);
                        toast.success(response.data.message);
                    }                    
                })
                .catch(e => {
                    toast.error(e,{autoClose: false});   
                });
            }
        });
    }

    const onChangeSearchTitle = e => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
    };

    const findByTitle = () => {
        setLoader(true);
        var data = {
            title: searchTitle,
        };
        //console.log(data);
        CommonService.findByTitle('tutor-assign-learners/'+tutorId, data)
            .then(response => {
                var learnersData = response.data.data.learners.data; 
                setLearners(learnersData);
                //console.log(response.data);
                setLoader(false);
            })
            .catch(e => {
                toast.error(e,{autoClose: false});   
                setLoader(false);
            });
    };
    //const notify = () => toast.error("Wow so easy !");

    return (
        <div className="row justify-content-center">
            <div className="col-md-8 col-8">
                <div className="input-group-append align-items-center">
                    <span>Search : </span><input type="text" className="form-control col-4 search-field3" onChange={onChangeSearchTitle} />
                        <button className="addLearner" onClick={findByTitle}>Search</button>
                </div>
            </div>
            <div className="col-md-4 col-4">
                <Link to={"/admin/tutor/assign-learner/" + tutorId} className="detailsSection"> Assign Learner <i className="fa fa-plus-circle"></i></Link>
            </div>
            <div className="col-md-12 col-12 mt-3">
                
                <div className="table-responsive-md">
                    <table className="table table-borderd learner_table">
                        <thead>
                            <tr>
                            <th colSpan="4">Assigned learner List</th>                  
                            </tr>
                        </thead>
                        <tbody>
                        {learners.length>0 &&
                            learners.map((learnr, index) => (
                            <tr key={learnr.id}>
                                <td>{learnr.learner_fname+' '+learnr.learner_lname}</td> 
                                <td>{learnr.learner_current_level}</td> 
                                <td>{learnr.learner_learning_center}</td>
                                <td>
                                    <span to="" className="detailsSection" onClick={() => deleteAssignedLearner(learnr.id)}>Remove</span>&nbsp;
                                    <Link to={"/admin/learner/edit/"+learnr.learner_user_id} className="detailsSection">Details <i className="fa fa-angle-right"></i></Link>&nbsp;
                                    <Link to={'/admin/learner-details/'+learnr.learner_user_id} className="detailsSection">Progress <i className="fa fa-angle-right"></i></Link>
                                </td>
                            </tr>
                        ))}                
                        </tbody>            
                    </table>                  

                {(loader)?
                    <CustomLoader />:''
                }

                </div>
            </div>            
        </div>
    );
};

export default AssignLearnerList;