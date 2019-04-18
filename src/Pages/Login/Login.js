import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import InputBox from '../../components/common/InputBox/InputBox.js';
import { Field, reduxForm } from 'redux-form';
import { withLocalize, Translate } from 'react-localize-redux';
import Captcha from '../../components/common/Captcha/Captcha';
import Validate from '../Validations/Validations';
import ActiveLanguageAddTranslation from '../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { push } from 'connected-react-router';
import { notify } from 'reapop';
import httpService from '../../utils/services/httpService/httpService.js';
import actions from '../../Redux/actions/tempEdgeActions.js'
import { setActivePage, doLogin } from '../../Redux/actions/tempEdgeActions';


class Login extends Component{
  constructor(props, context) {
    super(props, context);

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  state = { captchaRef: null, reCaptchaToken: '', btnDisabled: true }

  componentDidUpdate(prevProps, prevState){
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/auth/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
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

  onSubmit = async (formValues) => {
    let values = formValues;
    values.username = "admin";
    values.password = "admin";
    values.grant_type = "password";
    window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);

    // let res = await httpService.getCountryList('/api/country/listAll');
    // let res2 = await httpService.getCountryList("/api/funding/listAll");
    // console.log('response: ', res);
    // console.log('response: ', res2);

    // let res3 = await httpService.getAuthToken('/oauth/token', values);
    // console.log('response: ', res3);
    //this.props.setActivePage("Login");
    this.props.doLogin('/api/login', values);
    //console.log("Active Page: ", this.props.activePage);
    this.fireNotification();
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
                      <Field name="username" type="text" placeholder="Enter username" category="person" component={InputBox} />
                    </div>
                    <div className="form-group">
                      <p className="text-left label-p"><Translate id="com.tempedge.msg.label.password">Password</Translate></p>
                      <Field name="password" type="text" placeholder="Enter password"category="person" component={InputBox} />
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


Login.propTypes = {
  setActivePage: PropTypes.func.isRequired,
  doLogin: PropTypes.func.isRequired
}
                      //Current REDUX state
let mapStateToProps = (state) => {
  return({
    activePage: state.tempEdge.active_page,
    login: state.tempEdge.login
  });
}

Login = reduxForm({
  form: 'login',
  validate: Validate
})(Login);

export default withLocalize(connect(mapStateToProps, { setActivePage, doLogin, push, notify })(Login));
