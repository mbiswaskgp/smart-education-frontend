import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Pagination from 'react-js-pagination';
import user_varible from '../../../Utils/Utils';
import CommonService from "../../../../services/CommonService";

import CustomLoader from "../../../Common/CustomLoader";
import { changeCurrentPage } from "../../../../store/actions/nav";

import { toast } from 'react-toastify';
import swal from 'sweetalert';

function LearnerArchivedAssessments() {
    const itemNumber = user_varible.paagingnation_numberOfItems;
    const dispatch                          = useDispatch();
    const [learners, setLearners]           = useState([]);
    const [loader, setLoader]               = useState(false);
    const [searchTitle,setSearchTitle]      = useState("");
    const [totalRecords, setTotalRecords]   = useState(0);
    const [activePage, setActivePage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [offset, setOffset] = useState(0);
    const [sort, setSort] = useState({
        field: 'question_name',
        order: 'asc'
    });
    useEffect(() => {
        console.log(limit);
        console.log(offset+limit);
        retrieveAllLearners(limit, offset, sort,searchTitle);
        dispatch(changeCurrentPage('adminLearner'));
    }, []);
    
    const retrieveAllLearners = (limit, offset, sort, searchTitle) => {
        setLoader(true); 
        
        CommonService.getAllWithPage('learner-archived-assessment',{ limit, offset, sort, searchTitle })
        .then(response => {
            //console.log(response.data.data);
            const learnerlists = response.data.data.assessmentData;
            console.log(learnerlists);
            setLearners(learnerlists);
            setTotalRecords(response.data.data.total);
            setLoader(false);
        })
        .catch(e => {
            console.log(e);
            setLoader(false);
        });
    };

    const onChangeSearchTitle = e => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
        console.log(searchTitle);
    };
    const findByTitle = (e) =>{
       //console.log(searchTitle);
        
        CommonService.findByTitle('learner-assessment',{ limit, offset, sort, searchTitle })
            .then(response => {
                //console.log(response.data);
                setLearners(response.data.data.learners.data);
                setTotalRecords(response.data.data.total);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const onPageChanged = (page) => {
        const pageOffset = (page - 1) * limit;
        setOffset(pageOffset);
        setActivePage(page);
        retrieveAllLearners(limit, pageOffset, sort,searchTitle);
    }
    const deleteLearner = (id) => {
        // console.log(name);
        // console.log(index);
        swal({
            title: "Are you sure to dele?",
            text: "Once deleted, you will not be able to recover this!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                CommonService.remove('deleteLearner',id)
                .then(response => {
                    console.log(response.data);
                    if(response.data.success){
                        
                        retrieveAllLearners(limit, offset, sort,searchTitle);
                        toast.success(response.data.message);
                    }
                    
                })
                .catch(e => {
                    toast.error(e,{autoClose: false});   
                });
            }
        });        
    }

    return (
        <div>
            <div className="row justify-content-center">
                <div className="col-md-8 col-8">
                    {/* <div className="input-group-append align-items-center">
                        <span>Search : </span><input type="text" className="form-control col-4 search-field3" onChange={onChangeSearchTitle} />
                            <button className="addLearner" onClick={findByTitle} >Search</button>
                    </div> */}
                </div>
               
                <div className="col-md-12 col-12 mt-3">
                    {(loader)?
                            <CustomLoader />:
                    <div className="table-responsive-md">                        
                        <table className="table table-borderd learner_table">
                            <thead>
                                <tr>
                                    <th colSpan="2">Archived Assessment List</th>                  
                                </tr>
                            </thead>
                            <tbody>
                                {learners &&
                                    learners.map((learner, index) => (
                                    <tr key={learner.id}>
                                        <td>{learner.title}</td>       
                                        <td>
                                            
                                            {(learner.status=='completed')?
                                            'Completed':
                                                <Link to={"/learner/assessment/" + learner.id} className="detailsSection">Start Exam <i className="fa fa-angle-right"></i></Link>                                      
                                            }
                                        </td>
                                    </tr>
                                ))
                                }                      
                                
                            </tbody>            
                        </table>

                        {learners.length===0 ? 'No Record Found' : ''}
                    </div>
                    }
                    <div className="rows">
                        <div className="column">
                        {(learners && parseInt(totalRecords)>5)?
                            <Pagination
                                activePage={parseInt(activePage)}
                                itemsCountPerPage={parseInt(limit)}
                                totalItemsCount={totalRecords}
                                pageRangeDisplayed={5}
                                onChange={(e) => onPageChanged(e)}
                                itemclassName="page-item "
                                linkclassName="page-link"
                            />
                            :''
                            }

                        </div>
                    </div>                        
                                            
                </div>   
            </div>
        </div>
    );
}

export default LearnerArchivedAssessments;