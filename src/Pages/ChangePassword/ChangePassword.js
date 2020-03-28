import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, reset } from 'redux-form';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import InputBox from '../../components/common/InputBox/InputBox';
import Captcha from '../../components/common/Captcha/Captcha';
import Validate from '../Validations/Validations';
import ActiveLanguageAddTranslation from '../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation';
import { tempedgeAPI, clearTempedgeStoreProp } from '../../Redux/actions/tempEdgeActions';
import types from '../../Redux/actions/types';
import OutcomeBar from '../../components/common/OutcomeBar';
import { notify } from 'reapop';

const requestUrl = '/api/user/changePassword';

class ChangePassword extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { btnDisabled: true, submitted: 0 };
    const { activeLanguage } = this.props;
    const { addTranslationForLanguage } = this.props;
    ActiveLanguageAddTranslation(activeLanguage, addTranslationForLanguage);
  }

  componentDidUpdate(prevProps) {
    const { changePassword, clearTempedgeStoreProp, push, activeLanguage, addTranslationForLanguage } = this.props;
    const { submitted } = this.state;
    if (changePassword && submitted === 1) {
      this.setState({
        submitted: 0,
      });
      if (changePassword.status === 200) {
        clearTempedgeStoreProp('changePassword');
        if (changePassword.data.status === 200) {
          this.showSuccessResultBar('com.tempedge.msg.info.msg.success');
          this.resetChangePasswordForm();
        } else {
          this.showErrorResultBar('com.tempedge.msg.info.body.invalid_password');
        }
      } else {
        this.showErrorResultBar('com.tempedge.error.undefine');
      }
    }

    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/user/changePass/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  componentWillUnmount() {
    this.resetChangePasswordForm();
  }

  onChange = (recaptchaToken) => {
    this.setState({
      recaptchaToken,
      btnDisabled: false,
    });
  };

  setCaptchaRef = (ref) => {
    this.setState({
      captchaRef: React.createRef(ref),
    });
  };

  generateCaptcha = (formProps) => <Captcha formProps={formProps} setCaptchaRef={this.setCaptchaRef} onChange={this.onChange} />;

  onSubmit = async (formValues) => {
    const request = {
      oldPassword: formValues.password,
      newPassword: formValues.confirmpassword,
    };

    this.setState(
      () => ({
        submitted: 1,
      }),
      () => {
        this.props.tempedgeAPI(requestUrl, request, types.CHANGE_PASSWORD);
      },
    );
  };

  showResultBar(translateId, messageType) {
    this.setState({
      resultBar: <OutcomeBar classApplied={`announcement-bar ${messageType}`} translateId={translateId} />,
    });
  }

  showSuccessResultBar(translateId) {
    this.showResultBar(translateId, 'success');
  }

  showErrorResultBar(translateId) {
    this.showResultBar(translateId, 'fail');
  }

  resetChangePasswordForm() {
    const { reset, clearTempedgeStoreProp } = this.props;
    reset('ChangePassword'); // Reset form fields all to empty
    clearTempedgeStoreProp('changePassword');
  }

  render() {
    const { resultBar, btnDisabled } = this.state;
    const { handleSubmit, invalid, submiting, pristine } = this.props;
    return (
      <div className="container-fluid login-container">
        <div className="row">
          <div className="col-md-12">
            <div className="login-form">
              <div className="panel panel-default login-form-panel">
                <div className="panel-heading login-header">
                  <h2 className="text-center">
                    <Translate id="com.tempedge.msg.label.change_password" />
                  </h2>
                </div>
                <form className="panel-body" onSubmit={handleSubmit(this.onSubmit)}>
                  <div className="form-group row">
                    <div className="col-12">{resultBar}</div>
                  </div>
                  <div className="form-group row">
                    <div className="col-12">
                      <p className="text-left label-p">
                        <Translate id="com.tempedge.msg.label.current_password" />
                      </p>

                      <Translate>
                        {({ translate }) => <Field name="password" placeholder={translate('com.tempedge.msg.label.enter_current_password')} type="password" category="person" component={InputBox} />}
                      </Translate>
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-12">
                      <p className="text-left label-p">
                        <Translate id="com.tempedge.msg.label.new_password" />
                      </p>

                      <Translate>
                        {({ translate }) => (
                          <Field name="initialpassword" placeholder={translate('com.tempedge.msg.label.enter_new_password')} type="password" category="person" component={InputBox} />
                        )}
                      </Translate>
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-12">
                      <p className="text-left label-p">
                        <Translate id="com.tempedge.msg.label.confirmpassword" />
                      </p>

                      <Translate>
                        {({ translate }) => (
                          <Field name="confirmpassword" placeholder={translate('com.tempedge.msg.label.confirm_new_password')} type="password" category="person" component={InputBox} />
                        )}
                      </Translate>
                    </div>
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block" disabled={invalid || submiting || pristine || btnDisabled}>
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
  tempedgeAPI: PropTypes.func.isRequired,
  clearTempedgeStoreProp: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    changePassword: state.tempEdge.changePassword ? state.tempEdge.changePassword : null,
  };
};

ChangePassword = reduxForm({
  form: 'changePassword',
  validate: Validate,
})(ChangePassword);

export default withLocalize(connect(mapStateToProps, { tempedgeAPI, push, reset, clearTempedgeStoreProp, notify })(ChangePassword));
