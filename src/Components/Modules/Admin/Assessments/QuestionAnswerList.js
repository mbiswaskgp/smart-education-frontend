  import React, { useState, useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import Pagination from 'react-js-pagination';
  import CustomLoader from "../../../Common/CustomLoader";
  import CommonService from "../../../../services/CommonService";
  import { changeCurrentPage } from "../../../../store/actions/nav";
  import { Link } from "react-router-dom";
  import Form from 'react-bootstrap/Form';
  // import Col from 'react-bootstrap/Col';
  // import user_varible from '../../../Utils/Utils';
  import './Assessments.css';

  const QuestionAnswerList = () => {
  //const itemNumber = user_varible.paagingnation_numberOfItems;
  const dispatch                    = useDispatch();
  const [data, setData]             = useState([]);
  const [loader, setLoader]         = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [activePage, setActivePage]     = useState(0);
  const [allSubjects, setAllSubjects]   = useState([]);
  const [formData, setFormData]         = useState([]);

  //const [itemShowNumber, setItemShowNumber] = useState(itemNumber);
  const [allLevels, setAllLevels]       = useState([]);
  const [limit, setLimit]               = useState(10);
  const [offset, setOffset]             = useState(0);
  const [sort, setSort]                 = useState({
                                            field: 'id',
                                            order: 'desc'
                                          });
  const { isLoggedIn,userRoleData } = useSelector(state => state.auth);
  useEffect(() => {
    retrieveAllAssessments(limit, offset, sort);
    getAllSubject();
    getAlllevel();
    setActivePage(1);
    dispatch(changeCurrentPage('adminQuestionList'));
    console.log(userRoleData);
  }, []);
  const retrieveAllAssessments = (limit, offset, sort) => {
    setLoader(true);
    var pageData = {
      limit: limit,
      offset: offset,
      sort: sort,
      formData: formData
    }
    CommonService.create('questionAnswer/search', pageData)
      .then(response => {
        const questionList = response.data.data.questionAnswers.data;
        setTotalRecords(response.data.data.total);
        console.log(response.data.data);
        setData(questionList);
        setLoader(false);
      })
      .catch(e => {
        console.log(e);
        setLoader(false);
      });
  }

  const getAllSubject = () => {
    CommonService.getAll('subjects')
      .then(response => {
        //console.log('sgdjtrjtj', response.data.data);
        setAllSubjects(response.data.data.subjects);

      })
      .catch(e => {
        console.log(e);
      });
  }

  const onSortingColumn = (e, key) => {
    let order = '';
    if (sort.field === e) {
      if (sort.order === 'asc') {
        order = 'desc';
      } else if (sort.order === 'desc') {
        order = '';
      } else {
        order = 'asc';
      }
    } else {
      order = 'asc';
    }
    setSort({ field: e, order: order });
    retrieveAllAssessments(limit, offset, { field: e, order: order });
  }

  const getAlllevel = () => {
    CommonService.getAll('levels')
      .then(response => {
        setAllLevels(response.data.data.levels);
        console.log(response.data.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  const handleItemNumber = e => {
    setLimit(parseInt(e.target.value, 10))
    setOffset(0);
    retrieveAllAssessments(parseInt(e.target.value, 10), 0, sort);
    onPageChanged(1, parseInt(e.target.value, 10));
  }

  const onPageChanged = (page, limitParam) => {
    const limitData = limitParam ? limitParam : limit;
    const pageOffset = (page - 1) * limitData;
    setOffset(pageOffset);
    setLimit(limitData);
    setActivePage(page);
    if (!limitParam) retrieveAllAssessments(limitData, pageOffset, sort);
  }

  const handleChange = event => {
    let { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmitForm = (e) =>{
    e.preventDefault();
    retrieveAllAssessments(10, 0,  { field: 'id', order: 'desc' });
  }
 
  console.log(sort);
  return (
    <div>
        {(userRoleData===1)?
        <div className="col-lg-12 mb-3 text-right">
          <Link to="/admin/question-answer/add" className="detailsSection"> Add Question Answer <i className="fa fa-plus-circle"></i></Link>
        
        </div>
        :''
        }
            
      <div className="col-lg-12">

        <div className="greenHeading text-left">
          QUICK SEARCH FOR EXISTING QUESTIONS
        </div>

        <Form className="d-block" onSubmit={handleSubmitForm}>
          <div className="row align-items-center search_exising_questing">
            <div className="col-md-5 search_By_Subject">
              <Form.Group controlId="formSubject" className="mb-0">
                <Form.Control as="select" className="" name="subject_id" defaultValue="Subject" onChange={handleChange}> 
                  <option>Subject</option>
                  {
                    allSubjects.map((subject, index) => {
                      return <option key={index} value={subject.id}>{subject.name}</option>;
                    })
                  }

                </Form.Control>
              </Form.Group>
            </div>

            <div className="col-md-5 ">
              <Form.Group controlId="formLevels" className="mb-0">
                <Form.Control as="select" className="" name="level_id" defaultValue="Level" onChange={handleChange}>
                  <option>Level</option>
                  {
                    allLevels.map((level, index) => {
                      return <option key={index} value={level.id}>{level.name}</option>;
                    })
                  }
                </Form.Control>
              </Form.Group>
            </div>
            <div className="col-md-2">
            <button type="submit" className="redBtn2">FIND</button>
            </div>
            

          </div>
        </Form>
        <div className="existingQuestions mt-3 mb-3">
          <div className="existingheading">EXISTING QUESTIONS</div>
          <div className="col-lg-10 col-10">

          </div>
          
          <div className="col-lg-12 p-0 mt-3">
            <div className="table-responsive-md ">
            {(loader) ?
                <CustomLoader /> : 
              <table className="table table-striped table-borderd learner_table table-sm" cellSpacing="0" width="100%">
                <thead>
                  <tr>
                    <th onClick={onSortingColumn.bind(this, 'question_name')}>Question Title
                    {sort.order === 'asc' && sort.field === 'question_name' && <i className="fa fa-sort-asc ml-3" aria-hidden="true"></i>}
                      {sort.order === 'desc' && sort.field === 'question_name' && <i className="fa fa-sort-desc ml-3" aria-hidden="true"></i>}
                    </th>
                    {/* <th onClick={onSortingColumn.bind(this, 'subject_name')}>Subject
                    {sort.order === 'asc' && sort.field === 'subject_name' && <i className="fa fa-sort-asc ml-3" aria-hidden="true"></i>}
                      {sort.order === 'desc' && sort.field === 'subject_name' && <i className="fa fa-sort-desc ml-3" aria-hidden="true"></i>}
                    </th>
                    <th onClick={onSortingColumn.bind(this, 'level_name')}>Level
                    {sort.order === 'asc' && sort.field === 'level_name' && <i className="fa fa-sort-asc ml-3" aria-hidden="true"></i>}
                      {sort.order === 'desc' && sort.field === 'level_name' && <i className="fa fa-sort-desc ml-3" aria-hidden="true"></i>}
                    </th> */}
                    <th>Subject</th>
                    <th>Level</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((question, index) => (
                    <tr key={index}>
                      <td>{question.question_name}</td>
                      <td>{question.subject_name}</td>
                      <td>{question.level_name}</td>
                      <td>
                      {(userRoleData===1)?
                        <Link to={"/admin/question-answer/edit/" + question.id} className="detailsSection">Details <i className="fa fa-angle-right"></i></Link>:''}
                        {(userRoleData===1)?
                        <Link to={"/admin/question-answer/preview/" + question.id} className="detailsSection">Preview <i className="fa fa-angle-right"></i></Link>
                        :<Link to={"/tutor/question-answer/preview/" + question.id} className="detailsSection">Preview <i className="fa fa-angle-right"></i></Link>
                        }
                      </td>
                    </tr>
                  ))

                  }
                </tbody>
              </table>
            }  
            </div>
            <div className="rows">
              <div className="column">
                <Pagination
                  activePage={parseInt(activePage)}
                  itemsCountPerPage={parseInt(limit)}
                  totalItemsCount={totalRecords}
                  pageRangeDisplayed={5}
                  onChange={(e) => onPageChanged(e)}
                  itemclassName="page-item "
                  linkclassName="page-link"
                />
              </div>

              <div className=" column column2 mt-0">
                <select name="totalItem" id="" onChange={handleItemNumber} className="form-control textAra">
                  <option>Show Me</option>
                  <option value="10">10</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionAnswerList;