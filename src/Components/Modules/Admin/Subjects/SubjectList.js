import React, { useState, useEffect } from "react";
import { Link  } from "react-router-dom";

import SubjetcService from "../../../../services/SubjetcService";

import CustomLoader from "../../../Common/CustomLoader";

const SubjectList = () => {

    const [subjects, setSubjects] = useState([]);
    const [currentSubject, setCurrentSubject] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [searchTitle, setSearchTitle] = useState("");
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        retrieveAllSubjects();
    }, []);
    
    const retrieveAllSubjects = () => {
        setLoader(true);
        SubjetcService.getAll()
        .then(response => {
            setSubjects(response.data.data.subjects);
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
    };

    const findByTitle = () => {
        var data = {
            title: searchTitle,
        };
        //console.log(data);
        SubjetcService.findByTitle(data)
            .then(response => {
                setSubjects(response.data.data.subjects);
                //console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const deleteSubject = (name, index) => {
        // console.log(name);
        // console.log(index);
        
        SubjetcService.remove(index)
        .then(response => {
            console.log(response.data);
            retrieveAllSubjects();
        })
        .catch(e => {
            console.log(e);
        });
    }
    
    return (
        <div>
            <div className="subject-srch-wrap d-flex justify-content-between align-items-center mb-4">
                <div className="input-group-append align-items-center">
                    Search : <input type="text" className="form-control col-6 search-field3" placeholder="Subject name" value={searchTitle}
                    onChange={onChangeSearchTitle} />
                    <button className="addLearner" onClick={findByTitle}>Search</button>
                </div>
                <Link to="/admin/subject/add" className="detailsSection"> Add Subject <i className="fa fa-angle-right"></i>
                </Link>
            </div>

            <table className="table table-borderd learner_table">
                <thead>
                    <tr>
                    <th colSpan="2">Subject List</th>                  
                    </tr>
                </thead>
                <tbody>
                {subjects &&
                    subjects.map((subject, index) => (
                    <tr key={subject.id}>
                        <td>{subject.name}</td>                  
                        <td>
                            <Link to={"/admin/subject/edit/" + subject.id} className="detailsSection mr-2">Edit <i className="fa fa-angle-right"></i></Link>
                            <Link to={"/admin/subject/"} className="detailsSection" onClick={() => deleteSubject(subject.name, subject.id)}>Delete <i className="fa fa-angle-right"></i></Link>
                        </td>
                    </tr>
                ))}
                    
            </tbody>            
            </table>
            {(loader)?
                <CustomLoader />:''
            }
               
        </div>
    );
};

export default SubjectList;