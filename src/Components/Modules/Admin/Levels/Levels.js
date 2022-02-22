import React, { Component } from 'react';
import { Link  } from "react-router-dom";

import LevelService from "../../../../services/LevelService";
import CustomLoader from "../../../Common/CustomLoader";

class Levels extends Component {
    constructor(props) {
        super(props);

        this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
        this.retrieveLevels      = this.retrieveLevels.bind(this);        
        this.findByTitle         = this.findByTitle.bind(this);
        this.deleteLevel         = this.deleteLevel.bind(this);

        this.state = {
            loading: true,
            levels: [],
            currentLevels: -1,
            searchTitle: ""
        };
    }
    componentDidMount() {
        this.retrieveLevels();
    }
    onChangeSearchTitle(e){
        this.setState({searchTitle: e.target.value});
    }
    retrieveLevels() {
        LevelService.getAll()
        .then(response => {
            if(response.data.success){
                this.setState({
                    levels: response.data.data.levels,
                    loading: false
                });
                console.log(response.data);
            }else{
                console.log(response.data);
            }
        })
        .catch(e => {
            console.log(e);
        });
    }
    findByTitle(){
        var data = {
            name: this.state.searchTitle,
        };
        //console.log('-----------------');
        LevelService.findByTitle(data)
            .then(response => {
                if(response.data.success){
                    this.setState({
                        levels:response.data.data.levels
                    });
                }
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };
    deleteLevel(id){
        // 
        console.log(id);
        LevelService.removeData(id)
        .then(response => {
            console.log(response.data);
            this.setState({
                levels:response.data.data.levels
            });     
        })
        .catch(e => {
            console.log(e);
        });
    }    
    
    render() {
        const { levels,loading,searchTitle } = this.state;
        return (
            <div>
            
                <div className="subject-srch-wrap d-flex justify-content-between align-items-center mb-4">          
                    
                    {/* search box */}
                    <div className="input-group-append align-items-center">
                        Search : <input type="text" className="form-control col-6 search-field3" placeholder="Level Name" value={searchTitle} onChange={this.onChangeSearchTitle} />
                        <button className="addLearner" onClick={this.findByTitle} >Search</button>                        
                    </div>
                    <Link to="/admin/level/add" className="detailsSection"> Add New Level <i className="fa fa-angle-right"></i></Link>
                </div>
                <table className="table table-borderd learner_table">
                    <thead>
                        <tr>
                            <th colSpan="2">Level List</th>                  
                        </tr>                        
                    </thead>
                    <tbody>                    
                    {levels &&
                    levels.map((level, index) => (
                        <tr key={level.id}>
                            <td>{level.name}</td>                  
                            <td>
                                <Link to={"/admin/level/edit/" + level.id} className="detailsSection">Edit <i className="fa fa-angle-right"></i></Link>
                            
                                <button className="deleteBtn" onClick={() => this.deleteLevel(level.id)} >delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>            
                </table>  
                {(loading) ?
                    (
                    <CustomLoader />
                    )                        
                :''} 
            </div>
    
        );
    }
}

export default Levels;