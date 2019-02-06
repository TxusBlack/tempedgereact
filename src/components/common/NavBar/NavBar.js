import React, { Component } from 'react';

class NavBar extends Component{
  render(){
    return(
      <nav className="navbar navbar-default" style={{boxShadow: "0 8px 6px 0 #aaa"}}>
            <div className="navbar-header">
                <button type="button" data-target="#navbarCollapse" data-toggle="collapse" className="navbar-toggle">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
            </div>
            <div className="row">
              <div className="col-md-12" style={{background: "#1273c7", color: "#fff"}}>
                <div className="container" style={{padding: 0, width:"90%"}}>
                  <div className="row">
                    <div className="col-md-10">
                      <p style={{padding: "8px 0 3px 0"}}>Language <span className="flag"></span>&nbsp;<span className="flag"></span></p>
                    </div>
                    <div className="col-md-2">
                      <a href="#" style={{color: "#fff"}}><span className="signInIcon"></span><p style={{padding: "8px 0 0 0"}}>Sign In</p></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12" style={{background: "#f4f4f4", color: "#000"}}>
                <div className="container" style={{padding: 0, width:"90%"}}>
                  <div className="row">
                    <div className="col-md-2">
                      <h2 style={{padding: 10}}><span className="company-logo"></span> TempEdge</h2>
                    </div>
                    <div className="col-md-10">
                    <div className="collapse navbar-collapse">
                      <ul className="nav navbar-nav">
                        <li className="active"><a href="#">Welcome</a></li>
                        <li><a href="#">Apply Now</a></li>
                      </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </nav>
    )
  }
}

export default NavBar;
