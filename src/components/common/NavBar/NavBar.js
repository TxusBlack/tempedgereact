import React from 'react';
import { Link } from 'react-router-dom';
import { withLocalize, Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import HamburgerButton from '../HamburgerButton/HamburgerButton';
import usaFlag from "./icons/usa.png"; // Tell Webpack this JS file uses this image
import spaFlag from "./icons/spanish.png";

class NavBar extends React.Component{
  changeActiveLang = (language) => {
    this.props.setActiveLanguage(language);
  }

  checkMenuItemActive = (activeMenuItem) => {
    if(typeof this.props.activePage !== 'undefined' || this.props.activePage !== ""){
      if(this.props.activePage === 'auth'){
        activeMenuItem[0] = 'active';
        activeMenuItem[1] = '';
        activeMenuItem[2] = '';
      }else if(this.props.activePage === 'register'){
        activeMenuItem[0] = '';
        activeMenuItem[1] = 'active';
        activeMenuItem[2] = '';
      }else if(this.props.activePage === 'registerAgency'){
        activeMenuItem[0] = '';
        activeMenuItem[1] = '';
        activeMenuItem[2] = 'active';
      }
    }
  }

  render(){
    let { languages, activeLanguage } = this.props;
    let loginRoute = `/auth/${activeLanguage.code}`;
    let registerRoute = `/register/${activeLanguage.code}`;
    let registerAgencyRoute = `/registerAgency/${activeLanguage.code}`;
    let activeMenuItem = ['active', '', ''];
    let hamburgerBtn = "";

    if(this.props.pathname.includes("dashboard")){
      hamburgerBtn = <HamburgerButton toggleNav={this.props.toggleNav} />;
    }

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
          <div className="col-md-12 bottom-bar-part">
            <div className="container-fluid">
              <div className="row">
                {hamburgerBtn}
                <div className="col-md-2 col-md-offset-1 logo">
                  <Link to="/"><img className="company-logo" src="/img/Temp_Edge_250-80-1.png" /></Link>
                </div>
                <div className="col-md-6 menu-list">
                <div className="collapse navbar-collapse menu">
                  <ul className="nav navbar-nav menu-ul">
                    <li className={activeMenuItem[0]}><Link to={loginRoute}><Translate id="com.tempedge.msg.label.sign_in" /></Link></li>
                    <li className={activeMenuItem[1]}><Link to={registerRoute}><Translate id="com.tempedge.msg.label.newuser" /></Link></li>
                    <li className={activeMenuItem[2]}><Link to={registerAgencyRoute}><Translate id="com.tempedge.msg.label.newagency" /></Link></li>
                  </ul>
                 </div>
               </div>
               <div className="col-md-2 language">
                 <span><Translate id="com.tempedge.msg.label.language">Language</Translate></span>&nbsp;&nbsp;
                 <span>
                   {languages.map(lang => {
                     return(
                       <span key={ lang.code } onClick={() => this.changeActiveLang(lang.code)}><img className="flag" src={(lang.code === 'en')? usaFlag: spaFlag} alt="Country Flag" />&nbsp;&nbsp;</span>
                     );
                   })}
                 </span>
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
  let parsedPath = state.router.location.pathname.split("/");

  return({
    activePage: parsedPath[1],   //HomePage is [0]
    pathname: state.router.location.pathname
  });
}

export default withLocalize(connect(mapStateToProps)(NavBar));
