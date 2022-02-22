import React from 'react';
import { Switch, Route } from "react-router-dom";

import LearnerDashboard from "./LearnerDashboard";
import LearnerExam from "./LearnerExam";
import LearnerMessage from "./LearnerMessage";
import CompletedAssessments from "./CompletedAssessments";

function Learner(props) {

    return (
        <div>
                <Route exact path={["/learner","/learner/dashboard"]}><LearnerDashboard /></Route>
                <Route exact path={"/learner/exam/:id"} component={LearnerExam}></Route>
                <Route exact path={"/learner/message/:msgId"} component={LearnerMessage}></Route>
                <Route exact path={"/learner/completed-assessments"}><CompletedAssessments /></Route>
        </div>
    );
}

export default Learner;