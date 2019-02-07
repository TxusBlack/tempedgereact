import React, { Component } from 'react';
import { withLocalize, Translate } from 'react-localize-redux';
import engFlag from "./icons/united-kingdom.png"; // Tell Webpack this JS file uses this image
import spaFlag from "./icons/spain.png";

              //De-Structuring props
let NavBar = ({ languages, activeLanguage, setActiveLanguage }) => {
  let getClass = (languageCode) => {
    return languageCode === activeLanguage.code ? 'active' : ''
  };

  return(
    <nav className="navbar navbar-default">
      <div className="navbar-header">
        <button type="button" data-target="#navbarCollapse" data-toggle="collapse" className="navbar-toggle">
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
      </div>
      <div className="row">
        <div className="col-md-12 top-bar-part">
          <div className="container">
            <div className="row">
              <div className="col-md-10 language">
                <p><Translate id="com.tempedge.msg.label.language">Language</Translate>&nbsp;&nbsp;
                  {languages.map(lang => {
                    return(
                      <span key={ lang.code } className={getClass(lang.code)} onClick={() => setActiveLanguage(lang.code)}><img className="flag" src={(lang.code === 'en')? engFlag: spaFlag} />&nbsp;&nbsp;</span>
                    );
                  })}
                </p>
              </div>
              <div className="col-md-2">
                <a href="#" style={{color: "#fff"}}><span className="signInIcon"></span><p style={{padding: "8px 0 0 0"}}><Translate id="com.tempedge.msg.label.sign_in">Sign In</Translate></p></a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 bottom-bar-part">
          <div className="container">
            <div className="row">
              <div className="col-md-2 logo">
                <h2><span className="company-logo"></span> TempEdge</h2>
              </div>
              <div className="col-md-10">
              <div className="collapse navbar-collapse">
                <ul className="nav navbar-nav">
                  <li className="active"><a href="#"><Translate id="com.tempedge.msg.label.welcome">Welcome</Translate></a></li>
                  <li><a href="#"><Translate id="com.tempedge.msg.label.apply_now">Apply Now</Translate></a></li>
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

export default withLocalize(NavBar);
