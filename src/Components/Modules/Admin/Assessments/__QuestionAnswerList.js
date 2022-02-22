import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Pagination from 'react-js-pagination';
import CustomLoader from "../../Common/CustomLoader";
import CommonService from "../../../services/CommonService";
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import user_varible from '../../Utils/Utils';
import { changeCurrentPage } from "../../../store/actions/nav";
import './Assessments.css';


const QuestionAnswerList = () => {
  const itemNumber = user_varible.paagingnation_numberOfItems;
  const dispatch                            = useDispatch();
  const [data, setData]                     = useState([]);
  const [loader, setLoader]                 = useState(false);
  const [totalRecords, setTotalRecords]     = useState(0);
  const [activePage, setActivePage]         = useState(1);
  const [allSubjects, setAllSubjects]       = useState([]);
  const [itemShowNumber, setItemShowNumber] = useState(itemNumber);
  const [allLevels, setAllLevels]           = useState([]);
  const [limit, setLimit]                   = useState(10);
  const [offset, setOffset]                 = useState(0);
  const [sort, setSort] = useState({
    field: 'question_name',
    order: 'asc'
  });

  useEffect(() => {
    retrieveAllAssessments(limit, offset, sort);
    getAllSubject();
    getAlllevel();
    dispatch(changeCurrentPage('adminAssessment'));
  }, []);
  const retrieveAllAssessments = (limit, offset, sort) => {
    setLoader(true);
    CommonService.create('questionAnswer/search', { limit, offset, sort })
      .then(response => {
        const questionList = response.data.data.questionAnswers.data;
        setTotalRecords(response.data.data.total);
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
        console.log('sgdjtrjtj', response.data.data);
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
  console.log(sort);
  return (
    <div>
      <div className="col-lg-12">

        <div className="greenHeading text-left">
          QUICK SEARCH FOR EXISTING QUESTIONS
          </div>

        <Form className="d-block">
          <div className="d-flex align-items-center search_exising_questing">
            <div className="search_By_Subject">
              <Form.Group as={Col} controlId="formSubject">
                <Form.Control as="select" className="" defaultValue="Choose...">
                  <option>Subject</option>
                  {
                    allSubjects.map((subject, index) => {
                      return <option key={index} value={subject.id}>{subject.name}</option>;
                    })
                  }

                </Form.Control>
              </Form.Group>
            </div>

            <div className="search_By_level">
              <Form.Group as={Col} controlId="formLevels">
                <Form.Control as="select" className="" defaultValue="Choose...">
                  <option>Level</option>
                  {
                    allLevels.map((level, index) => {
                      return <option key={index} value={level.id}>{level.name}</option>;
                    })
                  }
                </Form.Control>
              </Form.Group>
            </div>
            <button type="submit" className="redBtn">FIND</button>

          </div>
        </Form>
        <div className="existingQuestions mt-3 mb-3">
          <div className="existingheading">EXISTING QUESTIONS</div>
          <div className="col-lg-10 col-10">

          </div>
          <div className="col-lg-2 col-2 p-0">
            <Link to="/admin/question-answer/add" className="detailsSection float-right"> Add Question Answer <i className="fa fa-plus-circle"></i></Link>
          </div>
          <div className="col-lg-12 p-0 mt-3">
            <div className="table-responsive-md ">
              <table className="table table-striped table-borderd learner_table table-sm" cellSpacing="0" width="100%">
                <thead>
                  <tr>
                    <th onClick={onSortingColumn.bind(this, 'question_name')}>Question Title
                    {sort.order === 'asc' && sort.field === 'question_name' && <i className="fa fa-sort-asc ml-3" aria-hidden="true"></i>}
                      {sort.order === 'desc' && sort.field === 'question_name' && <i className="fa fa-sort-desc ml-3" aria-hidden="true"></i>}
                    </th>
                    <th onClick={onSortingColumn.bind(this, 'subject_name')}>Subject
                    {sort.order === 'asc' && sort.field === 'subject_name' && <i className="fa fa-sort-asc ml-3" aria-hidden="true"></i>}
                      {sort.order === 'desc' && sort.field === 'subject_name' && <i className="fa fa-sort-desc ml-3" aria-hidden="true"></i>}
                    </th>
                    <th onClick={onSortingColumn.bind(this, 'level_name')}>Level
                    {sort.order === 'asc' && sort.field === 'level_name' && <i className="fa fa-sort-asc ml-3" aria-hidden="true"></i>}
                      {sort.order === 'desc' && sort.field === 'level_name' && <i className="fa fa-sort-desc ml-3" aria-hidden="true"></i>}
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  { data.map((question, index) => (
                      <tr key={index}>
                        <td>{question.question_name}</td>
                        <td>{question.subject_name}</td>
                        <td>{question.level_name}</td>
                        <td>
                          <Link to={"/admin/question-answer/edit/" + question.id} className="detailsSection">Details <i className="fa fa-angle-right"></i></Link>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              {(loader) ?
                <CustomLoader /> : ''
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

              <div className="form-group column column2">
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