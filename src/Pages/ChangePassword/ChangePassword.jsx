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
import { doLogin } from '../../Redux/actions/tempEdgeActions';

class ChangePassword extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { captchaRef: null, reCaptchaToken: '', btnDisabled: true };

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  componentDidMount = () => {};

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
    let values = formValues;
    values.grant_type = 'password';

    await this.props.doLogin('/api/login', values);

    this.fireNotification();
  };

  fireNotification = () => {
    const { notify } = this.props;

    notify({
      title: 'Login Submitted',
      message: 'you clicked on the Submit button',
      status: 'success',
      position: 'br',
      dismissible: true,
      dismissAfter: 3000,
    });
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
                      <Field name="password" placeholder="Enter your current password" type="text" category="person" component={InputBox} />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-12">
                      <label className="control-label">
                        <Translate id="com.tempedge.msg.label.new_password" />
                      </label>
                      <Field name="initialpassword" placeholder="Enter your new password" type="password" category="person" component={InputBox} />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-12">
                      <label className="control-label">
                        <Translate id="com.tempedge.msg.label.confirmpassword" />
                      </label>
                      <Field name="confirmpassword" placeholder="Comfirm your new password" type="password" category="person" component={InputBox} />
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
  reset: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  untouch: PropTypes.func.isRequired,
};

//Current REDUX state
const mapStateToProps = (state) => {};

ChangePassword = reduxForm({
  form: 'ChangePassword',
  destroyOnUnmount: false, //        <------ preserve form data
  validate: Validate,
})(ChangePassword);

export default withLocalize(connect(mapStateToProps, { doLogin, push, notify, reset, change, untouch })(ChangePassword));
