import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, reset } from 'redux-form';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import { notify } from 'reapop';
import InputBox from '../../components/common/InputBox/InputBox';
import Captcha from '../../components/common/Captcha/Captcha';
import Validate from '../Validations/Validations';
import ActiveLanguageAddTranslation from '../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation';
import { tempedgeAPI } from '../../Redux/actions/tempEdgeActions';
import types from '../../Redux/actions/types';
import { clearTempedgeStoreProp } from '../../Redux/actions/tempEdgeActions';

class ChangePassword extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { btnDisabled: true, submitted: 0 };
    const { activeLanguage } = this.props;
    const { addTranslationForLanguage } = this.props;
    ActiveLanguageAddTranslation(activeLanguage, addTranslationForLanguage);
  }

  componentDidUpdate(prevProps) {
    const { changePassword } = this.props;
    const { submitted } = this.state;
    if (submitted === 1 && changePassword) {
      if (changePassword.status === 200) {
        this.setState({
          submitted: 0
        });

        this.props.clearTempedgeStoreProp('changePassword');
        const notifyMessage = {
          position: 'br',
          dismissible: true,
          dismissAfter: 3000
        };
        if (changePassword.data.status === 200) {
          notifyMessage.title = <Translate id='com.tempedge.msg.info.title.password_changed' />;
          notifyMessage.message = <Translate id='com.tempedge.msg.info.body.password_changed' />;
          notifyMessage.status = 'success';
          this.onSuccess();
        } else {
          notifyMessage.title = <Translate id='com.tempedge.msg.info.title.invalid_password' />;
          notifyMessage.message = <Translate id='com.tempedge.msg.info.body.invalid_password' />;
          notifyMessage.status = 'error';
        }
        this.fireNotification(notifyMessage);
      }
    }

    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/auth/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  componentWillUnmount() {
    this.onSuccess();
  }

  onSuccess() {
    this.props.reset('ChangePassword'); //Reset form fields all to empty
    this.props.clearTempedgeStoreProp('changePassword');
  }

  onChange = recaptchaToken => {
    this.setState({
      reCaptchaToken: recaptchaToken,
      btnDisabled: false
    });
  };

  setCaptchaRef = ref => {
    this.setState({
      captchaRef: React.createRef(ref)
    });
  };

  generateCaptcha = formProps => <Captcha formProps={formProps} setCaptchaRef={this.setCaptchaRef} onChange={this.onChange} />;

  onSubmit = async formValues => {
    const request = {
      oldPassword: formValues.password,
      newPassword: formValues.confirmpassword
    };

    this.setState(
      () => ({
        submitted: 1
      }),
      () => {
        this.props.tempedgeAPI('/api/user/changePassword', request, types.CHANGE_PASSWORD);
      }
    );
  };

  fireNotification = notifyMessage => {
    let { notify } = this.props;
    notify(notifyMessage);
  };

  render() {
    return (
      <div className='container-fluid login-container'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='login-form'>
              <div className='panel panel-default login-form-panel'>
                <div className='panel-heading login-header'>
                  <h2 className='text-center'>
                    <Translate id='com.tempedge.msg.label.change_password' />
                  </h2>
                </div>
                <form className='panel-body' onSubmit={this.props.handleSubmit(this.onSubmit)}>
                  <div className='form-group row'>
                    <div className='col-12'>
                      <p className='text-left label-p'>
                        <Translate id='com.tempedge.msg.label.current_password' />
                      </p>

                      <Translate>
                        {({ translate }) => <Field name='password' placeholder={translate('com.tempedge.msg.label.enter_current_password')} type='password' category='person' component={InputBox} />}
                      </Translate>
                    </div>
                  </div>
                  <div className='form-group row'>
                    <div className='col-12'>
                      <p className='text-left label-p'>
                        <Translate id='com.tempedge.msg.label.new_password' />
                      </p>

                      <Translate>
                        {({ translate }) => (
                          <Field name='initialpassword' placeholder={translate('com.tempedge.msg.label.enter_new_password')} type='password' category='person' component={InputBox} />
                        )}
                      </Translate>
                    </div>
                  </div>
                  <div className='form-group row'>
                    <div className='col-12'>
                      <p className='text-left label-p'>
                        <Translate id='com.tempedge.msg.label.confirmpassword' />
                      </p>

                      <Translate>
                        {({ translate }) => (
                          <Field name='confirmpassword' placeholder={translate('com.tempedge.msg.label.confirm_new_password')} type='password' category='person' component={InputBox} />
                        )}
                      </Translate>
                    </div>
                  </div>
                  <div className='form-group'>
                    <button type='submit' className='btn btn-primary btn-block' disabled={this.props.invalid || this.props.submiting || this.props.pristine || this.state.btnDisabled}>
                      <Translate id='com.tempedge.msg.label.change_password' />
                    </button>
                  </div>
                </form>
                <div className='captcha-container'>
                  <div className='center-block captcha-panel' style={{ width: '304px' }}>
                    <Field name='captcha' size='normal' height='130px' theme='light' component={this.generateCaptcha} />
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
  clearTempedgeStoreProp: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    changePassword: state.tempEdge.changePassword ? state.tempEdge.changePassword : null
  };
};

ChangePassword = reduxForm({
  form: 'changePassword',
  validate: Validate
})(ChangePassword);

export default withLocalize(connect(mapStateToProps, { tempedgeAPI, push, notify, reset, clearTempedgeStoreProp })(ChangePassword));
