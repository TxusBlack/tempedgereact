import React from 'react';
import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Link } from 'react-router-dom';
import Footer from '../Footer/Footer';
import ActiveLanguageAddTranslation from '../ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import user from './assets/user.png';
import { doLogout } from "../../../Redux/actions/tempEdgeActions.js"

class NavPanelLeft extends React.Component{
  constructor(props){
    super(props);

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  componentDidUpdate(prevProps, prevState){
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if(hasActiveLanguageChanged) {
      this.props.push(`/dashboard/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  toggleNav = () => {
    this.props.toggleNav();
  }

  signOut = () => {
    let { activeLanguage } = this.props;
    
    sessionStorage.clear();
    this.toggleNav();
    this.props.doLogout(activeLanguage.code);
  }

  render(){
    let panelClass = (this.props.show)? "panel-nav-left show": "panel-nav-left";
    let leftNavMenu = (typeof sessionStorage.getItem('leftNavMenu') !== 'undefined' && sessionStorage.getItem('leftNavMenu') !== null)? JSON.parse(sessionStorage.getItem('leftNavMenu')): "";

    return(
      <nav className={panelClass}>
        <div>
          <div className="row close-btn-row">
            <div className="col-lg-12">
              <span onClick={this.toggleNav} className="panel-nav-left-close-btn pull-right">&times;</span>
            </div>
          </div>
          <div className="row panel-user-img-name">
            <div className="col-lg-4">
              <img src={user} className="usr-img" alt="user" />
            </div>
            <div className="col-lg-8">
              <h4>{this.props.firstName + " " + this.props.lastName}</h4>
            </div>
          </div>
          <ul>
            {(leftNavMenu !== '')? leftNavMenu.map((item, index) => {
              return <li onClick={this.toggleNav}><Link to={`${item.optionPath}/${this.props.activeLanguage.code} `} style={{marginLeft: 40}}>{item.optionName}</Link></li>;
            }): ""}
          </ul>
        </div>
        <Footer textColor="#2d2d2d" background="#fff" content={<p onClick={this.signOut}><Link to="/">Sign Out</Link></p>} />
      </nav>
    );
  }
}

let mapStateToProps = (state) => {
  return({
    firstName: (typeof state.tempEdge.login.portalUserList !== 'undefined')? state.tempEdge.login.portalUserList[0].user.firstName:  "",
    lastName: (typeof state.tempEdge.login.portalUserList !== 'undefined')? state.tempEdge.login.portalUserList[0].user.lastName:  ""
  });
}

export default withLocalize(connect(mapStateToProps, { push, doLogout })(NavPanelLeft));
