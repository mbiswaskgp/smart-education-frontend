import React from 'react';
import { Route } from "react-router-dom";

import Banner from "../Layouts/Banner";
import Footer from "../Layouts/Footer";
import AdminHeader from "../Layouts/Admin/AdminHeader";

import LearnerDetails from "../Modules/Admin/AdminLearners/LearnerDetails";

import AdminDashboard from "./AdminDashboard";
import Subjects from "../Modules/Admin/Subjects/Subjects";
import SubjectForm from "../Modules/Admin/Subjects/SubjectForm";
import SubjectEdit from "../Modules/Admin/Subjects/SubjectEdit";

import Levels from "../Modules/Admin/Levels/Levels";
import LevelEdit from "../Modules/Admin/Levels/LevelEdit";
import LevelAdd from "../Modules/Admin/Levels/LevelAdd";

import TutorList from "../Modules/Admin/Tutors/TutorList";
import TutorInactiveList from "../Modules/Admin/Tutors/TutorInactiveList";
import TutorAdd from "../Modules/Admin/Tutors/TutorAdd";
import TutorEdit from "../Modules/Admin/Tutors/TutorEdit";
import AssignLearner from "../Modules/Admin/Tutors/AssignLearner";
import AssignLearnerList from "../Modules/Admin/Tutors/AssignLearnerList";
import TutorAssignAssessment from "../Modules/Admin/Tutors/TutorAssignAssessment";
import TutorAssessmentDetails from "../Modules/Admin/Tutors/TutorAssessmentDetails";
import MonitorResults from "../Modules/Admin/Tutors/MonitorResults";

import LearnerList from "../Modules/Admin/AdminLearners/LearnerList";
import ArchivedLearnerList from "../Modules/Admin/AdminLearners/ArchivedLearnerList";

import LearnerAdd from "../Modules/Admin/AdminLearners/LearnerAdd";
import LearnerEdit from "../Modules/Admin/AdminLearners/LearnerEdit";
import LearnerAddMarks from "../Modules/Admin/AdminLearners/LearnerAddMarks";
import LearnerAssignAssessmentDetailsList from "../Modules/Admin/AdminLearners/LearnerAssignAssessmentDetailsList";

import AssignAssessment from "../Modules/Admin/AdminLearners/AssignAssessment";
import AssignAssessmentList from "../Modules/Admin/AdminLearners/AssignAssessmentList";
import EditAssignAssessment from "../Modules/Admin/AdminLearners/EditAssignAssessment";
import LearnerDownloadPassword from "../Modules/Admin/AdminLearners/LearnerDownloadPassword";
import AssignAssessmenDetailstList from "../Modules/Admin/AdminLearners/AssignAssessmenDetailstList";
import TutorLearnerAssessmentAnswers from "../Modules/Tutor/Assessment/TutorLearnerAssessmentAnswers";

import QuestionAnswerList from "../Modules/Admin/Assessments/QuestionAnswerList";
import QuestionAnswerAdd from "../Modules/Admin/Assessments/QuestionAnswerAdd";
import QuestionAnswerPreview from "../Modules/Admin/Assessments/QuestionAnswerPreview";

import QuestionAnswerAdd1 from "../Modules/Admin/Assessments/QuestionAnswerAdd1";
import QuestionAnswerTest from "../Modules/Admin/Assessments/QuestionAnswerTest";

import AssessmentList from "../Modules/Admin/Assessments/AssessmentList";
import AssessmentDetails from "../Modules/Admin/Assessments/AssessmentDetails";
import AssessmentPreview from "../Modules/Admin/Assessments/AssessmentPreview";
import AssessmentResultList from "../Modules/Admin/Assessments/AssessmentResultList";

import TutorLearnerAssessmentResult from "../Modules/LearnerResult/ViewResult";

import AdminChangePassword from "../Modules/Admin/ChangePassword/AdminChangePassword";

import AdminTest from "../Modules/Admin/AdminTest";

