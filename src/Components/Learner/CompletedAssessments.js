import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link  } from "react-router-dom";
import Pagination from 'react-js-pagination';

import CommonService from "../../services/CommonService";
import Banner from "../Layouts/Banner";
import Footer from "../Layouts/Footer";
import LearnerHeader from "../Layouts/Learner/LearnerHeader";
import user_varible from '../Utils/Utils';
import CustomLoader from "../Common/CustomLoader";
import { changeCurrentPage } from "../../store/actions/nav";

function CompletedAssessments(props) {
    const itemNumber = user_varible.paagingnation_numberOfItems;
    const dispatch                          = useDispatch();
    const [learners, setLearners]           = useState([]);
    const [loader, setLoader]               = useState(false);
    const [totalRecords, setTotalRecords]   = useState(0);
    const [activePage, setActivePage]       = useState(1);
    const [limit, setLimit]                 = useState(5);
    const [offset, setOffset]               = useState(0);
    const [searchTitle,setSearchTitle]      = useState("");
    const [sort, setSort]                   = useState({
                                                field: 'id',
                                                order: 'asc'
                                            });
    useEffect(() => {
        getLearnerActiveAssessments(limit, offset, sort);
        dispatch(changeCurrentPage('frontendLearner'));
    },[]);
    // const getLearnerActiveAssessments = (limit, offset, sort) => {
    //     setLoader(true); 
    //     CommonService.getAllWithPage('learnerCompletedAssessment',{ limit, offset, sort })
    //     .then(response => {
    //         //console.log(response.data.data);
    //         const learnerlists = response.data.data.assessmentData;
    //         //console.log(learnerlists);
    //         setLearners(learnerlists);
    //         setTotalRecords(response.data.data.total);
    //         setLoader(false);
    //     })
    //     .catch(e => {
    //         console.log(e);
    //         setLoader(false);
    //     });
    // }
    // const onPageChanged = (page) => {
    //     const pageOffset = (page - 1) * limit;
    //     setOffset(pageOffset);
    //     setActivePage(page);
    //     getLearnerActiveAssessments(limit, pageOffset, sort);
    // }
    const getLearnerActiveAssessments = (limit, offset, sort, searchTitle) => {
        setLoader(true); 
        CommonService.getAllWithPage('learnerCompletedAssessment',{ limit, offset, sort,searchTitle })
        .then(response => {
            const learnerlists = response.data.data.assessmentData.data;
            console.log(learnerlists);
            setLearners(learnerlists);
            setTotalRecords(response.data.data.total);
            setLoader(false);
        })
        .catch(e => {
            console.log(e);
            setLoader(false);
        });
    }
    const onPageChanged = (page) => {
        const pageOffset = (page - 1) * limit;
        setOffset(pageOffset);
        setActivePage(page);
        getLearnerActiveAssessments(limit, pageOffset, sort);
    }
    const onChangeSearchTitle = e => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
        //console.log(searchTitle);
    };
    const findByTitle = (e) =>{
        console.log(searchTitle);
        var offset1 = 0;
        setOffset(offset1);
        setActivePage(1);
        getLearnerActiveAssessments(limit, offset1, sort,searchTitle)
    }
    const onSortingColumn = (e, key) => {
        let order = '';
        if (sort.field === e) {
          if (sort.order === 'asc') {
            order = 'desc';
          } else if (sort.order === 'desc') {
            order = 'asc';
          } else {
            order = 'asc';
          }
        } else {
          order = 'asc';
        }
        setSort({ field: e, order: order });
        setActivePage(1);
        getLearnerActiveAssessments(limit, 0, { field: e, order: order });
    }
    return (
        <div>
            <LearnerHeader/>
            <Banner/>
            <section className="question-management">
                    <div className="container">
                        {/*  */}
                        <div className="row justify-content-center">
                            <div className="col-md-12 col-12 mt-3">
                                Completed Assessment List
                            </div>
                            <div className="col-md-12 col-12 mt-3">
                                <div className="input-group-append align-items-center">
                                    <span>Search : </span><input type="text" value={searchTitle}  className="form-control col-4 search-field3" onChange={onChangeSearchTitle} />
                                    <button className="addLearner" onClick={findByTitle} >Search</button>
                                </div>
                            </div>
                        
                            <div className="col-md-12 col-12 mt-3">
                                {(loader)?
                                        <CustomLoader />:
                                <div className="table-responsive-md">  

                                    <table className="table table-borderd learner_table">
                                        <thead>
                                            <tr>
                                                <th onClick={onSortingColumn.bind(this, 'name')}>Name
                                                {sort.order === 'asc' && sort.field === 'name' && <i className="fa fa-sort-asc ml-3" aria-hidden="true"></i>}
                                        {sort.order === 'desc' && sort.field === 'name' && <i className="fa fa-sort-desc ml-3" aria-hidden="true"></i>}
                                                </th>    
                                                <th  onClick={onSortingColumn.bind(this, 'active_start_datetime')}>Date
                                                {sort.order === 'asc' && sort.field === 'active_start_datetime' && <i className="fa fa-sort-asc ml-3" aria-hidden="true"></i>}
                                        {sort.order === 'desc' && sort.field === 'active_start_datetime' && <i className="fa fa-sort-desc ml-3" aria-hidden="true"></i>}
                                                </th>
                                                <th>Marks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {learners &&
                                                learners.map((learner, index) => (
                                                <tr key={learner.id}>
                                                    <td>{learner.assessment_name}</td>
                                                    <td>{learner.active_start_date+' - '+learner.active_end_date}</td>       
                                                    <td>
                                                        {learner.total_obtained_marks}
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
                                        {(learners && parseInt(totalRecords)>limit)?
                                        <Pagination
                                            activePage={parseInt(activePage)}
                                            itemsCountPerPage={parseInt(limit)}
                                            totalItemsCount={totalRecords}
                                            pageRangeDisplayed={5}
                                            onChange={(e) => onPageChanged(e)}
                                            itemclassName="page-item"
                                            linkclassName="page-link"
                                        />
                                        :''
                                        }

                                    </div>
                                </div>                        
                                <div className="rows">
                                    <div className="col-md-8 col-8">
                                    </div>
                                    <div className="col-md-4 col-4">
                                        <Link to="/learner"> Active Assessments <i className="fa fa-arrow-right" aria-hidden="true"></i> </Link>
                                    </div>
                                </div>                          
                            </div>   
                        </div>
                        {/*  */}
                    </div>
                </section>
            <Footer/>        
        </div>
    );
}

export default CompletedAssessments;