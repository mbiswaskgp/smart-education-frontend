import React, { Component } from 'react';
import { Link  } from "react-router-dom";

import LevelService from "../../../../services/LevelService";
import CustomLoader from "../../../Common/CustomLoader";

class LevelAdd extends Component {
    constructor(props){
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.saveLevel    = this.saveLevel.bind(this);

        this.state = {
            id: null,
            name: "",
            error: {},
            loading: false,
            submitted: false,
            message:""
        };
    }
    onChangeName(e) {
        this.setState({
            name: e.target.value
        });
        //console.log(this.state.name);       
    }

    saveLevel() {
        this.setState({
            loading: true
        });
        //console.log(this.state.name);
        
        var data = {
            name: this.state.name,
        };

        if(data.name!=""){
            LevelService.create(data)
            .then(response => {
                if(response.data.success){
                    this.setState({
                        name: '',
                        loading: false,
                        submitted: true,
                        message: response.data.message
                    });
                    console.log(response.data);
                }                
            })
            .catch(e => {
                this.setState({
                    loading: false,
                    message: 'Error occured. Please try again'
                });
                console.log(e);
            });
        }else{
            this.setState({
                submitted: false,
                loading: false,
                error: {'name':'This field is reduired'},
                message: 'Error occured. Please try again'
            });
        }                
    }
    render() {
        return (
            <div className="row justify-content-center">
                <div className="col-md-9 col-12">
                    <div className="d-flex justify-content-center">
                        <div className="w-50">
                            {this.state.submitted ? (
                                <div>
                                    <h5>{this.state.message}</h5>                       
                                </div>
                            ) : ''}
                            <div className="greenHeading">
                                Add Level
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control textAra" value={this.state.name} name="name" placeholder="Enter Level Name" onChange={this.onChangeName} />
                                {(this.state.error)?
                                    <span className="errorMsg">{this.state.error.name}</span> :''
                                } 
                            </div>
                            <div className="text-right">
                                {(this.state.loading)?
                                    <CustomLoader height={50} width={20} />:
                                    <button className="addLearner" onClick={this.saveLevel}>Save</button>
                                }
                                &nbsp; 
                                <Link to="/admin/level" className="backBtn">Back</Link>
                            </div>
                        </div>                        
                    </div>
                </div>   
            </div>
        );
    }
}

export default LevelAdd;