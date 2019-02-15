import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withLocalize, Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import engFlag from "./icons/united-kingdom.png"; // Tell Webpack this JS file uses this image
import spaFlag from "./icons/spain.png";

              //De-Structuring props
class NavBar extends React.Component{
  constructor(props){
    super(props);
  }

  changeActiveLang = (language) => {
    console.log("language: ",language);
    this.props.setActiveLanguage(language);
  }

  checkMenuItemActive= (activeMenuItem) => {
    if(typeof this.props.activePage !== 'undefined' || this.props.activePage != ""){
      if(this.props.activePage === 'login'){
        activeMenuItem[0] = 'active';
        activeMenuItem[1] = '';
      }else if(this.props.activePage === 'register'){
        activeMenuItem[0] = '';
        activeMenuItem[1] = 'active';
      }
    }
  }

  render(){
    let { languages, activeLanguage, lang } = this.props;
    let loginRoute = `/login/${lang}`;
    let registerRoute = `/register/${lang}`;
    let activeMenuItem = ['active', ''];

    this.checkMenuItemActive(activeMenuItem);

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
                        <span key={ lang.code } onClick={() => this.changeActiveLang(lang.code)}><img className="flag" src={(lang.code === 'en')? engFlag: spaFlag} />&nbsp;&nbsp;</span>
                      );
                    })}
                  </p>
                </div>
                <div className="col-md-2">
                  <Link className="sign-in" to={loginRoute} style={{color: "#fff"}}><span className="signInIcon"></span><p style={{padding: "8px 0 0 0"}}><Translate id="com.tempedge.msg.label.sign_in">Sign In</Translate></p></Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 bottom-bar-part">
            <div className="container">
              <div className="row">
                <div className="col-md-2 logo">
                  <img className="company-logo" src="./img/Temp_Edge_250-80.png" />
                </div>
                <div className="col-md-10">
                <div className="collapse navbar-collapse menu">
                  <ul className="nav navbar-nav menu-ul">
                    <li className={activeMenuItem[0]}><Link to={loginRoute}><Translate id="com.tempedge.msg.label.welcome">Welcome</Translate></Link></li>
                    <li className={activeMenuItem[1]}><Link to={registerRoute}><Translate id="com.tempedge.msg.label.apply_now">Apply Now</Translate></Link></li>
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

                      //Current REDUX state
let mapStateToProps = (state) => {
  return({
    activePage: state.tempEdge.active_page
  });
}

export default withLocalize(connect(mapStateToProps)(NavBar));
