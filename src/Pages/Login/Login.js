import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import Validators from 'redux-form-validators';
import { withLocalize, Translate } from 'react-localize-redux';
import  { setActivePage } from '../../Redux/actions/tempEdgeActions';
import ReCaptcha from "react-google-recaptcha";
import keys from '../../apiKeys/keys';

class Login extends Component{
  constructor(props, context) {
    super(props, context);

    this.addTranslationsForActiveLanguage();
  }

  state = { reCaptchaToken: '', btnDisabled: true }

  componentDidMount(){
    this.props.history.location.pathname = `/auth/${this.props.activeLanguage.code}`;
    this.props.history.push(`/auth/${this.props.activeLanguage.code}`);
    this.props.setActivePage("auth");
  }

  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.params.lang = this.props.activeLanguage.code;
      this.props.history.location.pathname = `/auth/${this.props.activeLanguage.code}`;
      this.props.history.push(`/auth/${this.props.activeLanguage.code}`);
      this.addTranslationsForActiveLanguage();
    }
  }

  addTranslationsForActiveLanguage() {
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
    let errorClass = `col-xs-12 ${(formProps.meta.error && formProps.meta.touched)? 'has-error-login login-input-error': 'login-input'}`;

    return(
      <div className={errorClass}>
        <input className="form-control login-input-box" placeholder={formProps.placeholder} {...formProps.input} autoComplete="off" />      {/*<input onChange={formProps.input.onChange} value={formProps.input.value} />*/}
        {this.renderError(formProps)}
      </div>
    );
  }

  onChange = (recaptchaToken) => {
    console.log("recaptchaToken: ", recaptchaToken);

    this.setState({
      reCaptchaToken: recaptchaToken,
      btnDisabled: false
    }, () => {
      console.log("this.state.btnDisabled: ", this.state.btnDisabled);
    })
  }

  renderReCaptcha = (formProps) => {
    let errorClass = `col-xs-12 ${(formProps.meta.error && formProps.meta.touched)? 'has-error-login login-input-error': 'captcha'}`;

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
    let forgotPasswordRoute = `/resetpassword/${this.props.params.lang}`;
    let registerRoute = `/register/${this.props.params.lang}`;

    return(
      <div className="container-fluid login-container">
        <div className="row">
          <div className="col-md-12">
            <div className="login-form">
              <div className="card login-form-panel">
                <div className="card-header login-header">
                  <h2 className="text-center"><Translate id="com.tempedge.msg.label.login">Sign In</Translate></h2>
                </div>
                <form className="card-body" onSubmit={this.props.handleSubmit(this.onSubmit)}>
                    <div className="form-group">
                      <p className="text-left label-p">Username</p>
                      <Field name="username" type="text" placeholder="Enter username" component={this.renderInput} />
                    </div>
                    <div className="form-group">
                      <p className="text-left label-p">Password</p>
                      <Field name="password" type="text" placeholder="Enter password" component={this.renderInput} />
                    </div>
                    <div className="clearfix">
                        <label className="pull-left checkbox-inline label-p">
                          <Field name="rememberme" id="rememberme" component="input" type="checkbox"/>
                          <span style={{marginLeft: 4}}><Translate id="com.tempedge.msg.label.remember_me">Remember me</Translate></span>
                        </label>
                        <Link to={forgotPasswordRoute} className="pull-right forgot-password"><Translate id="com.tempedge.msg.label.password_retrieve">Forgot Password?</Translate></Link>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary btn-block" disabled={this.props.invalid || this.props.submiting || this.props.pristine || this.state.btnDisabled}><Translate id="com.tempedge.msg.label.login">Sign In</Translate></button>
                    </div>
                </form>
                <div className="card-footer login-footer">
                  <span className="text-right no-account-query">Don't have an account?</span>
                  <span className="text-right register-link"><Link className="create-account" to={registerRoute}><Translate id="com.tempedge.msg.label.create_account">Create Account</Translate></Link></span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="center-block captcha-panel" style={{width: "304px"}}>
                    <Field name='captcha' size="normal" height="130px" theme="light" component={this.renderReCaptcha} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

let validate = (formValues) => {
  let errors = {};

  if(!formValues.username){
    errors.username = 'Please enter your username.';
  }

  if(!formValues.password){
    errors.password = 'Please enter your password.';
  }

  return errors;
}

Login.propTypes = {
  setActivePage: PropTypes.func.isRequired
}
                      //Current REDUX state
let mapStateToProps = (state) => {
  return({
    activePage: state.tempEdge.active_page
  });
}

Login = reduxForm({
  form: 'login',
  validate: validate
})(Login);

export default withLocalize(connect(mapStateToProps, { setActivePage })(Login));