function Admin(props) {

    return (
        <div>
            <AdminHeader/>
            <Banner/>
                <section className="question-management">
                    <div className="container">                       

                        <Route exact path={["/admin","/admin/dashboard"]}><AdminDashboard /></Route>

                        <Route exact path="/admin/learner-details/:id" component={LearnerDetails}></Route>

                        {/* subject */}
                        <Route exact path={`/admin/subject`}><Subjects /></Route>
                        <Route exact path={`/admin/subject/add`}><SubjectForm /></Route>
                        <Route exact path="/admin/subject/edit/:id" component={SubjectEdit}></Route>

                        {/* level */}
                        <Route exact path={`/admin/level`}><Levels /></Route>
                        <Route exact path={`/admin/level/add`}><LevelAdd /></Route>
                        <Route exact path="/admin/Level/edit/:id" component={LevelEdit}></Route>

                        <Route exact path="/admin/test"><AdminTest /></Route>

                        {/* tutor */}
                        <Route exact path={`/admin/tutor`}><TutorList /></Route>
                        <Route exact path={`/admin/tutor/inactive`}><TutorInactiveList /></Route>
                        <Route exact path={`/admin/tutor/add`}><TutorAdd /></Route>
                        <Route exact path="/admin/tutor/edit/:id" component={TutorEdit}></Route>
                        <Route exact path="/admin/tutor/assign-learner/:id" component={AssignLearner}></Route>
                        <Route exact path="/admin/tutor/assign-learner-list/:id" component={AssignLearnerList}></Route>
                        <Route exact path="/admin/tutor/assign-assessment-list/:id" component={TutorAssignAssessment}></Route>
                        <Route exact path="/admin/tutor/assessment-details/:id" component={TutorAssessmentDetails}></Route>
                        <Route exact path="/admin/tutor/assessment-monitor-results/:assessmentId/:tutorId" component={MonitorResults}></Route>
                        
                        {/* learner */}
                        <Route exact path={`/admin/learner`}><LearnerList /></Route>
                        <Route exact path={`/admin/archived-learner`}><ArchivedLearnerList /></Route>
                        <Route exact path={`/admin/learner/add`}><LearnerAdd /></Route>
                        <Route exact path="/admin/learner/edit/:id" component={LearnerEdit}></Route>
                        <Route exact path="/admin/learner/assign-assessment-list/:id" component={AssignAssessmentList}></Route>
                        <Route exact path="/admin/learner/assessment-details-list/:learnerId/:assesmentId" component={LearnerAssignAssessmentDetailsList}></Route>

                        <Route exact path="/admin/learner-assessment-answers/:id/:id2" component={TutorLearnerAssessmentAnswers}></Route>

                        <Route exact path="/admin/learner/assign-assessment/:id" component={AssignAssessment}></Route>
                        <Route exact path="/admin/learner/edit-assign-assessment/:id/:id2" component={EditAssignAssessment}></Route>
                        <Route exact path="/admin/learner/download-password/:id/:id2" component={LearnerDownloadPassword}></Route>
                        <Route exact path="/admin/learner/assign-assessment-details-list/:id/:id2" component={AssignAssessmenDetailstList}></Route>
                        <Route exact path="/admin/learner/add-marks/:id" component={LearnerAddMarks}></Route>

                        {/* Questions */}
                        <Route exact path={`/admin/question-answer`}><QuestionAnswerList /></Route>
                        <Route exact path={`/admin/question-answer/add`}><QuestionAnswerAdd /></Route>
                        <Route exact path="/admin/question-answer/edit/:id" component={QuestionAnswerAdd}></Route>
                        <Route exact path="/admin/question-answer/test" component={QuestionAnswerTest}></Route>
                        <Route exact path="/admin/question-answer/preview/:id" component={QuestionAnswerPreview}></Route>

                        <Route exact path={`/admin/question-answer1/add`}><QuestionAnswerAdd1 /></Route>
                        <Route exact path="/admin/question-answer1/edit/:id" component={QuestionAnswerAdd1}></Route>

                        <Route exact path="/admin/assessment-list" component={AssessmentList}></Route>
                        <Route exact path="/admin/assessment-details/:id" component={AssessmentDetails}></Route>
                        <Route exact path="/admin/assessment-preview/:id" component={AssessmentPreview}></Route>
                        <Route exact path="/admin/assessment-result-list/:id" component={AssessmentResultList}></Route>

                        {/* <Route exact path="/admin/question-answer/edit/:id" component={AssessmentAdd}></Route> */}
                    
                        <Route exact path="/admin/learner-assessment-result/:id/:id2" component={TutorLearnerAssessmentResult}></Route>

                        <Route exact path={`/admin/change-password`}><AdminChangePassword /></Route>
                    </div>
                </section>
            <Footer/>            
        </div>
    );
}

export default Admin;