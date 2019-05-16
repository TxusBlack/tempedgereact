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
        activeMenuItem[0] = 'nav-link active';
        activeMenuItem[1] = 'nav-link';
        activeMenuItem[2] = 'nav-link';
      }else if(this.props.activePage === 'register'){
        activeMenuItem[0] = 'nav-link';
        activeMenuItem[1] = 'nav-link active';
        activeMenuItem[2] = 'nav-link';
      }else if(this.props.activePage === 'registerAgency'){
        activeMenuItem[0] = 'nav-link';
        activeMenuItem[1] = 'nav-link';
        activeMenuItem[2] = 'nav-link active';
      }
    }
  }

  render(){
    let { languages, activeLanguage } = this.props;
    let loginRoute = `/auth/${activeLanguage.code}`;
    let registerRoute = `/register/${activeLanguage.code}`;
    let registerAgencyRoute = `/registerAgency/${activeLanguage.code}`;
    let activeMenuItem = ['nav-link active', 'nav-link', 'nav-link'];
    let hamburgerBtn = "";

    if(this.props.pathname.includes("dashboard")){
      hamburgerBtn = <HamburgerButton toggleNav={this.props.toggleNav} />;
    }

    this.checkMenuItemActive(activeMenuItem);

    return(
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        {hamburgerBtn}
        <div className="col-lg-2 col-xs-1 offset-lg-1 logo" style={{display: "flex"}}>
          <Link to="/"><img className="company-logo" src="/img/Temp_Edge_250-80-1.png" /></Link>
          <div className="align-self-center ml-auto mr-3">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="col-lg-8">
            <ul className="navbar-nav menu-ul">
              <li className={activeMenuItem[0]}><Link to={loginRoute}><Translate id="com.tempedge.msg.label.sign_in" /></Link></li>
              <li className={activeMenuItem[1]}><Link to={registerRoute}><Translate id="com.tempedge.msg.label.newuser" /></Link></li>
              <li className={activeMenuItem[2]}><Link to={registerAgencyRoute}><Translate id="com.tempedge.msg.label.newagency" /></Link></li>
            </ul>
          </div>
          <div className="col-lg-2 language">
            <span className="float-left" style={{paddingLeft: "3.5rem"}}><Translate id="com.tempedge.msg.label.language">Language</Translate>&nbsp;&nbsp;</span>
            <span className="float-right">
              {languages.map(lang => {
                return(
                  <span key={ lang.code } onClick={() => this.changeActiveLang(lang.code)}><img className="flag" src={(lang.code === 'en')? usaFlag: spaFlag} alt="Country Flag" />&nbsp;&nbsp;</span>
                );
              })}
            </span>
          </div>
        </div>
      </nav>
    );
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
