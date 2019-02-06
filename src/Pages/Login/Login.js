import React, { Component } from 'react';

class Login extends Component{
  render(){
    console.log("LOGIN!");
    return(
      <div className="container-fluid login-container">
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <div className="login-form">
              <form method="post">
                  <h2 className="text-center">Log in</h2>
                  <div className="form-group">
                      <input type="text" className="form-control" placeholder="Username" required="required" />
                  </div>
                  <div className="form-group">
                      <input type="password" className="form-control" placeholder="Password" required="required" />
                  </div>
                  <div className="form-group">
                      <button type="submit" className="btn btn-primary btn-block">Log in</button>
                  </div>
                  <div className="clearfix">
                      <label className="pull-left checkbox-inline"><input type="checkbox" /> Remember me</label>
                      <a href="#" className="pull-right">Forgot Password?</a>
                  </div>
              </form>
              <p className="text-center"><a href="#">Create an Account</a></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
