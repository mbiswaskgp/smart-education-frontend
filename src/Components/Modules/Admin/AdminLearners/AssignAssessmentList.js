import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Pagination from 'react-js-pagination';
import CommonService from "../../../../services/CommonService";
import { changeCurrentPage } from "../../../../store/actions/nav";
import user_varible from '../../../Utils/Utils';
import CustomLoader from "../../../Common/CustomLoader";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import swal from 'sweetalert';
//import swal from 'sweetalert';

const AssignAssessmentList = (props) => {
    const itemNumber                            = user_varible.paagingnation_numberOfItems;
    const dispatch                              = useDispatch();
    const [learnersAssessments, setLearnersAssessments] = useState([]);
    const [learnersName, setLearnersName]       = useState('');
    const [loader, setLoader]                   = useState(false);
    const [totalRecords, setTotalRecords]       = useState(0);
    const [activePage, setActivePage]           = useState(1);
    const [limit, setLimit]                     = useState(itemNumber);
    const [offset, setOffset]                   = useState(0);
    const [lgShow, setLgShow]                   = useState(false);
    const [sort, setSort] = useState({
        field: 'id',
        order: 'asc'
    });
    const learnerId = props.match.params.id;

    useEffect(() => {
        retrieveLearnerAssessment(props.match.params.id,limit, offset, sort)
        dispatch(changeCurrentPage('adminLearner'));
    }, [props.match.params.id]);

    const retrieveLearnerAssessment = (learnerId,limit, offset, sort) => {
        setLoader(true);
        let data = {limit, offset, sort};
        CommonService.getAllWithData('learner-assessment-list/'+learnerId, data)
        .then(response => {
            var learnersData = response.data.data.assessmentData;
            //console.log(learnersData); 
            setLearnersAssessments(learnersData);
            setLearnersName(response.data.data.learnerName);
            
            // if(response.data.data.total==0){
            //     toast.info('No record found');
            // }
            setTotalRecords(response.data.data.total)
            //console.log(response.data.data.learnerDataCnt);
            setLoader(false);              
        })
        .catch(e => {
            setLoader(false);
            
            toast.error(e,{autoClose: true});            
        });
    };
    const onPageChanged = (page) => {
        const pageOffset = (page - 1) * limit;
        setOffset(pageOffset);
        setActivePage(page);
        retrieveLearnerAssessment(learnerId,limit, pageOffset, sort);
    }

    return (
        <div className="row justify-content-center">
            <div className="col-md-8 col-8">
            </div>
          
            <div className="col-md-4 col-4">
                <Link to={"/admin/learner/assign-assessment/" + learnerId} className="detailsSection"> Assign Assessment <i className="fa fa-plus-circle"></i></Link>
            </div>
            
            <div className="col-md-12 col-12 mt-3">
                Learner {learnersName} Assessment List
                <div className="table-responsive-md tutorWrp">
                
                {(loader)?
                    <CustomLoader />:
                
                    <table className="table table-borderd learner_table">
                        <thead>
                            <tr>
                                <th>Assessment Name</th> 
                                <th>Tutor</th> 
                                <th width="250px">Action</th> 
                            </tr>
                        </thead>
                        <tbody>
                        {learnersAssessments.length>0 &&
                            learnersAssessments.map((assessmentD, index) => (
                            <tr key={assessmentD.id}>
                                <td>{assessmentD?.assessment?.name}</td> 
                                <td>{assessmentD?.tutor_user?.fname+' '+assessmentD?.tutor_user?.lname}</td> 
                                <td>
                                   <Link to={'/admin/learner/assessment-details-list/'+learnerId+'/'+assessmentD.assessment_id} className="detailsSection2">
                                        Details
                                    </Link>
                                </td>
                                
                            </tr>
                        ))} 
                                    
                        </tbody>            
                    </table>       
                }
                </div>
                <div className="row justify-content-center">
                    <Pagination
                        activePage={parseInt(activePage)}
                        itemsCountPerPage={parseInt(limit)}
                        totalItemsCount={totalRecords}
                        //pageRangeDisplayed={5}
                        onChange={(e) => onPageChanged(e)}
                        itemclassName="page-item "
                        linkclassName="page-link"
                    />
                </div>
            </div>            
        </div>
    );
};

export default AssignAssessmentList;