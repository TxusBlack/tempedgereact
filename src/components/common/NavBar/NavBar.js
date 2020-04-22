import React from 'react';
import { Link } from 'react-router-dom';
import { withLocalize, Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import HamburgerButton from '../HamburgerButton/HamburgerButton';
import usaFlag from "./icons/usa.png"; // Tell Webpack this JS file uses this image
import spaFlag from "./icons/spanish.png";

class NavBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      logo: null
    }
  }

  changeActiveLang = (language) => {
    this.props.setActiveLanguage(language);
  }

  checkMenuItemActive = (activeMenuItem) => {
    const { activePage } = this.props;
    if (typeof activePage !== 'undefined' || activePage !== "") {
      if (activePage === 'auth') {
        activeMenuItem[0] = 'active';
        activeMenuItem[1] = '';
        activeMenuItem[2] = '';
        activeMenuItem[3] = '';
      } else if (activePage === 'register') {
        activeMenuItem[0] = '';
        activeMenuItem[1] = 'active';
        activeMenuItem[2] = '';
        activeMenuItem[3] = '';
      } else if (activePage === 'registerAgency') {
        activeMenuItem[0] = '';
        activeMenuItem[1] = '';
        activeMenuItem[2] = 'active';
        activeMenuItem[3] = '';
      }
    }
  }

  async componentWillUpdate() {
    const profile = await JSON.parse(sessionStorage.getItem('agency'));
    if (profile && !this.state.logo && this.state.logo !== profile.organizationEntity.logo) this.setState({ logo: profile.organizationEntity.logo });
  }

  render() {
    let { languages, activeLanguage } = this.props;
    let path = window.location.pathname;
    let loginRoute = `/auth/${activeLanguage.code}`;
    let registerRoute = `/register/${activeLanguage.code}`;
    let registerAgencyRoute = `/registerAgency/${activeLanguage.code}`;
    let activeMenuItem = ['active', '', '', ''];
    let hamburgerBtn = "";
    let logo = "";

    if (!path.includes("organization-select")) {
      logo = <Link to={`/auth/${activeLanguage.code}`}><img className="company-logo" src={this.state.logo || "/img/Temp_Edge_250-80-1.png"} alt="Company Logo" /></Link>;
    } else {
      logo = <img className="company-logo" src="/img/Temp_Edge_250-80-1.png" alt="Company Logo" />;
    }

    if (typeof this.props.portalUserList !== 'undefined' && this.props.portalUserList[0].status === "A") {
      hamburgerBtn = <HamburgerButton toggleNav={this.props.toggleNav} />;
    }

    this.checkMenuItemActive(activeMenuItem);

    return (
      <nav className="navbar navbar-expand-sm">
        <div className="row" style={{ pading: 0, margin: 0, width: "100%" }}>
          <div className="col-lg-1">{hamburgerBtn}</div>
          <div className="col-lg-2 col-xs-6 col-sm-6">
            {logo}
          </div>
          <div className="col-xs-4 col-sm-4 language-container-xs">
            <div className="language">
              <div style={{ width: "max-content", margin: "auto" }}>
                {languages.map(lang => {
                  return (
                    <span key={lang.code} onClick={() => this.changeActiveLang(lang.code)}><img className="flag" src={(lang.code === 'en') ? usaFlag : spaFlag} alt="Country Flag" />&nbsp;&nbsp;</span>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="col-xs-2 col-sm-2 nav-btn-container">
            <button className="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarsExample03" aria-controls="navbarsExample03" aria-expanded="false" aria-label="Toggle navigation">
              <i className="fa fa-bars" aria-hidden="true"></i>
            </button>
          </div>
          <div className="col-lg-6 col-xs-12 col-sm-12 menu-list">
            <div className="navbar-collapse collapse" id="navbarsExample03">
              <ul className="nav navbar-nav menu-ul mr-auto">
                {(typeof this.props.portalUserList !== 'undefined' && this.props.portalUserList[0].status === "A") ? "" : (
                  <React.Fragment>
                    <li className={activeMenuItem[0]}><Link to={loginRoute}><Translate id="com.tempedge.msg.label.sign_in" /></Link></li>
                    <li className={activeMenuItem[1]}><Link to={registerRoute}><Translate id="com.tempedge.msg.label.newuser" /></Link></li>
                    <li className={activeMenuItem[2]}><Link to={registerAgencyRoute}><Translate id="com.tempedge.msg.label.newagency" /></Link></li>
                  </React.Fragment>
                )}
              </ul>
            </div>
          </div>
          <div className="col-lg-3 language-container-lg">
            <div className="language">
              <span><Translate id="com.tempedge.msg.label.language" /></span>&nbsp;&nbsp;
               <span>
                {languages.map(lang => {
                  return (
                    <span key={lang.code} onClick={() => this.changeActiveLang(lang.code)}><img className="flag" src={(lang.code === 'en') ? usaFlag : spaFlag} alt="Country Flag" />&nbsp;&nbsp;</span>
                  );
                })}
              </span>
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

  return ({
    activePage: parsedPath[1],   //HomePage is [0]
    pathname: state.router.location.pathname,
    portalUserList: (typeof state.tempEdge.login !== 'undefined' || typeof state.tempEdge.login.portalUserList !== 'undefined') ? state.tempEdge.login.portalUserList : {}
  });
}

export default withLocalize(connect(mapStateToProps)(NavBar));
