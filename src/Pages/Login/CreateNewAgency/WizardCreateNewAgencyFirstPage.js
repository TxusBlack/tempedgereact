import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import Validators, { required, date } from 'redux-form-validators';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import DropdownList from 'react-widgets/lib/DropdownList';
import 'react-widgets/dist/css/react-widgets.css';
import moment from 'moment';
import momentLocaliser from 'react-widgets-moment';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Validate from '../Validations/Validations';

const $ = window.$;

momentLocaliser(moment);

Object.assign(Validators.messages, {
  dateFormat: {
    id: "form.errors.dateFormat",
    defaultMessage: "Date field is required"
  }
});

Object.assign(Validators.defaultOptions, {
  dateFormat: 'mm/dd/yyyy'
});

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

    this.setGenderOptions();
  }

  componentDidUpdate(prevProps, prevState){
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if(hasActiveLanguageChanged){
      this.props.push(`/registerAgency/${this.props.activeLanguage.code}`);
      this.addTranslationsForActiveLanguage();
    }
  }

  addTranslationsForActiveLanguage(){
    const { activeLanguage } = this.props;

    if(!activeLanguage){
      return;
    }

    import(`../../../translations/${activeLanguage.code}.tempedge.json`)
      .then(async translations => {
        await this.props.addTranslationForLanguage(translations, activeLanguage.code);

        let gendersTranslate = this.setGenderOptions();

        if(this.state.mounted && gendersTranslate.length != 0){
          this.setState(() => ({
            genders: gendersTranslate
          }));
        }
      });
  }

  setGenderOptions = () => {
     let gendersTranslate = [];
     gendersTranslate.push($(ReactDOM.findDOMNode(this.refs.maleOption)).text());
     gendersTranslate.push($(ReactDOM.findDOMNode(this.refs.femaleOption)).text());

     return gendersTranslate;
  }

  renderError(formProps){
    let fieldId='';
    let errMsg = '';

    if(typeof formProps.input !== 'undefined'){
      fieldId = `com.tempedge.error.person.${formProps.input.name}required`;

      if(formProps.meta.touched && formProps.meta.error && typeof formProps.meta.error !== 'undefined'){
        return(
          <p style={{color: '#a94442'}}><Translate id={fieldId}>{formProps.meta.error}</Translate></p>
        );
      }
    }
  }

  renderInput = (formProps) => {
    let errorClass = `${(formProps.meta.error && formProps.meta.touched)? 'has-error': ''}`;

    return(
      <div className={errorClass}>
        <input className="form-control tempEdge-input-box" placeholder={formProps.placeholder} {...formProps.input} autoComplete="off" />
        {this.renderError(formProps)}
      </div>
    );
  }

  renderDropdownList = (formProps) => {
    let errorClass = `tempEdge-dateTimePicker-input-box ${(formProps.meta.error && formProps.meta.touched)? 'has-error-dob': ''}`;

    return(
      <div className={errorClass}>
        <DropdownList {...formProps.input} data={formProps.data} valueField={formProps.valueField} textField={formProps.textField} onChange={formProps.input.onChange} />
        {this.renderError(formProps)}
      </div>
    );
  }

  renderDateTimePicker = (formProps) => {
    let errorClass = `tempEdge-dateTimePicker-input-box ${(formProps.meta.error && formProps.meta.touched)? 'has-error-dob': ''}`;

    return(
      <div className={errorClass}>
        <DateTimePicker onChange={formProps.input.onChange} onBlur={formProps.input.onBlur} format="MM/DD/YYYY" time={formProps.showTime} value={!formProps.input.value ? null : new Date(formProps.input.value)} />
        {this.renderError(formProps)}
      </div>
    );
  }

  render(){
    let { activeLanguage }  = this.props;
    let signInRoute = `/auth/${activeLanguage.code}`;

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
          <form className="panel-body" onSubmit={this.props.handleSubmit(this.props.onSubmit)} className="form-horizontal center-block register-form" style={{paddingBottom: "0px"}}>
            <div className="form-group row">
              <div className="col-md-4">
                <label className="control-label"><Translate id="com.tempedge.msg.label.firstname">First Name (Required)</Translate></label>
                <Field name="firstName" type="text" placeholder="First Name" component={this.renderInput} />
              </div>
              <div className="col-md-4">
                <label className="control-label"><Translate id="com.tempedge.msg.label.middlename">Middle Name</Translate></label>
                <Field name="middleName" type="text" placeholder="Middle Name" component={this.renderInput} />
              </div>
              <div className="col-md-4">
                <label className="control-label"><Translate id="com.tempedge.msg.label.lastname">Last Name (Required)</Translate></label>
                <Field name="lastName" type="text" placeholder="Last Name" component={this.renderInput} />
              </div>
            </div>

            <div className="form-group row">
              <div className="col-md-4">
                <label className="control-label"><Translate id="com.tempedge.msg.label.username">Username</Translate></label>
                <Field name="username" type="text" placeholder="Enter username" component={this.renderInput} />
              </div>
              <div className="col-md-4">
                <label className="control-label"><Translate id="com.tempedge.msg.label.email">Email</Translate></label>
                <Field name="email" type="email" placeholder="Email" component={this.renderInput} />
              </div>
              <div className="col-md-4">
                <label className="control-label"><Translate id="com.tempedge.msg.label.birthday">Birthday</Translate></label>
                <Field name="birthday" type="text" component={this.renderDateTimePicker} validate={date()} />
              </div>
            </div>

            <div className="form-group row">
              <div className="col-md-4">
                <label className="control-label"><Translate id="com.tempedge.msg.label.gender">Gender</Translate></label>
                  <span style={{display: "none"}} ref="maleOption"><Translate id="com.tempedge.msg.label.gender.male">Male</Translate></span>
                  <span style={{display: "none"}} ref="femaleOption"><Translate id="com.tempedge.msg.label.gender.female">Female</Translate></span>
                  <Field id="genderDropdown" name="gender" component={this.renderDropdownList} data={this.state.genders} valueField="value" textField="gender" />
              </div>
            </div>

            <div className="form-group prev-next-btns">
                <div className="col-md-6 col-md-offset-3">
                  <button type="submit" className="btn btn-primary btn-block register-btn next" disabled={this.props.invalid || this.props.submiting || this.props.pristine}><Translate id="com.tempedge.msg.label.next">Next</Translate></button>
                </div>
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
  form: 'CreateNewAgency',
  validate: Validate
})(WizardCreateNewAgencyFirstPage);

export default withLocalize(connect(null, { push })(WizardCreateNewAgencyFirstPage));
