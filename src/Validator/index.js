import { isEmpty, isEmail } from "./validations";

const loginValidate = data => {
    let errors = {};
    
    if (isEmpty(data.useremail)) {
        errors.useremail = "This field is required";
    }
    // else if (!isEmail(data.useremail)) {
    //     errors.useremail = "Enter valid email";
    // }

    if (isEmpty(data.userpassword)) {
        errors.userpassword = "This field is required";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

const createTutorValidate = data => {
    
    let errors = {};
    if (isEmpty(data.fname)) {
        errors.fname = "This field is required";
    }
    if (isEmpty(data.lname)) {
        errors.lname = "This field is required";
    }

    if (isEmpty(data.email)) {
        errors.email = "This field is required";
    }else if (!isEmail(data.email)) {
        errors.email = "Enter valid email";
    }
    
    if (isEmpty(data.contact_number)) {
        errors.contact_number = "This field is required";
    }
    
    if (data.subject_id[0]==null) {
        errors.subject_id = "This field is required";
    }
    
    if (data.level_id[0]==null) {
        errors.level_id = "This field is required";
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

const createLearnerValidate = data => {
    
    let errors = {};
    console.log(data);
    
    
    if (isEmpty(data.fname)) {
        errors.fname = "This field is required";
    }
    if (isEmpty(data.lname)) {
        errors.lname = "This field is required";
    }
    
    if (!isEmpty(data.learner_email) && !isEmail(data.learner_email)) {

        errors.learner_email = "Enter valid email";
    }
    if (!isEmpty(data.parent_email) && !isEmail(data.parent_email)) {

        errors.parent_email = "Enter valid email";
    }
    // if (isEmpty(data.email)) {
    //     errors.email = "This field is required";
    // }
    // else if (!isEmail(data.email)) {
    //     errors.email = "Enter valid email";
    // }
    // if (isEmpty(data.contact_number)) {
    //     errors.contact_number = "This field is required";
    // }
    



    // if (Array.isArray(data.level_id) && data.level_id.length==0) {
    //     errors.level_id = "This field is required";
    // }

    // if (isEmpty(data.parent_name)) {
    //     errors.parent_name = "This field is required";
    // }
    
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
const createPasswordValidate = data => {

    let errors = {};
    if (isEmpty(data.old_password)) {
        errors.old_password = "This field is required";
    }
    if (isEmpty(data.new_password)) {
        errors.new_password = "This field is required";
    }
    if (isEmpty(data.confirm_password)) {
        errors.confirm_password = "This field is required";
    }
    
    if (!isEmpty(data.new_password) && !isEmpty(data.confirm_password)) {
        if(data.new_password!=data.confirm_password){
            errors.confirm_password = "New and confirmed password mismatch"; 
        }
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

const createAssessmentValidate = data => {
    let errors = {};
    if (isEmpty(data.assessment_title)) {
        errors.assessment_title = "This field is required";
    }
    if (isEmpty(data.level_id)) {
        errors.level_id = "This field is required";
    }
    if (isEmpty(data.subject_id)) {
        errors.subject_id = "This field is required";
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

const assigneAssessmentLearnerValidate = data => {
    let errors = {};
    
    if (isEmpty(data.tutor_id)) {
        errors.tutor_id = "This field is required";
    }
    if (isEmpty(data.assessment_id)) {
        errors.assessment_id = "This field is required";
    }
    if (isEmpty(data.start_date)) {
        errors.start_date = "This field is required";
    }
    if (isEmpty(data.end_date)) {
        errors.end_date = "This field is required";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
}
const tutorAssigneAssessmentLearnerValidate = data => {
    let errors = {};
    
    if (isEmpty(data.assessment_id)) {
        errors.assessment_id = "This field is required";
    }
    if (isEmpty(data.start_date)) {
        errors.start_date = "This field is required";
    }
    if (isEmpty(data.end_date)) {
        errors.end_date = "This field is required";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
}

const createLearnerMarkValidate = data => {
    let errors = {};
    console.log(data);
    if (isEmpty(data.tutor_id)) {
        errors.tutor_id = "This field is required";
    }
    if (isEmpty(data.assessment_id)) {
        errors.assessment_id = "This field is required";
    }
    if (isEmpty(data.start_date)) {
        errors.start_date = "This field is required";
    }
    if (isEmpty(data.end_date)) {
        errors.end_date = "This field is required";
    }
    if (isEmpty(data.total_obtained_marks)) {
        errors.total_obtained_marks = "This field is required";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
}


export default {
    loginValidate,
    createTutorValidate,
    createLearnerValidate,
    createPasswordValidate,
    createAssessmentValidate,
    assigneAssessmentLearnerValidate,
    tutorAssigneAssessmentLearnerValidate,
    createLearnerMarkValidate
};
