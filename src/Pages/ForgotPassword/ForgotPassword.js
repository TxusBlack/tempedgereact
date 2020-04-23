import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import { store } from '../../store/store';

class ForgotPassword extends React.Component{
  constructor(props) {
    super(props);

    this.addTranslationsForActiveLanguage();
  }

  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/resetpassword/${this.props.activeLanguage.code}`);
      this.addTranslationsForActiveLanguage();
    }
  }

  addTranslationsForActiveLanguage() {
    const {activeLanguage} = this.props;
    const state = store.getState();

    if (!activeLanguage) {
      return;
    }

    if (activeLanguage.code === 'es') {
      this.props.addTranslationForLanguage(state.tempEdge.lang.spanish, activeLanguage.code)
    } else {
      this.props.addTranslationForLanguage(state.tempEdge.lang.english, activeLanguage.code)
    }
  }

  renderError(formProps){
    let fieldId='';
    let errMsg = '';

    if(typeof formProps.input !== 'undefined'){
      fieldId = `com.tempedge.msg.label.${formProps.input.name}required`;
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
    console.log("ForgotPassword!");
    return(
      <div className="container login-container">
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <div className="login-form">
              <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
                  <h2 className="text-center"><Translate id="com.tempedge.msg.label.forgotpassword">Forgot Pasword</Translate></h2>
                  <p className="text-center"><Translate id="com.tempedge.msg.label.resetpasswordlink">Password reset link will be sent to your email.</Translate></p>
                  <div className="form-group">
                    <Field name="forgotpassword" type="email" placeholder="Your email address" component={this.renderInput} />
                  </div>
                  <div className="form-group">
                      <button type="submit" className="btn btn-primary btn-block" disabled={this.props.invalid || this.props.submiting || this.props.pristine}><Translate id="com.tempedge.msg.label.send">Send</Translate></button>
                  </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

let validate = (formValues) => {
  let errors ={};

  if (!formValues.forgotpassword) {
      errors.forgotpassword = 'Please enter your email'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.forgotpassword)) {
      errors.forgotpassword = 'Invalid email address'
  }

  return errors;
}

ForgotPassword = withLocalize(reduxForm({
  form: 'forgotpassword',
  validate: validate
})(ForgotPassword));

export default connect(null, { push })(ForgotPassword);
