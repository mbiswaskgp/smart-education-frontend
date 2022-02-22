import React from "react";
import { Link  } from "react-router-dom";

import SubjectList from "./SubjectList";

const Subjects = () => {
  
  return (
      <div className="row justify-content-center">
      <div className="col-md-9 col-12">
        <div className="table-responsive-md">
          
          <SubjectList />
        </div>
      </div>   
    </div>
  );
};

export default Subjects;