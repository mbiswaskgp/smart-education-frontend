import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Pagination from 'react-js-pagination';

import CommonService from "../../../../services/CommonService";
import user_varible from '../../../Utils/Utils';
import CustomLoader from "../../../Common/CustomLoader";
import { changeCurrentPage } from "../../../../store/actions/nav";

import { toast } from 'react-toastify';
import swal from 'sweetalert';

function TutorList() {
    const itemNumber = user_varible.paagingnation_numberOfItems;
    const dispatch                          = useDispatch();
    const [tutors, setTutors]               = useState([]);
    const [loader, setLoader]               = useState(false);
    const [searchTitle,setSearchTitle]      = useState("");    
    const [loaderArr1, setLoaderArr1]       = useState([]);
    
    const [totalRecords, setTotalRecords]   = useState(0);
    const [activePage, setActivePage]       = useState(1);
    const [limit, setLimit]                 = useState(itemNumber);
    const [offset, setOffset]               = useState(0);
    const [sort, setSort] = useState({
        field: 'id',
        order: 'asc'
    });

    useEffect(() => {
        retrieveAllTutors(limit, offset, sort, searchTitle);
        dispatch(changeCurrentPage('adminTutor'));
    }, []);
    
    const retrieveAllTutors = (limit, offset, sort, searchTitle) => {
        setLoader(true);
        CommonService.getAllWithPage('tutors/search',{ limit, offset, sort, searchTitle })
        .then(response => {
            setTutors(response.data.data.tutors);
            setLoader(false);
            console.log(response.data.data);
            setTotalRecords(response.data.data.total);
        })
        .catch(e => {
            console.log(e);
            setLoader(false);
        });
    };

    const onChangeSearchTitle = e => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
    };
    const findByTitle = (e) =>{
        var offset1 = 0;
        retrieveAllTutors(limit, offset1, sort, searchTitle );
            
    }

    const handleSaveToInactive = (id) => {
       
        swal({
            title: "Are you sure to inactive this tutor?",
            text: "Once inactive, tutor will go to inactive list!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                var formData = {};
                CommonService.updatePost('saveTutorToInactive',id, formData)
                    .then(response => {
                        if(response.data.success){
                            toast.success(response.data.message); 
                            retrieveAllTutors(limit, offset, sort,searchTitle);
                        }else{
                            toast.error(response.data.message); 
                        }
                    })
                    .catch(e => {
                        console.log(e.message);
                    });
            }
        }); 
    }
    const onPageChanged = (page) => {
        const pageOffset = (page - 1) * limit;
        setOffset(pageOffset);
        setActivePage(page);
        retrieveAllTutors(limit, pageOffset, sort, searchTitle);
    }

    return (
        <div>
            <div className="row justify-content-center">
                <div className="col-md-8 col-8">
                    <div className="input-group-append align-items-center">
                        Search : <input type="text" className="form-control col-4 search-field3" onChange={onChangeSearchTitle} />
                        <button className="addLearner"  onClick={findByTitle} >Search</button>
                    </div>
                </div>
                <div className="col-md-4 col-4">
                    <Link to="/admin/tutor/add" className="detailsSection"> Add Tutor <i className="fa fa-plus-circle"></i></Link>
                </div>
                <div className="col-md-12 col-12 mt-3">
                
                    <div className="table-responsive-md tutorWrp">

                        
                        <table className="table table-borderd learner_table">
                            <thead>
                                <tr>
                                <th colSpan="4">Tutor List</th>                  
                                </tr>
                            </thead>
                            <tbody>
                                {tutors &&
                                    tutors.map((tutor, index) => (
                                    <tr key={tutor.id}>
                                        <td>{tutor.fname + ' ' + tutor.lname }</td> 
                                        <td>{tutor.email }</td> 
                                        <td>{tutor?.tutor?.contact_number }</td>                  
                                        <td>
                                            <Link to={"/admin/tutor/edit/" + tutor.id} className="iconButton2 mr-2">Edit <i className="fa fa-angle-right"></i></Link> 
                                            <Link className="iconButton2 mr-2" to={"/admin/tutor/assign-learner-list/" + tutor.id} >Learner <i className="fa fa-angle-right"></i></Link>
                                            <Link className="iconButton2" to={"/admin/tutor/assign-assessment-list/" + tutor.id} >Assessment <i className="fa fa-angle-right"></i></Link>
                                            
                                            {(loaderArr1?.id==tutor.id)?
                                                <i className="fa fa-spinner fa-pulse"></i>
                                                :
                                                <button className="iconButton2" onClick={() => handleSaveToInactive(tutor.id)}><span>Inactive</span></button>
                                            }
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
            <div className="rows">
                <div className="column">
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
            <div className="rows">
                <div className="col-md-8 col-8">
                </div>
                <div className="col-md-4 col-4">
                    <Link to="/admin/tutor/inactive"> Inactive Tutors <i className="fa fa-arrow-right" aria-hidden="true"></i> </Link>
                </div>
            </div>
        </div>
    );
}

export default TutorList;