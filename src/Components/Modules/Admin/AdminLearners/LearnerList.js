import React, { useState, useEffect } from "react";
import { Link,useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Pagination from 'react-js-pagination';
import Modal from 'react-bootstrap/Modal';

import user_varible from '../../../Utils/Utils';
import CommonService from "../../../../services/CommonService";

//import { logout } from "../../../../store/actions/auth";

import CustomLoader from "../../../Common/CustomLoader";
import { changeCurrentPage } from "../../../../store/actions/nav";
import { history } from '../../../../helpers/history';
import { toast } from 'react-toastify';
import swal from 'sweetalert';


function LearnerList(props) {
    const itemNumber = user_varible.paagingnation_numberOfItems;
    const dispatch                          = useDispatch();
    const [learners, setLearners]           = useState([]);
    const [loaderArr, setLoaderArr]         = useState([]);
    const [loaderArr1, setLoaderArr1]       = useState([]);
    const [learnerPassArr, setLearnerPassArr] = useState([]);
    const [loader, setLoader]               = useState(false);
    const [loaderP, setLoaderP]             = useState(false);
    const [searchTitle,setSearchTitle]      = useState("");
    const [totalRecords, setTotalRecords]   = useState(0);
    const [activePage, setActivePage]       = useState(1);
    const [limit, setLimit]                 = useState(itemNumber);
    const [offset, setOffset]               = useState(0);
    const [lgShow, setLgShow]               = useState(false);
    const [sort, setSort] = useState({
        field: 'id',
        order: 'asc'
    });
    const location = useLocation();
    useEffect(() => {
        //console.log(location.state);

        if (history.location.state && history.location.state.activePageNumber) {
            console.log(history.location.state);
            const activePageNumber = history?.location?.state?.activePageNumber;
            const pageOffset1 = (activePageNumber - 1) * limit;
            setOffset(pageOffset1);
            setActivePage(activePageNumber);
            if(history.location.state.searchTitle){
                const searchTitle1 = history?.location?.state?.searchTitle;
                setSearchTitle(searchTitle1);
                //console.log(searchTitle);
                retrieveAllLearners(limit, pageOffset1, sort, searchTitle1);
            }else{
                retrieveAllLearners(limit, pageOffset1, sort, searchTitle);
            }
            let state = { ...history.location.state };
            delete state.activePageNumber;
            delete state.searchTitle;
            delete state.prevPage;
            history.replace({ ...history.location, state });
         }else{
            
            retrieveAllLearners(limit, offset, sort, searchTitle);
         }
        // if(location?.state !='undefined' && location?.state?.activePage!=='' && location?.state?.activePage!='undefined'){
        //     var searchTitle1 = "";
        //     console.log(location);
        //     console.log('ddd');
        //     retrieveAllLearners(limit, offset, sort, searchTitle);
        // }else{
        //     console.log('fff');
        //     retrieveAllLearners(limit, offset, sort, searchTitle);
        // }
        
        dispatch(changeCurrentPage('adminLearner'));

    }, []);
    
    const retrieveAllLearners = (limit, offset, sort, searchTitle) => {
        setLoader(true); 
        CommonService.getAllWithPage('learners/search',{ limit, offset, sort, searchTitle })
        .then(response => {
            //console.log(response.data.data.learners);
            const learnerlists = response.data.data.learners;
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
        //console.log(searchTitle);
    };
    const findByTitle = (e) =>{
        console.log(searchTitle);
        var offset1 = 0;
        setOffset(offset1);
        setActivePage(1);
        CommonService.findByTitle('learners/search',{ limit, offset1, sort, searchTitle })
            .then(response => {
                //console.log(response.data);
                setLearners(response.data.data.learners);
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
            title: "Are you sure to delete?",
            text: "Once deleted, you will not be able to recover this!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                CommonService.remove('deleteLearner',id)
                .then(response => {
                    //console.log(response.data);
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
        retrieveAllLearners(itemNumber, 0, { field: e, order: order });
    }

    // const handleDownloadPassword = (id) => {
    //     //console.log(id);
        
    //     setLoaderArr({ ...loaderArr, id: id });
    //     CommonService.getBlobById('exportLearner',id)
    //         .then((response) => {

    //             const url = window.URL.createObjectURL(new Blob([response.data]));
    //             const link = document.createElement('a');
    //             link.href = url;
    //             link.setAttribute('download', 'learner-password-file.xlsx'); //or any other extension
    //             document.body.appendChild(link);
    //             link.click();
    //             setLoaderArr({ ...loaderArr, id: '' });              
                
    //         })
    //         .catch(e => {
    //             toast.error(e,{autoClose: false}); 
    //             setLoaderArr({ ...loaderArr, id: '' });    
    //         });
    // }

    const handleShowPassword = (id) => {
        setLgShow(true);
        setLoaderP(true);
        setLearnerPassArr([]);
        CommonService.getById('getLarnerPasword', id)
            .then(response => {
                setLoaderP(false);
                if (response.data.success) {
                    var learners = {
                        learnerName:response.data.data.learners.fname+' '+response.data.data.learners.lname,
                        username:response.data.data.learners.username,
                        password_code:response.data.data.learners.password_code,
                        user_id:id
                    }
                    //console.log(learners);
                    setLearnerPassArr(learners);
                } else {
                    setLoaderP(false);
                }
            })
            .catch(e => {
                //console.log(e);
                setLoader(false);
            });
    }

    const handleSaveToArchived = (id) => {
       
        swal({
            title: "Archive this learner?",
            text: "Once archived, the learner will go on archived list!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                var formData = {};
                CommonService.updatePost('saveLearnerToArchive',id, formData)
                    .then(response => {
                        if(response.data.success){
                            toast.success(response.data.message); 
                            retrieveAllLearners(limit, offset, sort,searchTitle);
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

    const redirectToLearnerPage = (id) => {
        console.log(id);
        swal({
            title: "Are you sure you want to login as learner?",
            text: "Once you login as learner, you will be log out as admin!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                
                CommonService.getById('getLearnerLoginAuth',id)
                .then(response => {
                    if(response.data.success){
                        if (response.data.data.authData.accessToken) {
                            localStorage.setItem("user", JSON.stringify(response.data.data.authData));
                            //dispatch(logout());

                            history.push("/learner");
                            window.location.reload();
                        }
                        
                    }else{
                        toast.error(response.data.message,{autoClose: false});  
                    }
                })
                .catch(e => {
                    console.log(e);
                    toast.error(e,{autoClose: false});  
                    
                });
            }
        }); 
    }
    return (
        <div>
            <div className="row justify-content-center">
                <div className="col-md-12 col-12 learner_title"> <h4>Current Learner List </h4></div>
                <div className="col-md-8 col-8">
                    <div className="input-group-append align-items-center">
                        <span>Search : </span><input type="text" value={searchTitle}  className="form-control col-4 search-field3" onChange={onChangeSearchTitle} />
                            <button className="addLearner" onClick={findByTitle} >Search</button>
                    </div>
                </div>
                <div className="col-md-4 col-4">
                    <Link to="/admin/learner/add" className="detailsSection"> Add learner <i className="fa fa-plus-circle"></i></Link>
                </div>
                <div className="col-md-12 col-12 mt-3">
                    {(loader)?
                            <CustomLoader />:
                    <div className="table-responsive-md">                        
                        <table className="table table-borderd learner_table">
                            <thead>
                                <tr>
                                    <th onClick={onSortingColumn.bind(this, 'learner_name')}>
                                        Learners
                                        {sort.order === 'asc' && sort.field === 'learner_name' && <i className="fa fa-sort-asc ml-3" aria-hidden="true"></i>}
                                        {sort.order === 'desc' && sort.field === 'learner_name' && <i className="fa fa-sort-desc ml-3" aria-hidden="true"></i>}
                                    </th>  
                                    <th onClick={onSortingColumn.bind(this, 'current_level_name')}>
                                        Year
                                        {sort.order === 'asc' && sort.field === 'current_level_name' && <i className="fa fa-sort-asc ml-3" aria-hidden="true"></i>}
                                        {sort.order === 'desc' && sort.field === 'current_level_name' && <i className="fa fa-sort-desc ml-3" aria-hidden="true"></i>}
                                    </th>  
                                    <th onClick={onSortingColumn.bind(this, 'learning_center')}>
                                        Center
                                        {sort.order === 'asc' && sort.field === 'learning_center' && <i className="fa fa-sort-asc ml-3" aria-hidden="true"></i>}
                                        {sort.order === 'desc' && sort.field === 'learning_center' && <i className="fa fa-sort-desc ml-3" aria-hidden="true"></i>}
                                    
                                    </th> 

                                    <th onClick={onSortingColumn.bind(this, 'current_tutor_name')}>
                                        Tutor
                                        {sort.order === 'asc' && sort.field === 'current_tutor_name' && <i className="fa fa-sort-asc ml-3" aria-hidden="true"></i>}
                                        {sort.order === 'desc' && sort.field === 'current_tutor_name' && <i className="fa fa-sort-desc ml-3" aria-hidden="true"></i>}
                                    
                                    </th> 
                                    <th>Details</th>                
                                </tr>
                            </thead>
                            <tbody>
                                {learners &&
                                    learners.map((learner, index) => (
                                    <tr key={learner.id}>
                                        <td>{learner.learner_name}</td> 
                                        <td>{learner.current_level_name}</td> 
                                        <td>{learner.learning_center}</td> 
                                        <td>{learner.current_tutor_name}</td>
                                        <td>
                                            
                                            <Link className="iconButton2"
                                                to={{
                                                    pathname: "/admin/learner-details/"+learner.user_id,
                                                    state: {activePageNumber: activePage, 'searchTitle': searchTitle,'prevPage':'/admin/learner'} // your data array of objects
                                                }}
                                            ><i className="fa fa-tasks" aria-hidden="true" title="Progress"></i></Link>
                                            &nbsp;      
                                            <Link to={"/admin/learner/"} className="iconButton2" onClick={() => deleteLearner(learner.user_id)}><i className="fa fa-trash"  title="Delete"></i></Link>&nbsp;
                                            <Link to={"/admin/learner/assign-assessment-list/" + learner.user_id} className="iconButton2"> Assessment <i className="fa fa-angle-right"></i></Link>
                                            <Link to={"/admin/learner/edit/" + learner.user_id} className="iconButton2"><i className="fa fa-edit" title="Edit"></i></Link>
                                            {/* {(loaderArr?.id==learner.id)? <i className="fa fa-spinner fa-pulse"></i> : <button className="iconButton2" onClick={() => handleDownloadPassword(learner.id)}><span><i className="fa fa-download" title="Download"></i></span></button>} */}

                                            <button className="iconButton2" onClick={() => handleShowPassword(learner.user_id)}><span><i className="fa fa-address-book" title="View Password" aria-hidden="true"></i></span></button>
                                            
                                            {/* <button className="iconButton2" onClick={() => handleShowPassword(learner.id)}><span><i className="fa fa-address-book" aria-hidden="true"></i></span></button> */}

                                            <Link to={"/admin/learner/add-marks/" + learner.user_id} className="iconButton2"> <i className="fa fa-plus-square-o" aria-hidden="true" title="Add Marks"></i></Link>
                                            {(loaderArr1?.id==learner.user_id)?
                                                <i className="fa fa-spinner fa-pulse"></i>
                                                :
                                                <button className="iconButton2" onClick={() => handleSaveToArchived(learner.user_id)}><span><i className="fa fa-archive" aria-hidden="true" title="Archived"></i></span></button>
                                            }
                                            
                                        </td>
                                    </tr>
                                ))}                      
                            </tbody>            
                        </table>
                    </div>
                    }
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
                            <Link to="/admin/archived-learner"> Archived Learner <i className="fa fa-arrow-right" aria-hidden="true"></i> </Link>
                        </div>
                    </div>                     
                                           
                </div>   
            </div>

            <Modal
                size="lg"
                show={lgShow}
                onHide={() => {
                    setLgShow(false);
                }}
                aria-labelledby="example-modal-sizes-title-lg"
                animation={false}
                backdrop={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title className="modal-title text-center">
                        Learner Password          
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="crop-container">
                        <div className="col-lg-12 passwordModal">
                        
                        {(loaderP)?
                            <CustomLoader />:
                            <div>
                                <p>Learner Name : {learnerPassArr?.learnerName}</p>
                                <p>Username : {learnerPassArr?.username}</p>
                                <p>Password Code : {learnerPassArr?.password_code}</p>
                                <p> <button className="iconButton2" onClick={redirectToLearnerPage.bind(this,learnerPassArr?.user_id)}> Login As Learner  <i className="fa fa-angle-right"></i> </button></p>
                            </div>
                        }
                         
                        </div>    
                        
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default LearnerList;