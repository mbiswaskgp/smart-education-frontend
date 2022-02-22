import React , { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { changeCurrentPage } from "../../store/actions/nav";

import CustomLoader from "../Common/CustomLoader";
import CommonService from "../../services/CommonService";
import { toast } from 'react-toastify';
//import swal from 'sweetalert';

function AdminDashboard(props) {
    const dispatch                = useDispatch();
    const [loader1, setLoader1]   = useState(false);
    const [loader2, setLoader2]   = useState(false);
    const [loader3, setLoader3]   = useState(false);
    const [tutors, setTutors]     = useState([]);
    const [learners, setLearners] = useState([]);
    //const [taskLists, setTaskLists] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [addData, setAddData]     = useState([]);
    const [updateData, setUpdateData] = useState([]);
    const [error, setError]         = useState("");
    useEffect(() => {
        dispatch(changeCurrentPage('adminDashboard'));
        getAllActiveLearners();
        getAllActiveTutor();
        allPendingMarksAssessment();
        //getAllTask();

    }, []);

    const getAllActiveLearners = () => {
        setLoader1(true); 
        CommonService.getAll('allActiveLearners')
            .then(response => {
                setLoader1(false); 
                if (response.data.success) {
                    //console.log(response.data.data.learners.data); 
                    setLearners(response.data.data.learners.data)                   
                }
            })
            .catch(e => {
                console.log(e);
                setLoader1(false);
            });
    }
    const getAllActiveTutor = () => {
        setLoader2(true); 
        CommonService.getAll('allActiveTutors')
            .then(response => {
                setLoader2(false); 
                if (response.data.success) {
                    //console.log(response.data.data.tutors.data);      
                    setTutors(response.data.data.tutors.data);              
                }
            })
            .catch(e => {
                console.log(e);
                setLoader2(false);
            });
    }
    const allPendingMarksAssessment = () => {
        setLoader2(true); 
        CommonService.getAll('allPendingMarksAssessment')
            .then(response => {
                setLoader3(false); 
                if (response.data.success) {
                    console.log(response.data.data.assessments);      
                    setAssessments(response.data.data.assessments);              
                }
            })
            .catch(e => {
                console.log(e);
                setLoader3(false);
            });
    }

    // const getAllTask = () => {
    //     setLoader3(true);
    //     CommonService.getAll('tasks')
    //         .then(response => {
    //             setLoader3(false); 
    //             if (response.data.success) {
    //                 //console.log(response.data.data.taskLists); 
    //                 setTaskLists(response.data.data.taskLists)                   
    //             }
    //         })
    //         .catch(e => {
    //             console.log(e);
    //             setLoader3(false);
    //         });
    // }

    // const handleInputChange = event => {
    //     const { name, value } = event.target;
    //     setAddData({ ...addData, [name]: value });
    // };

    // const handleTaskList = (e) => {
    //     e.preventDefault();
    //     var data = {
    //         description: addData.description,
    //     };
    //     console.log(addData.description);
    //     if(addData.length===0){
    //         const errors = "This field is required";
    //         setError(errors); 
    //     }else{
    //         setLoader3(true);
    //         setError(""); 
    //         CommonService.create('tasks', data)
    //         .then(response => {
    //             setTaskLists([]);
    //             //getAllTask();
    //             setLoader3(false);
    //             setAddData([]);
    //             toast.success(response.data.message);
    //             // console.log(response);
    //             // setSubject(initialSubjectState);
    //         })
    //         .catch(e => {
    //             //console.log(e);
    //             toast.error(e);
    //         });
    //     }

    //     console.log(error);
    // }
    // const handleInputChange1 = event => {
    //     const { name, checked } = event.target;
    //     setUpdateData({ ...updateData, [name]: checked });
    // }

    
    // const handleUpdateTaskList = (e) => {
    //     e.preventDefault();
    //     setLoader3(false);
    //     //console.log(setUpdateData);
    //     CommonService.updatePost('updateAllTask', null , updateData)
    //         .then(response => {
    //             toast.success(response.data.message);
    //             //getAllTask();
    //         })
    //         .catch(e => {
    //             console.log(e.message);
    //         });
    // }

    // const handleDeleteTaskList = (key,e) => {
    //     swal({
    //         title: "Are you sure?",
    //         text: "Once deleted, you will not be able to recover this!",
    //         icon: "warning",
    //         buttons: true,
    //         dangerMode: true,
    //     })
    //     .then((willDelete) => {
    //         if (willDelete) {
    //             CommonService.deleteData('tasks', key)
    //             .then(response => {
    //                 //console.log(response);
    //                 toast.success(response.data.message);
    //                 getAllTask();
    //             })
    //             .catch(e => {
    //                 toast.error(e);
    //             });
    //         }            
    //     });
    // }
    return (
        <div className="row">
            <div className="col-lg-4">
                <div className="addQuestionTitle text-center">
                    Active Learners
                </div>
                <div className="learnerAndTeachersList">
                    {(loader1) ?
                        <CustomLoader /> : ''
                    }
                    <ul>
                    { learners.map((learner, index) => (
                        <li key={index}>
                            <span className="nameofStudent">{learner.learner_fname+' '+learner.learner_lname}</span>
                            <Link to={"/admin/learner-details/"+learner.learner_user_id} className="progressBtn">progress</Link>
                        </li>
                        ))
                    }
                    </ul>
                </div>
                {/* <div className="infogram mt-4">
                    <canvas id="myChart" width="500" height="250"></canvas>
                </div> */}
            </div>
            <div className="col-lg-4">
                <div className="existingheading text-center">
                    ACTIVE TUTORS
                </div>
                <div className="learnerAndTeachersList">
                    {(loader2) ?
                        <CustomLoader /> : ''
                    }
                    <ul>
                    { tutors.map((tutor, index) => (
                        <li key={index}> 
                            <span className="nameofStudent">{tutor.fname+' '+tutor.lname}</span>
                            <Link to={"/admin/tutor/assign-learner-list/"+tutor.id}className="techsDetlsBtn">DETAILS</Link>
                        </li>
                        ))
                    }
                    <li><span className="nameofStudent">&nbsp;</span><Link to={"/admin/tutor/"}className="techsDetlsBtn">More</Link></li>
                    </ul>
                </div>

            </div>
            <div className="col-lg-4">
                <div className="greenHeading">
                    ASSESSMENT LIST                                   
                </div>
                <div className="toDoListGroup">
                    <div>
                        
                        {/* {(loader3) ?
                            <CustomLoader /> : <div className="text-right doneSlected">
                                Done
                            </div>
                        } */}
                        {(loader3) ?
                            <CustomLoader /> : ''
                        }
                        {
                            assessments.map((assessment, index) => (
                                <li key={index}> 
                                    <Link to={"/admin/tutor/assessment-monitor-results/"+assessment.assessment_id+'/'+assessment.tutor_user_id} ><span className="nameofStudent">{assessment.assessment.name}</span>
                                    </Link>
                                </li>
                                
                            ))
                        } 
                        
                        {/* {
                            taskLists.map((taskList, index) => (
                                <div key={index}>
                                    <div className="green_checkbox" key={taskList.id}>
                                        <input type="checkbox" className="" id={taskList.id} name={taskList.id} onChange={handleInputChange1} defaultChecked={(taskList.status=='completed')?'checked':''} />
                                        
                                        <label htmlFor={taskList.id}>{taskList.description}</label>
                                    </div>
                                </div>
                                
                            ))
                        } */}
                        
                        {/* <div className="green_checkbox">
                            <input type="checkbox" className="" id="createquCheck2" />
                            <label htmlFor="createquCheck2">Register new learners</label>
                        </div>

                        <div className="green_checkbox">
                            <input type="checkbox" className="" id="createquCheck3" />
                            <label htmlFor="createquCheck3">Find a year 9  science teacher</label>
                        </div>

                        <div className="green_checkbox">
                            <input type="checkbox" className="" id="createquCheck4" />
                            <label htmlFor="createquCheck4">Check outstanding assessments</label>
                        </div>
                        <div className="green_checkbox">
                            <input type="checkbox" className="" id="createquCheck5" />
                            <label htmlFor="createquCheck5">Contact parents of A new learner</label>
                        </div> */}
                        {/* <div className="text-right updateCbBtn">
                            <button className="progressBtn" onClick={handleUpdateTaskList}>UPDATE</button>
                        </div> */}
                    </div>

                    {/* <div className="whatNeedSect">
                        <input type="text" className="whatneedtodone" placeholder="What needs to be done!" name="description" value={(addData && addData.description)?addData?.description:''} onChange={handleInputChange} />
                        <span className="errorMsg"> {error}</span> 
                        <button className="addTaskBtn" onClick={handleTaskList}>ADD TASK</button>
                    </div> */}

                </div>                                
            </div>                          
        </div>
                    
    );
}

export default AdminDashboard;