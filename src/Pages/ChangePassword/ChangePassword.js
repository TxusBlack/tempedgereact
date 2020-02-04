import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reset, change, untouch } from 'redux-form';
import PropTypes from 'prop-types';
import InputBox from '../../components/common/InputBox/InputBox.js';
import { Field, reduxForm } from 'redux-form';
import { withLocalize, Translate } from 'react-localize-redux';
import Captcha from '../../components/common/Captcha/Captcha';
import Validate from '../Validations/Validations';
import ActiveLanguageAddTranslation from '../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { push } from 'connected-react-router';
import { notify } from 'reapop';

import {tempedgeAPI} from '../../Redux/actions/tempEdgeActions';
import { CHANGE_PASSWORD } from '../../Redux/actions/types';

class ChangePassword extends Component {
  
  constructor(props, context) {
    super(props, context);

    this.state = { captchaRef: null, reCaptchaToken: '', btnDisabled: true};

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  componentDidMount = () => {
    // if (typeof (this.props.changePassword) !== null) this.props.changePassword = null;
  };


  //static getDerivedStateFromProps(props, state)

	static getDerivedStateFromProps (props, state) {
    console.log("componentWillReceiveProps")
    console.log(props)
    console.log(state)
    // console.log(this.state)
    console.log("componentWillReceiveProps")

    if(state.submitted === 1){

      const notifyMessage = {
        position: 'br',
        dismissible: true,
        dismissAfter: 3000,
      };
      if(props.changePassword){

        notifyMessage.title = 'Password changed';
        notifyMessage.message = 'Your password has been changed successful';
        notifyMessage.status = 'success';
      }else{
        notifyMessage.title = 'There was an error';
        notifyMessage.message = 'Please, check your current password';
        notifyMessage.status = 'error';
      }

      //fireNotification(notifyMessage);
    }else{
      // this.setState(() => ({
      //   submitted: 0
      // }));
    }

    return null;
  }


  componentDidUpdate(prevProps, prevState) {

    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/auth/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  componentWillUnmount() {
    this.props.reset('ChangePassword'); //Reset form fields all to empty

  }

  onChange = (recaptchaToken) => {
    this.setState({
      reCaptchaToken: recaptchaToken,
      btnDisabled: false,
    });
  };

  setCaptchaRef = (ref) => {
    this.setState({
      captchaRef: React.createRef(ref),
    });
  };

  generateCaptcha = (formProps) => {
    return <Captcha formProps={formProps} setCaptchaRef={this.setCaptchaRef} onChange={this.onChange} />;
  };

  onSubmit = async (formValues) => {
    const request = {
      oldPassword: formValues.password, 
      newPassword: formValues.confirmpassword
    };
    
    this.setState(() => ({
			submitted: 1
		}), () => {
			this.props.tempedgeAPI('/api/user/changePassword', request, CHANGE_PASSWORD);
		});
  };

  fireNotification = (notifyMessage) => {
    const { notify } = this.props;
    notify(notifyMessage);
  };

  render() {

    return (
      <div className="container-fluid login-container">
        <div className="row">
          <div className="col-md-12">
            <div className="login-form">
              <div className="panel panel-default login-form-panel">
                <div className="panel-heading register-header">
                  <h2 className="text-center">
                    <Translate id="com.tempedge.msg.label.change_password" />
                  </h2>
                </div>
                <form className="panel-body" onSubmit={this.props.handleSubmit(this.onSubmit)}>
                  <div className="form-group row">
                    <div className="col-12">
                      <label className="control-label">
                        <Translate id="com.tempedge.msg.label.current_password" />
                      </label>

                      <Translate>
                        {({ translate }) => (
                          <Field
                            name="password"
                            placeholder={translate('com.tempedge.msg.label.enter_current_password')}
                            type="password"
                            category="person"
                            component={InputBox}
                          />
                        )}
                      </Translate>
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-12">
                      <label className="control-label">
                        <Translate id="com.tempedge.msg.label.new_password" />
                      </label>

                      <Translate>
                        {({ translate }) => (
                          <Field
                            name="initialpassword"
                            placeholder={translate('com.tempedge.msg.label.enter_new_password')}
                            type="password"
                            category="person"
                            component={InputBox}
                          />
                        )}
                      </Translate>
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-12">
                      <label className="control-label">
                        <Translate id="com.tempedge.msg.label.confirmpassword" />
                      </label>

                      <Translate>
                        {({ translate }) => (
                          <Field
                            name="confirmpassword"
                            placeholder={translate('com.tempedge.msg.label.confirm_new_password')}
                            type="password"
                            category="person"
                            component={InputBox}
                          />
                        )}
                      </Translate>
                    </div>
                  </div>
                  <div className="form-group">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      disabled={this.props.invalid || this.props.submiting || this.props.pristine || this.state.btnDisabled}>
                      <Translate id="com.tempedge.msg.label.change_password" />
                    </button>
                  </div>
                </form>
                <div className="captcha-container">
                  <div className="center-block captcha-panel" style={{ width: '304px' }}>
                    <Field name="captcha" size="normal" height="130px" theme="light" component={this.generateCaptcha} />
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

ChangePassword.propTypes = {
  tempedgeAPI: PropTypes.func.isRequired,  
  reset: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  untouch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  let changePassword = state.tempEdge.changePassword;
  return ({
    changePassword: changePassword,
  });
};

ChangePassword = reduxForm({
  form: 'changePassword',
  validate: Validate,
})(ChangePassword);

export default withLocalize(connect(mapStateToProps, { tempedgeAPI, push, notify, reset, change, untouch })(ChangePassword));
