import React, { useState, useEffect } from "react";

import { Link,useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import CommonService from "../../../../services/CommonService";

import CustomLoader from "../../../Common/CustomLoader";
import { changeCurrentPage } from "../../../../store/actions/nav";

import { toast } from 'react-toastify';
// import swal from 'sweetalert';

function LearnerDetails(props) {
    const dispatch                          = useDispatch();
    const [learner, setLearner]             = useState({note: ''});
    const [learnerId, setLearnerId]         = useState("");
    const [learnerData, setLearnerData]     = useState([]);
    const [learnerAssessments, setLearnerAssessments] = useState([]);
    const [loader1, setLoader1]             = useState(false);
    const [loader2, setLoader2]             = useState(false);
    const [loader3, setLoader3]             = useState(false);
    const [options, setOptions]             = useState(false);
    const [optionsArr1, setOptionsArr1]     = useState(false);
    const [optionsArr2, setOptionsArr2]     = useState(false);
    const [optionsArr3, setOptionsArr3]     = useState(false);
    const [optionsArr4, setOptionsArr4]     = useState(false);

    const [optionsArrSK, setOptionsArrSK]     = useState([]);
    let history = useHistory();
    
    useEffect(() => {
        getLearner(props.match.params.id);
        getLearnerAssessment(props.match.params.id);
        getLearnerAssessmentGraph(props.match.params.id);
        dispatch(changeCurrentPage('adminLearner'));
        setLearnerId(props.match.params.id);
              
    },[props.match.params.id,props.location.state]);
    const getLearner = (id) => {
        //e.preventDefault();
        setLoader1(true);
        CommonService.getById('learners',id)
        .then(response => {
            //console.log(response.data.data.learners);
            if(response.data.success){
                
                var learners = {
                    fname: response.data.data.learners.fname,
                    lname: response.data.data.learners.lname,
                    email: response.data.data.learners.email,
                    contact_number: response.data.data.learners.contact_number,
                    level_id: response.data.data.learners.current_level_id,
                    learning_center: response.data.data.learners.learning_center,
                    parent_name: response.data.data.learners.parent_name,
                    note: response.data.data.learners.note,
                    current_level_name: response.data.data.learners.current_level_name,
                    current_tutor_name: response.data.data.learners.current_tutor?.name,
                }
                //console.log(response.data.data.learners);
                setLearnerData(learners);
                setLearner({note: response.data.data.learners.note});
                setLoader1(false);
            }else{
                toast.error(response.data.message,{autoClose: true});  
                setLoader1(false);
            }
        })
        .catch(e => {
            console.log(e);
            toast.error(e,{autoClose: true});  
            setLoader1(false);
        });
    }

    const goToPreviousPath = () => {
        //history.goBack();
        

        history.push( {pathname: "/admin/learner",
            state: props.location.state});
    }

    const getLearnerAssessment = (id) => {
        //e.preventDefault();
        setLoader2(true);
        CommonService.getById('learnerAssessmentTaken',id)
        .then(response => {
            if(response.data.success){
                //console.log(response.data.data.learnerAssessmentData);
                setLearnerAssessments(response.data.data.learnerAssessmentData);
                setLoader2(false);
            }else{
                toast.error(response.data.message,{autoClose: true});  
                setLoader2(false);
            }
        })
        .catch(e => {
            console.log(e);
            toast.error(e,{autoClose: false});  
            setLoader2(false);
        });
    }

    const getLearnerAssessmentGraph=(id)=>{
        const option1 = {
            chart: {
                type: 'column'
            },
            title: {
                text: "Y4 Procedural sample materials"
            },
            xAxis: {
                categories: ['test1']
            },
            series: [
                { data: [7.20] }
            ],
            credits: {
                enabled: false
            }
        };
        //setOptionsArr1(option1);
        setLoader3(true);
        CommonService.getById('getLearnerAssessmentGraph',id)
        .then(response => {
            if(response.data.success){
                setLoader3(false);
                
                let mainCategoryArr = response.data.data.mainCategoryArr;
                
                
                let i=0;
               
                if(mainCategoryArr[0] !== undefined){
                    
                    let option1 = {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: mainCategoryArr[0]['subject_title']
                        },
                        xAxis: {
                            categories: mainCategoryArr[0]['categoty']
                        },
                        series: [
                            { data: mainCategoryArr[0]['data'] }
                        ],
                        credits: {
                            enabled: false
                        }
                    };
                    setOptionsArr1(option1);
                }
                if(mainCategoryArr[1] !== undefined){
                    let option2 = {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: mainCategoryArr[1]['subject_title']
                        },
                        xAxis: {
                            categories: mainCategoryArr[1]['categoty'],
                        },
                        series: [
                            { data: mainCategoryArr[1]['data'] }
                        ],
                        credits: {
                            enabled: false
                        }
                    };
                    setOptionsArr2(option2);
                }
                if(mainCategoryArr[2] !== undefined){
                    let option3 = {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: mainCategoryArr[2]['subject_title']
                        },
                        xAxis: {
                            categories: mainCategoryArr[2]['categoty'],
                        },
                        series: [
                            { data: mainCategoryArr[2]['data'] }
                        ],
                        credits: {
                            enabled: false
                        }
                    };
                    setOptionsArr3(option3);
                }
                if(mainCategoryArr[3] !== undefined){
                    let option4 = {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: mainCategoryArr[3]['subject_title']
                        },
                        xAxis: {
                            categories: mainCategoryArr[3]['categoty'],
                        },
                        series: [
                            { data: mainCategoryArr[3]['data'] }
                        ],
                        credits: {
                            enabled: false
                        }
                    };
                    setOptionsArr4(option4);
                }
                // var j=0;
                // for (let item of mainCategoryArr) {
                //    // console.log(item['subject_title']);
                //     var option = {
                //         chart: {
                //             type: 'column'
                //         },
                //         title: {
                //             text: item['subject_title']
                //         },
                //         xAxis: {
                //             categories: item['categoty'],
                //         },
                //         series: [
                //             { data: item['data'] }
                //         ],
                //         credits: {
                //             enabled: false
                //         }
                //     };
                //     //setOptionsArr4(option4);
                //     setOptionsArr4({...optionsArr4,[j]:option});
                //     j++;
                //     //console.log(optionsArrSK);
                //     // console.log(option);
                // }
                // setOptionsArrSK({...optionsArrSK,optionsArr4});
                // //console.log(optionsArrSK.length);
                // console.log(optionsArrSK);
            }else{
                toast.error(response.data.message,{autoClose: false});  
                setLoader3(false);
            }
        })
        .catch(e => {
            console.log(e);
            toast.error(e,{autoClose: false});  
            setLoader3(false);
        });
    }

    const handleInputChange = event => {
        const { name, value } = event.target;
        setLearner({ ...learner, [name]: value });
        //console.log(learner);
    };

    const handleSubmitLearner = (e) => {
        //e.preventDefault();
        if(learner.note!=""){
            setLoader1(true);
            CommonService.updatePost('admin-saveLearnerNote', props.match.params.id, learner)
            .then(response => {
                //console.log(response.data);
                if (response.data.success) {
                    toast.success(response.data.message,{autoClose: true});
                    setLoader1(false);              
                } else {
                    setLoader1(false);
                    toast.error(response.data.message,{autoClose: true});   
                }
            })
            .catch(e => {
                console.log(e);
                setLoader1(false);
            });
        }else{
            alert("Enter the value in note");
            setLoader1(false);
        }
    }
    return (
        <>
        <div className="row">
            <div className="col-lg-9"></div>
            <div className="col-lg-3 backBtnStyle">
                <button className="addLearner" onClick={goToPreviousPath} > Back </button>
            </div>
        </div>
            
        <div className="row">
            
            <div className="col-lg-4">
                <div className="addQuestionTitle text-center greenHeading">
                    Learner Details
                </div>
                {(loader1)?
                <CustomLoader />:
                <div className="learnerAndTeachersList">
                    <div className="learner_details_saveed ml-auto mr-auto">
                        <div>
                            <b>Name</b> : {learnerData.fname+ ' ' +learnerData.lname}                      
                        </div>
                        <div>
                            <b>Tutor Assigned</b> : {learnerData.current_tutor_name}                      
                        </div>
                        <div>
                            <b>Contact Details</b> : {learnerData.contact_number}
                        </div>
                        <div>
                            <b>Dob</b> : {learnerData.contact_number}
                        </div>
                        <div>
                            <b>Year/Level</b> : {learnerData.current_level_name}
                        </div>
                        <div>
                            <b>Learning Center</b> : {learnerData.current_level_name}
                        </div>
                        <div >
                            <b>Parent/Gurdian Name</b> : {learnerData.parent_name}
                        </div> 
                        
                        <div className="form-group mt-4">
                            <p>Note</p>
                            <textarea name="note" cols="30" rows="3" className="form-control textAra" placeholder="Notes" onChange={handleInputChange} value={learner.note}></textarea>

                        </div>
                        <div className="text-right">
                            <button className="addLearner" onClick={handleSubmitLearner}>Update 
                            {(loader1)?<i className="fa fa-spinner fa-spin"></i>:''}
                            </button>
                        </div>    
                    </div>
                </div>
                }
                <div className="infogram mt-4">
                    <canvas id="myChart" width="500" height="250"></canvas>
                </div>
            </div>
            <div className="col-lg-4">
                <div className="existingheading text-center">
                    Assessments Taken
                </div>
                {(loader1)?
                <CustomLoader />:
                <div className="learnerAndTeachersList">
                    <div className="table-responsive-md">
                        <table className="table table-borderd learner_table">
                            <tbody>
                            {learnerAssessments &&
                                learnerAssessments.map((learnerAssessment, index) => (
                                <tr key={learnerAssessment.id}>
                                    <td>{learnerAssessment?.assessment?.name}</td> 
                                    <td>{learnerAssessment.total_obtained_marks}</td> 
                                    <td><Link to={"/admin/learner-assessment-result/"+learnerAssessment.id+"/"+learnerId}>View</Link></td>
                                </tr>
                            ))}      
                            </tbody>            
                        </table>                    
                    </div>
                </div>
                }
            </div>
            <div className="col-lg-4">
                <div className="greenHeading">
                    Assessment Progress                                  
                </div>
                <div className="toDoListGroup">
                   
                {(optionsArr1)?
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={optionsArr1}                    
                    />:""                
                }
                {(optionsArr2)?
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={optionsArr2}                    
                    />:""                
                }
                {(optionsArr3)?
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={optionsArr3}                    
                    />:""                
                }
                {(optionsArr4)?
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={optionsArr4}                    
                    />:""                
                }
                {/* {optionsArrSK.length>0 &&
                    optionsArrSK.map((optn) => (
                        <div>
                            {optn} 
                        </div>
                    ))}  
                 */}
                
                
                 {/* <HighchartsReact
                    highcharts={Highcharts}
                    options={optionsArr}                    
                /> */}

                {/* <HighchartsReact
                    highcharts={Highcharts}
                    options={options}                    
                />  */}
                </div>                                
            </div>                          
        </div>
        </>
    );
}

export default LearnerDetails;