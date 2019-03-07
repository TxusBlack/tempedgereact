import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { withLocalize, Translate } from 'react-localize-redux';
import Captcha from '../../components/common/Captcha/Captcha';
import { push } from 'connected-react-router';
import { notify } from 'reapop';

class Login extends Component{
  constructor(props, context) {
    super(props, context);

    this.addTranslationsForActiveLanguage();
  }

  state = { captchaRef: null, reCaptchaToken: '', btnDisabled: true }

  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/auth/${this.props.activeLanguage.code}`);
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
          <p className="text-left" style={{color: '#a94442'}}><Translate id={fieldId}>{errMsg}</Translate></p>
        );
      }
    }
  }

  renderInput = (formProps) => {
    let errorClass = `col-xs-12 ${(formProps.meta.error && formProps.meta.touched)? 'has-error-login login-input-error': 'login-input'}`;

    if(formProps.input.name === "username"){
      errorClass = errorClass.concat(" ", "first-input-spacer");
    }

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
    });
  }

  setCaptchaRef = (ref) => {
    this.setState({
      captchaRef: React.createRef(ref)
    });
  }

  generateCaptcha = (formProps) => {
    return <Captcha formProps={formProps} setCaptchaRef={this.setCaptchaRef} onChange={this.onChange} />;
  }

  onSubmit = (formValues) => {
    console.log(formValues);
    this.fireNotification();
    //this.state.captchaRef.reset();
  }

  fireNotification = () => {
    console.log("NOTIFY RAN!");
    let { notify } = this.props;

    notify({
      title: 'Login Submitted',
      message: 'you clicked on the Submit button',
      status: 'success',
      position: 'br',
      dismissible: true,
      dismissAfter: 3000
    });
  }

  render(){
    let { activeLanguage }  = this.props;
    let forgotPasswordRoute = `/resetpassword/${activeLanguage.code}`;
    let registerRoute = `/register/${activeLanguage.code}`;

    return(
      <div className="container-fluid login-container">
        <div className="row">
          <div className="col-md-12">
            <div className="login-form">
              <div className="panel panel-default login-form-panel">
                <div className="panel-heading login-header">
                  <h2 className="text-center"><Translate id="com.tempedge.msg.label.sign_in">Sign In</Translate></h2>
                </div>
                <form className="panel-body" onSubmit={this.props.handleSubmit(this.onSubmit)}>
                    <div className="form-group">
                      <p className="text-left label-p"><Translate id="com.tempedge.msg.label.username">Username</Translate></p>
                      <Field name="username" type="text" placeholder="Enter username" component={this.renderInput} />
                    </div>
                    <div className="form-group">
                      <p className="text-left label-p"><Translate id="com.tempedge.msg.label.password">Password</Translate></p>
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
                        <button type="submit" className="btn btn-primary btn-block" disabled={this.props.invalid || this.props.submiting || this.props.pristine || this.state.btnDisabled}><Translate id="com.tempedge.msg.label.sign_in">Sign In</Translate></button>
                    </div>
                </form>
                <div className="captcha-container">
                  <div className="center-block captcha-panel" style={{width: "304px"}}>
                    <Field name='captcha' size="normal" height="130px" theme="light" component={this.generateCaptcha} />
                  </div>
                </div>
                <div className="panel-footer login-footer">
                  <span className="text-right no-account-query"><Translate id="com.tempedge.msg.label.no_account">Don't have an account?</Translate></span>
                  <span className="text-right register-link"><Link className="create-account" to={registerRoute}><Translate id="com.tempedge.msg.label.create_account">Create Account</Translate></Link></span>
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

Login = reduxForm({
  form: 'login',
  validate: validate
})(Login);

export default withLocalize(connect(null, { push, notify })(Login));
