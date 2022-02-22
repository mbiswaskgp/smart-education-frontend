import React from 'react';
import { useSelector } from "react-redux";
import { Router, Switch, Route } from "react-router-dom";
import './App.css';
import Admin from './Components/Admin/Admin';
import Tutor from './Components/Tutor/Tutor';
import Learner from './Components/Learner/Learner';

import Login from "./Components/Auth/Login";

import { AdminRoute } from "./Components/Common/AdminRoute";
import { TutorRoute } from "./Components/Common/TutorRoute";
import { LearnerRoute } from "./Components/Common/LearnerRoute";

import { ToastContainer } from 'react-toastify';

import { history } from './helpers/history';
const App = () => {
  //const { isLoggedIn,userRoleData } = useSelector(state => state.auth);

  return (
    <div className="App" id="wrapper">
      <ToastContainer />
      <Router history={history}>
        <Switch>   
          <AdminRoute path="/admin">
            <Admin />
          </AdminRoute>
          <TutorRoute path="/tutor">
            <Tutor />
          </TutorRoute>
          <LearnerRoute path="/learner">
            <Learner />
          </LearnerRoute>
          <Route path={["/","/login"]}><Login /></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
