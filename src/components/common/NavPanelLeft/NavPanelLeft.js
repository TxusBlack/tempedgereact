import React from 'react';
import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Footer from '../Footer/Footer';
import ActiveLanguageAddTranslation from '../ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import user from './assets/user.png';

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

  render(){
    let panelClass = (this.props.show)? "panel-nav-left show": "panel-nav-left ";

    return(
      <nav className={panelClass}>
        <div>
          <div className="row close-btn-row">
            <div className="col-lg-12">
              <span onClick={this.toggleNav} className="panel-nav-left-close-btn pull-right">x</span>
            </div>
          </div>
          <div className="row panel-user-img-name">
            <div className="col-lg-5">
              <img src={user} className="usr-img" alt="user" />
            </div>
            <div className="col-lg-7">
              <h4>Joe Schmoe</h4>
            </div>
          </div>
          <ul>
            <li><a href="/">My Account</a></li>
            <li><a href="/">Notifications</a></li>
            <li><a href="/">New User</a></li>
            <li><a href="/">New Agency</a></li>
            <li><a href="/">Employee</a></li>
            <li><a href="/">Client</a></li>
            <li><a href="/">Daily List</a></li>
            <li><a href="/">Time Entry</a></li>
            <li><a href="/">Payroll</a></li>
            <li><a href="/">Reports</a></li>
            <li><a href="/">Administration</a></li>
          </ul>
        </div>
        <Footer textColor="#2d2d2d" background="#fff" content={<p><a href="/">Sign Out</a></p>} />
      </nav>
    );
  }
}

export default withLocalize(connect(null, { push })(NavPanelLeft));
