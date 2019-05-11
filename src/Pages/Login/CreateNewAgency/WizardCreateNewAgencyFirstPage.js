import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import { date } from 'redux-form-validators';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import Dropdown from '../../../components/common/Dropdown/Dropdown.js';
import DropdownList from 'react-widgets/lib/DropdownList';
import DateTime from '../../../components/common/DateTimePicker/DateTimePicker.js';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import moment from 'moment';
import momentLocaliser from 'react-widgets-moment';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Validate from '../../Validations/Validations';

const $ = window.$;

momentLocaliser(moment);

class WizardCreateNewAgencyFirstPage extends Component{
  constructor(props) {
    super(props);

    this.addTranslationsForActiveLanguage();
  }

  state= { mounted: false, genders: [] }

  componentDidMount(){
    this.setState(() => ({
      mounted: true
    }));
  }

  componentDidUpdate(prevProps, prevState){
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if(hasActiveLanguageChanged){
      this.props.push(`/registerAgency/${this.props.activeLanguage.code}`);
      this.addTranslationsForActiveLanguage();
    }
  }

  addTranslationsForActiveLanguage = async () => {
    await ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);

    let gendersTranslate = [];
    gendersTranslate.push($(ReactDOM.findDOMNode(this.refs.maleOption)).text());
    gendersTranslate.push($(ReactDOM.findDOMNode(this.refs.femaleOption)).text());

    if(this.state.mounted && gendersTranslate.length != 0){
      this.setState(() => ({
        genders: gendersTranslate
      }));
    }
  }

  render(){
    let signInRoute = `/auth/${this.props.activeLanguage.code}`;

    return(
      <React.Fragment>
        <h2 className="text-center page-title"><Translate id="com.tempedge.msg.label.sign_up">Sign Up</Translate></h2>
        <h3 className="text-center page-subtitle"><Translate id="com.tempedge.msg.label.sign_up.subtitle">Sign up to your new account</Translate></h3>
        <div className="panel register-form-panel">
          <div className="panel-heading register-header">
            <h2 className="text-center"><Translate id="com.tempedge.msg.label.accountinformation">Account Information</Translate></h2>
          </div>
        </div>
        <div className="register-form-panel-inputs">
          <form className="panel-body" onSubmit={this.props.handleSubmit} className="form-horizontal center-block register-form" style={{paddingBottom: "0px"}}>
            <div className="form-group row">
              <div className="col-lg-4">
                <label className="col-form-label"><Translate id="com.tempedge.msg.label.firstname">First Name (Required)</Translate></label>
                <Field name="firstName" type="text" placeholder="First Name" category="person" component={InputBox} />
              </div>
              <div className="col-lg-4">
                <label className="col-form-label"><Translate id="com.tempedge.msg.label.middlename">Middle Name</Translate></label>
                <Field name="middleName" type="text" placeholder="Middle Name" category="person" component={InputBox} />
              </div>
              <div className="col-lg-4">
                <label className="col-form-label"><Translate id="com.tempedge.msg.label.lastname">Last Name (Required)</Translate></label>
                <Field name="lastName" type="text" placeholder="Last Name" category="person" component={InputBox} />
              </div>
            </div>

            <div className="form-group row">
              <div className="col-lg-4">
                <label className="col-form-label"><Translate id="com.tempedge.msg.label.gender">Gender</Translate></label>
                  <span style={{display: "none"}} ref="maleOption"><Translate id="com.tempedge.msg.label.gender.male">Male</Translate></span>
                  <span style={{display: "none"}} ref="femaleOption"><Translate id="com.tempedge.msg.label.gender.female">Female</Translate></span>
                  <Field id="genderDropdown" name="gender" data={this.state.genders} valueField="value" textField="gender" category="person" component={Dropdown} />
              </div>
              <div className="col-lg-4">
                <label className="col-form-label"><Translate id="com.tempedge.msg.label.email">Email</Translate></label>
                <Field name="email" type="email" placeholder="Email" category="person" component={InputBox} />
              </div>
              <div className="col-lg-4">
                <label className="col-form-label"><Translate id="com.tempedge.msg.label.birthday">Birthday</Translate></label>
                <Field name="birthday" type="text" category="person" component={DateTime} validate={date()} />
              </div>
            </div>

            <div className="form-group row">
              <div className="col-lg-4">
                <label className="col-form-label"><Translate id="com.tempedge.msg.label.username">Username</Translate></label>
                <Field name="username" type="text" placeholder="Enter username" category="person" component={InputBox} />
              </div>

              <div className="col-lg-4">
                <label className="col-form-label"><Translate id="com.tempedge.msg.label.password">Password</Translate></label>
                <Field name="initialpassword" type="password" placeholder="Enter password" category="person" component={InputBox} />
              </div>

              <div className="col-lg-4">
                <label className="col-form-label"><Translate id="com.tempedge.msg.label.confirmpassword" /></label>
                <Field name="confirmpassword" type="password" placeholder="Confirm password" category="person" component={InputBox} />
              </div>
            </div>

            <div className="form-group prev-next-btns">
                <div className="col-lg-6 offset-lg-3">
                  <button type="submit" className="btn btn-primary btn-block register-btn next" disabled={this.props.invalid || this.props.submiting || this.props.pristine}><Translate id="com.tempedge.msg.label.next">Next</Translate></button>
                </div>
                <div style={{height: "1rem"}}></div>
            </div>
          </form>
        </div>
        <div className="panel-footer register-footer">
          <div className="pull-right">
            <span className="no-account-query"><Translate id="com.tempedge.msg.label.account_exists">Already have an account?</Translate></span>
            <span className="sign-in-link"><Link className="create-account" to={signInRoute}><Translate id="com.tempedge.msg.label.sign_in">Sign In</Translate></Link></span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

WizardCreateNewAgencyFirstPage = reduxForm({
  form: 'CreateNewAgency', //                 <------ form name
  destroyOnUnmount: false, //        <------ preserve form data
  // forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate: Validate
})(WizardCreateNewAgencyFirstPage);

export default withLocalize(connect(null, { push })(WizardCreateNewAgencyFirstPage));
