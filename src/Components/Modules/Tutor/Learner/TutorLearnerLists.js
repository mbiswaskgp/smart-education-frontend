import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Pagination from 'react-js-pagination';
import Modal from 'react-bootstrap/Modal';

import user_varible from '../../../Utils/Utils';
import CommonService from "../../../../services/CommonService";
import { history } from '../../../../helpers/history';

import CustomLoader from "../../../Common/CustomLoader";
import { changeCurrentPage } from "../../../../store/actions/nav";
import { toast } from 'react-toastify';
import swal from 'sweetalert';

function TutorLearnerLists() {
    const itemNumber = user_varible.paagingnation_numberOfItems;
    const dispatch                          = useDispatch();
    const [learners, setLearners]           = useState([]);
    const [loaderArr, setLoaderArr]         = useState([]);
    //const [loaderArr1, setLoaderArr1]         = useState([]);
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
    useEffect(() => {
        // console.log(limit);
        // console.log(offset+limit);
        retrieveAllLearners(limit, offset, sort,searchTitle);
        dispatch(changeCurrentPage('tutorLearner'));
    }, []);
    
    const retrieveAllLearners = (limit, offset, sort, searchTitle) => {
        setLoader(true); 
        
        CommonService.getAllWithPage('learners/search',{ limit, offset, sort, searchTitle })
        .then(response => {
            console.log(response.data.data.learners);
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
        console.log(searchTitle);
    };
    const findByTitle = (e) =>{
       //console.log(searchTitle);
        
        CommonService.findByTitle('learners/search',{ limit, offset, sort, searchTitle })
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
    const handleDownloadPassword = (id) => {
        //console.log(id);
        
        setLoaderArr({ ...loaderArr, id: id });
        CommonService.getBlobById('exportLearner',id)
            .then((response) => {

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'learner-password-file.xlsx'); //or any other extension
                document.body.appendChild(link);
                link.click();
                setLoaderArr({ ...loaderArr, id: '' });              
                
            })
            .catch(e => {
                toast.error(e,{autoClose: false}); 
                setLoaderArr({ ...loaderArr, id: '' });    
            });
    }
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
            title: "Are you sure to archived?",
            text: "Once archived, learner will go to archived list!",
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
                <div className="col-md-12 col-12 learner_title"> <h4>Current Learner List</h4></div>
                <div className="col-md-8 col-8">
                    <div className="input-group-append align-items-center">
                        <span>Search : </span><input type="text" className="form-control col-4 search-field3" onChange={onChangeSearchTitle} />
                            <button className="addLearner" onClick={findByTitle} >Search</button>
                    </div>
                </div>
                <div className="col-md-4 col-4">
                    
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
                                        <td>
                                            <Link to={"/tutor/learner-details-result/"+learner.user_id} className="iconButton2"><i className="fa fa-tasks" aria-hidden="true" title="Progress"></i></Link>&nbsp;      
                                            &nbsp;
                                            <Link to={"/tutor/learner/assessment-list/" + learner.user_id} className="iconButton2">Assessment <i className="fa fa-angle-right"></i></Link>
                                            

                                            <button className="iconButton2" onClick={() => handleShowPassword(learner.user_id)}><span><i className="fa fa-address-book" title="View Password" aria-hidden="true"></i></span></button>
                                            
                                            {/* <button className="iconButton2" onClick={() => handleShowPassword(learner.id)}><span><i className="fa fa-address-book" aria-hidden="true"></i></span></button> */}

                                           
                                            
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
                    <Modal.Title id="example-modal-sizes-title-lg">
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

export default TutorLearnerLists;