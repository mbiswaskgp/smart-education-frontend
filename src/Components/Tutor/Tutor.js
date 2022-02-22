import React from 'react';
import { Switch, Route } from "react-router-dom";

import Banner from "../Layouts/Banner";
import Footer from "../Layouts/Footer";
import TutorHeader from "../Layouts/Tutor/TutorHeader";

import TutorDashboard from "./TutorDashboard";
import TutorChangePassword from "../Modules/Tutor/Profile/TutorChangePassword";
//assessment menu
import AssessmentListOfLearner from "../Modules/Tutor/Assessment/AssessmentListOfLearner";

import TutorAssessmentLists from "../Modules/Tutor/Assessment/TutorAssessmentLists";
import TutorLearnerAssessmentLists from "../Modules/Tutor/Assessment/TutorLearnerAssessmentLists";
//import TutorLearnerAssessmentDetails from "../Modules/Tutor/Assessment/TutorLearnerAssessmentDetails";
import TutorLearnerAssessmentAnswers from "../Modules/Tutor/Assessment/TutorLearnerAssessmentAnswers";
import TutorLearnerAssessmentResult from "../Modules/LearnerResult/ViewResult";
import TutorLearnerLists from "../Modules/Tutor/Learner/TutorLearnerLists";
import TutorLearnerDetails from "../Modules/Tutor/Learner/TutorLearnerDetails";
import LearnerDetails from "../Modules/Admin/AdminLearners/LearnerDetails";
import LearnerAssignAssessment from "../Modules/Tutor/Learner/LearnerAssignAssessment";
import TutorEditAssignAssessment from "../Modules/Tutor/Assessment/TutorEditAssignAssessment";

//learner assessment list
import LearnerAssessmentList from "../Modules/Tutor/Learner/LearnerAssessmentList";

import QuestionAnswerList from "../Modules/Admin/Assessments/QuestionAnswerList";
import QuestionAnswerPreview from "../Modules/Admin/Assessments/QuestionAnswerPreview";
import AssessmentDetails from "../Modules/Admin/Assessments/AssessmentDetails";

function Tutor(props) {

    return (
        <div>
            <TutorHeader/>
            <Banner/>
                <section className="question-management">
                    <div className="container">
                        <Route exact path={["/tutor","/tutor/dashboard"]}><TutorDashboard /></Route>
                        <Route exact path={"/tutor/change-password"}><TutorChangePassword /></Route>
                        
                        {/* assessment menu */}
                        <Route exact path={`/tutor/assessment-list`}><TutorAssessmentLists /></Route>
                        <Route exact path={`/tutor/assessment-list-of-learner/:assessmentId`} component={AssessmentListOfLearner}></Route>


                        <Route exact path="/tutor/learner-assessment-list/:id" component={TutorLearnerAssessmentLists}></Route>
                        <Route exact path="/tutor/learner-assessment-answers/:id/:id2" component={TutorLearnerAssessmentAnswers}></Route>
                        <Route exact path="/tutor/learner-assessment-result/:id/:id2" component={TutorLearnerAssessmentResult}></Route>
                    
                        <Route exact path="/tutor/learner-assessment-result/:id/:id2" component={TutorLearnerAssessmentResult}></Route>

                        <Route exact path={`/tutor/learner`}><TutorLearnerLists /></Route>
                        <Route exact path={`/tutor/learner-details-result/:id`} component={TutorLearnerDetails}></Route>

                        <Route exact path={`/tutor/learner-details/:id`} component={LearnerDetails}></Route>
                        <Route exact path="/admin/learner-details/:id" component={LearnerDetails}></Route>
                        <Route exact path={`/tutor/learner/assessment-list/:learnerId`} component={LearnerAssessmentList}></Route>

                        <Route exact path={`/tutor/assign-assessment/:id`} component={LearnerAssignAssessment}></Route>
                        <Route exact path="/tutor/learner/edit-assign-assessment/:learnerAssessmentId/:learnerId" component={TutorEditAssignAssessment}></Route>
                        <Route exact path={`/tutor/question-answer`}><QuestionAnswerList /></Route>
                        <Route exact path="/tutor/question-answer/preview/:id" component={QuestionAnswerPreview}></Route>

                        <Route exact path="/tutor/assessment-details/:id" component={AssessmentDetails}></Route> 
                        
                        {/* <Route exact path={["/tutor","/tutor/dashboard"]}><TutorDashboard /></Route>
                        <Route exact path={"/tutor/change-password"}><TutorChangePassword /></Route>
                        <Route exact path={`/tutor/assessment-list`}><TutorAssessmentLists /></Route>
                        <Route exact path="/tutor/learner-assessment-list/:id" component={TutorLearnerAssessmentLists}></Route>
                        <Route exact path="/tutor/learner-assessment-answers/:id/:id2" component={TutorLearnerAssessmentAnswers}></Route>
                        <Route exact path="/tutor/learner-assessment-result/:id/:id2" component={TutorLearnerAssessmentResult}></Route>
                    
                        <Route exact path={`/tutor/learner`}><TutorLearnerLists /></Route>
                        <Route exact path={`/tutor/learner-details/:id`} component={TutorLearnerDetails}></Route>
                        <Route exact path={`/tutor/assign-assessment/:id`} component={LearnerAssignAssessment}></Route>
                        <Route exact path="/tutor/learner/edit-assign-assessment/:id/:id2" component={TutorEditAssignAssessment}></Route>
                        <Route exact path={`/tutor/question-answer`}><QuestionAnswerList /></Route>
                        <Route exact path="/tutor/question-answer/preview/:id" component={QuestionAnswerPreview}></Route>

                        <Route exact path="/tutor/assessment-details/:id" component={AssessmentDetails}></Route> */}

                    </div>
                </section>
            <Footer/>            
        </div>
    );
}

export default Tutor;