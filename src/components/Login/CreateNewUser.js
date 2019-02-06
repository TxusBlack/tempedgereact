import React, { Component } from 'react';

class CreateNewUser extends Component{
  render(){
    return(
      <form className="form-horizontal center-block" style={{width: "40%", padding: "30px 0"}}>
        <div className="form-group has-success">
            <label className="col-xs-2 control-label">First Name (Required)</label>
            <div className="col-xs-10">
                <input type="text" id="firstName" className="form-control" placeholder="Input with success" />
                <span className="help-block">Username is available</span>
            </div>
        </div>
        <div className="form-group has-success">
            <label className="col-xs-2 control-label">Middle Name</label>
            <div className="col-xs-10">
                <input type="text" id="middleName" className="form-control" placeholder="Input with success" />
                <span className="help-block">Username is available</span>
            </div>
        </div>
        <div className="form-group has-success">
            <label className="col-xs-2 control-label">Last Name (Required)</label>
            <div className="col-xs-10">
                <input type="text" id="lastName" className="form-control" placeholder="Input with success" />
                <span className="help-block">Username is available</span>
            </div>
        </div>
        <div className="form-group has-error">
            <label className="col-xs-2 control-label">Email</label>
            <div className="col-xs-10">
                <input type="email" id="email" className="form-control" placeholder="Input with error" />
                <span className="help-block">Please enter a valid email address</span>
            </div>
        </div>
        <div className="form-group has-success">
            <label className="col-xs-2 control-label">Birthday</label>
            <div className="col-xs-10">
                <input type="date" id="birthday" className="form-control" placeholder="Input with success" />
                <span className="help-block">Username is available</span>
            </div>
        </div>
        <div className="form-group">
            <div className="col-md-6 col-md-offset-3">
                <button type="submit" className="btn btn-primary btn-block" style={{width: "30%", margin: "0 auto"}}>Save</button>
            </div>
        </div>
    </form>
    );
  }
}

export default CreateNewUser;
