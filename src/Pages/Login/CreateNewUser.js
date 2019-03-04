import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import Validators from 'redux-form-validators';
import { required, date } from 'redux-form-validators';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import 'react-widgets/dist/css/react-widgets.css';
import moment from 'moment';
import momentLocaliser from 'react-widgets-moment';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import  { setActivePage } from '../../Redux/actions/tempEdgeActions';
import ReCaptcha from "react-google-recaptcha";
import keys from '../../apiKeys/keys';

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

class CreateNewUser extends Component{
  constructor(props) {
    super(props);

    this.addTranslationsForActiveLanguage();
  }

  state = { reCaptchaToken: '', btnDisabled: true }

  componentWillMount(){
    this.props.history.location.pathname = `/register/${this.props.activeLanguage.code}`;
    this.props.history.push(`/register/${this.props.activeLanguage.code}`);
    this.props.setActivePage("register");
  }

  componentDidUpdate(prevProps, prevState){
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.params.lang = this.props.activeLanguage.code;
      this.props.history.location.pathname = `/register/${this.props.activeLanguage.code}`;
      this.props.history.push(`/register/${this.props.activeLanguage.code}`);
      this.addTranslationsForActiveLanguage();
    }
  }

  addTranslationsForActiveLanguage(){
    const {activeLanguage} = this.props;

    if (!activeLanguage) {
      return;
    }

    import(`../../translations/${activeLanguage.code}.tempedge.json`)
      .then(translations => {
        this.props.addTranslationForLanguage(translations, activeLanguage.code)
      });
  }

  renderError(formProps){
    let fieldId='';
    let errMsg = '';

    if(typeof formProps.input !== 'undefined'){
      fieldId = `com.tempedge.error.person.${formProps.input.name}required`;
      errMsg = formProps.meta.error;

      if(formProps.meta.touched && formProps.meta.error && typeof errMsg !== 'undefined'){
        return(
          <p style={{color: '#a94442'}}><Translate id={fieldId}>{errMsg}</Translate></p>
        );
      }
    }
  }

  renderInput = (formProps) => {
    let errorClass = `col-xs-10 ${(formProps.meta.error && formProps.meta.touched)? 'has-error': ''}`;

    return(
      <div className={errorClass}>
        <input className="form-control" placeholder={formProps.placeholder} {...formProps.input} autoComplete="off" />
        {this.renderError(formProps)}
      </div>
    );
  }

  renderDateTimePicker = (formProps) => {
    let errorClass = `col-xs-10 ${(formProps.meta.error && formProps.meta.touched)? 'has-error-dob': ''}`;

    return(
      <div className={errorClass}>
        <DateTimePicker onChange={formProps.input.onChange} onBlur={formProps.input.onBlur} format="MM/DD/YYYY" time={formProps.showTime} value={!formProps.input.value ? null : new Date(formProps.input.value)} />
        {this.renderError(formProps)}
      </div>
    );
  }

  onChange = (recaptchaToken) => {
    console.log("recaptchaToken: ", recaptchaToken);

    this.setState({
      reCaptchaToken: recaptchaToken,
      btnDisabled: false
    });
  }

  renderReCaptcha = (formProps) => {
    let errorClass = `col-xs-12 ${(formProps.meta.error && formProps.meta.touched)? 'has-error-login login-input-error': 'login-input'}`;

    return(
      <div className={errorClass}>
        <ReCaptcha
            ref={(ref) => {this.captcha = ref;}}
            size={formProps.size}
            height={formProps.height}
            theme={formProps.theme}
            sitekey={keys.RECAPTCHA_SITE_KEY}
            onChange={this.onChange}
        />
      </div>
    );
  }

  onSubmit(formValues){
    console.log(formValues);
    //this.captcha.reset();
  }

  render(){
    console.log("this.state.btnDisabled: ", this.state.btnDisabled);

    return(
      <React.Fragment>
        <h2 className="text-center page-title"><Translate id="com.tempedge.msg.label.newuser">New User</Translate></h2>
        <form onSubmit={this.props.handleSubmit(this.onSubmit)} className="form-horizontal center-block register-form" style={{paddingBottom: "0px"}}>
          <div className="form-group">
              <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.firstname">First Name (Required)</Translate></label>
              <Field name="firstName" type="text" placeholder="First Name" component={this.renderInput} />
          </div>
          <div className="form-group">
              <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.middlename">Middle Name</Translate></label>
              <Field name="middleName" type="text" placeholder="Middle Name" component={this.renderInput} />
          </div>
          <div className="form-group">
              <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.lastname">Last Name (Required)</Translate></label>
              <Field name="lastName" type="text" placeholder="Last Name" component={this.renderInput} />
          </div>
          <div className="form-group">
              <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.email">Email</Translate></label>
              <Field name="email" type="email" placeholder="Email" component={this.renderInput} />
          </div>
          <div className="form-group">
              <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.birthday">Birthday</Translate></label>
              <Field name="birthday" type="text" component={(formProps) => this.renderDateTimePicker(formProps)} validate={date()} />
          </div>
          <div className="form-group">
              <div className="col-md-6 col-md-offset-3">
                <button type="submit" className="btn btn-primary btn-block register-save-btn new-gency-register-save-btn" disabled={this.props.invalid || this.props.submiting || this.props.pristine || this.state.btnDisabled}><Translate id="com.tempedge.msg.label.save">Save</Translate></button>
              </div>
          </div>
      </form>
      <div className="row">
        <div className="col-md-12">
          <div className="center-block new-agency-captcha">
            <Field name='captcha' size="normal" height="130px" theme="light" component={this.renderReCaptcha} />
          </div>
        </div>
      </div>
    </React.Fragment>
    );
  }
}

let validate = (formValues) => {
  let errors ={};

  if(!formValues.firstName){
    errors.firstName = 'Please enter your first name';
  }

  if(!formValues.middleName){
    errors.middleName = 'Please enter your middle name or initial';
  }

  if(!formValues.lastName){
    errors.lastName = 'Please enter your last name';
  }

  if (!formValues.email) {
      errors.email = 'Email field is required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.email)) {
      errors.email = 'Invalid email address'
  }

  return errors;
}

CreateNewUser.propTypes = {
  setActivePage: PropTypes.func.isRequired
}
                      //Current REDUX state
let mapStateToProps = (state) => {
  return({
    activePage: state.tempEdge.active_page
  });
}

CreateNewUser = reduxForm({
  form: 'createNewUser',
  validate: validate
})(CreateNewUser);

export default withLocalize(connect(mapStateToProps, { setActivePage })(CreateNewUser));
