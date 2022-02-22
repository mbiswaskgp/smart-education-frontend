import React from 'react';
import { useSelector } from "react-redux";
import banner from '../../assets/img/banner.jpg';

const Banner = () => {
    const { currentNav } = useSelector(state => state.nav);
    let bannerMsg = "";
    if(currentNav=='adminDashboard'){
        bannerMsg = "SMART EDUCATION ASSESSMENT CENTRE DASHBOARD";
    }else if(currentNav=='adminLearner'){
        bannerMsg = "LEARNER MANAGEMENT";
    }else if(currentNav=='adminTutor'){
        bannerMsg = "TUTOR MANAGEMENT";
    }else if(currentNav=='adminAssessment'){
        bannerMsg = "ASSESSMENT MANAGEMENT";
    }else if(currentNav=='adminAssessmentDetails'){
        bannerMsg = "INDIVIDUAL ASSESSMENT MANAGEMENT";
    }else if(currentNav=='adminQuestionList'){
        bannerMsg = "QUESTION MANAGEMENT";
    }else if(currentNav=='login'){
        bannerMsg = "SMART EDUCATION ASSESSMENT CENTRE";
    }else{
        bannerMsg = "SMART EDUCATION ASSESSMENT CENTRE";
    }
    return (
        <div>
            <section className="banner_sec">
                <img src={banner} alt=""/>
                <div className="banner_text">                
                    <h2>{bannerMsg}</h2>
                </div>                
            </section>
        </div>
    );
}

export default Banner;