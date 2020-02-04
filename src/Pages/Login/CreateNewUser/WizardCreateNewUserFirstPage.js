import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import { date } from 'redux-form-validators';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import Dropdown from '../../../components/common/Dropdown/Dropdown.js';
import DropdownList from 'react-widgets/lib/DropdownList';      //DO NOT REMOVE or it will break
import DateTime from '../../../components/common/DateTimePicker/DateTimePicker.js';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';  //DO NOT REMOVE or it will break

import Datepicker from '../../../components/common/Datepicker/Datepicker';

import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import moment from 'moment';
import momentLocaliser from 'react-widgets-moment';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Validate from '../../Validations/Validations';

const $ = window.$;

momentLocaliser(moment);

class WizardCreateNewUserFirstPage extends Component{
  constructor(props){
    super(props);

    this.addTranslationsForActiveLanguage();
  }

  state= { mounted: false, genders: [] }

  componentDidMount(){
    let parent = $(ReactDOM.findDOMNode(this.refs.createNewUser1));
    parent.closest(".wizard-wrapper").css("width", "1160px");
    parent.closest(".wizard-create-agency").css("width", "1398px");

    this.setState(() => ({
      mounted: true
    }));
  }

  componentDidUpdate(prevProps, prevState){
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if(hasActiveLanguageChanged){
      this.props.push(`/register/${this.props.activeLanguage.code}`);
      this.addTranslationsForActiveLanguage();
    }
  }

  addTranslationsForActiveLanguage = async () => {
    await ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);

    let gendersTranslate = [];
    gendersTranslate.push($(ReactDOM.findDOMNode(this.refs.maleOption)).text());
    gendersTranslate.push($(ReactDOM.findDOMNode(this.refs.femaleOption)).text());

    if(this.state.mounted && gendersTranslate.length !== 0){
      this.setState(() => ({
        genders: gendersTranslate
      }));
    }
  }

  render(){
    let signInRoute = `/auth/${this.props.activeLanguage.code}`;

    return(
      <div className="sign-up-wrapper" style={{margin: 0}} ref="createNewUser1">
        <h2 className="text-center page-title-register"><Translate id="com.tempedge.msg.label.sign_up"></Translate></h2>
        <h3 className="text-center page-subtitle page-subtitle-register"><Translate id="com.tempedge.msg.label.sign_up.subtitle"></Translate></h3>
        <div className="panel register-form-panel">
          <div className="panel-heading register-header">
            <h2 className="text-center"><Translate id="com.tempedge.msg.label.accountinformation"></Translate></h2>
          </div>
        </div>
        <div className="register-form-panel-inputs">
          <form className="panel-body form-horizontal center-block register-form" onSubmit={this.props.handleSubmit(this.props.onSubmit)} style={{paddingBottom: "0px"}}>
            <div className="form-group row">
              {this.props.errata}
              <div className="col-md-4">
                <label className="control-label"><Translate id="com.tempedge.msg.label.firstname"></Translate></label>
                <Field name="firstName" type="text" placeholder="First Name" category="person" component={InputBox} />
              </div>
              <div className="col-md-4">
                <label className="control-label"><Translate id="com.tempedge.msg.label.middlename"></Translate></label>
                <Field name="middleName" type="text" placeholder="Middle Name" category="person" component={InputBox} />
              </div>
              <div className="col-md-4">
                <label className="control-label"><Translate id="com.tempedge.msg.label.lastname"></Translate></label>
                <Field name="lastName" type="text" placeholder="Last Name" category="person" component={InputBox} />
              </div>
            </div>

            <div className="form-group row">
              <div className="col-md-4">
                <label className="control-label"><Translate id="com.tempedge.msg.label.gender" /></label>
                <span style={{display: "none"}} ref="maleOption"><Translate id="com.tempedge.msg.label.gender.male" /></span>
                <span style={{display: "none"}} ref="femaleOption"><Translate id="com.tempedge.msg.label.gender.female" /></span>
                <Field id="genderDropdown" name="gender" data={this.state.genders} valueField="value" textField="gender" category="person" component={Dropdown} />
              </div>
              <div className="col-md-4">
                <label className="control-label"><Translate id="com.tempedge.msg.label.email" /></label>
                <Field name="email" type="email" placeholder="Email" category="person" component={InputBox} />
              </div>
              <div className="col-md-4">
                <label className="control-label"><Translate id="com.tempedge.msg.label.birthday" /></label>
                <Field name="birthday" type="text" category="person" customClass="form-control tempEdge-input-box" component={Datepicker} />
              </div>
            </div>

            <div className="form-group row">
              <div className="col-md-4">
                <label className="control-label"><Translate id="com.tempedge.msg.label.username" /></label>
                <Field name="username" type="text" placeholder="Enter username" category="person" component={InputBox} />
              </div>

              <div className="col-md-4">
                <label className="control-label"><Translate id="com.tempedge.msg.label.password" /></label>
                <Field name="initialpassword" type="password" placeholder="Enter password" category="person" component={InputBox} />
              </div>

              <div className="col-md-4">
                <label className="control-label"><Translate id="com.tempedge.msg.label.confirmpassword" /></label>
                <Field name="confirmpassword" type="password" placeholder="Confirm password" category="person" component={InputBox} />
              </div>
            </div>

            <div className="form-group prev-next-btns">
                <div className="col-md-6 offset-md-3">
                  <button type="submit" className="btn btn-primary btn-block register-save-btn next" disabled={this.props.invalid || this.props.submiting || this.props.pristine}><Translate id="com.tempedge.msg.label.next"></Translate></button>
                </div>
            </div>
          </form>
        </div>
        <div className="panel-footer register-footer">
          <div className="pull-right">
            <span className="no-account-query"><Translate id="com.tempedge.msg.label.account_exists"></Translate></span>
            <span className="sign-in-link"><Link className="create-account" to={signInRoute}><Translate id="com.tempedge.msg.label.sign_in"></Translate></Link></span>
          </div>
        </div>
      </div>
    );
  }
}

WizardCreateNewUserFirstPage = reduxForm({
  form: 'CreateNewUser', //                 <------ form name
  destroyOnUnmount: false, //        <------ preserve form data
  // forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate: Validate
})(WizardCreateNewUserFirstPage);

export default withLocalize(connect(null, { push })(WizardCreateNewUserFirstPage));
