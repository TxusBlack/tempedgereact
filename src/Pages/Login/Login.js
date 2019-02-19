import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import Validators from 'redux-form-validators';
import { withLocalize, Translate } from 'react-localize-redux';
import  { setActivePage } from '../../Redux/actions/tempEdgeActions';

const $ = window.$;

class Login extends Component{
  constructor(props) {
    super(props);

    this.addTranslationsForActiveLanguage();
  }

  componentWillMount(){
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
        <input className="form-control" placeholder={formProps.placeholder} {...formProps.input} autoComplete="off" />      {/*<input onChange={formProps.input.onChange} value={formProps.input.value} />*/}
        {this.renderError(formProps)}
      </div>
    );
  }

  onSubmit(formValues){
    console.log(formValues);
  }

  render(){
    let forgotPasswordRoute = `/resetpassword/${this.props.params.lang}`;
    let registerRoute = `/register/${this.props.params.lang}`;

    return(
      <div className="container-fluid login-container">
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <div className="login-form">
              <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
                  <h2 className="text-center"><Translate id="com.tempedge.msg.label.login">Log In</Translate></h2>
                  <div className="form-group">
                    <Field name="username" type="text" placeholder="Username" component={(formProps) => this.renderInput(formProps)} />
                  </div>
                  <div className="form-group">
                    <Field name="password" type="text" placeholder="Password" component={(formProps) => this.renderInput(formProps)} />
                  </div>
                  <div className="form-group">
                      <button type="submit" className="btn btn-primary btn-block" disabled={this.props.invalid || this.props.submiting || this.props.pristine}><Translate id="com.tempedge.msg.label.login">Log In</Translate></button>
                  </div>
                  <div className="clearfix">
                      <label className="pull-left checkbox-inline">
                        <Field name="rememberme" id="rememberme" component="input" type="checkbox"/>
                        <Translate id="com.tempedge.msg.label.remember_me">Remember me</Translate>
                      </label>
                      <Link to={forgotPasswordRoute} className="pull-right"><Translate id="com.tempedge.msg.label.password_retrieve">Forgot Password?</Translate></Link>
                  </div>
              </form>
              <p className="text-center register-link"><Link to={registerRoute}><Translate id="com.tempedge.msg.label.create_account">Create an Account</Translate></Link></p>
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
