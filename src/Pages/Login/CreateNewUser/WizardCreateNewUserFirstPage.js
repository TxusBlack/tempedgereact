import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import { date } from 'redux-form-validators';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import Dropdown from '../../../components/common/Dropdown/Dropdown.js';
import DropdownList from 'react-widgets/lib/DropdownList'; //DO NOT REMOVE or it will break
import DateTime from '../../../components/common/DateTimePicker/DateTimePicker.js';
import DateTimePicker from 'react-widgets/lib/DateTimePicker'; //DO NOT REMOVE or it will break
import Datepicker from '../../../components/common/Datepicker/Datepicker';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import moment from 'moment';
import momentLocaliser from 'react-widgets-moment';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Validate from '../../Validations/Validations';
import { notify } from 'reapop';

const $ = window.$;

momentLocaliser(moment);

class WizardCreateNewUserFirstPage extends Component {
  constructor(props) {
    super(props);

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  state = { mounted: false };

  componentDidMount() {
    let parent = $(ReactDOM.findDOMNode(this.refs.createNewUser1));
    parent.closest('.wizard-wrapper').css('width', '1160px');
    parent.closest('.wizard-create-agency').css('width', '1398px');

    this.setState(() => ({
      mounted: true
    }));
  }

  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/register/${this.props.activeLanguage.code}`);
    }
  }

  render() {
    let signInRoute = `/auth/${this.props.activeLanguage.code}`;

    return (
      <div className="sign-up-wrapper" style={{ margin: 0 }} ref="createNewUser1">
        <Translate>
          {({ translate }) => (
            <>
              <h2 className="text-center page-title-register">{translate('com.tempedge.msg.label.sign_up')}</h2>
              <h3 className="text-center page-subtitle page-subtitle-register">{translate('com.tempedge.msg.label.sign_up.subtitle')}</h3>
              <div className="panel register-form-panel">
                <div className="panel-heading register-header">
                  <h2 className="text-center">{translate('com.tempedge.msg.label.accountinformation')}</h2>
                </div>
              </div>
              <div className="register-form-panel-inputs">
                <form className="panel-body form-horizontal center-block register-form" onSubmit={this.props.handleSubmit(this.props.onSubmit)} style={{ paddingBottom: '0px' }}>
                  <div className="form-group row">
                    {this.props.errata}
                    <div className="col-md-4">
                      <label className="control-label">{translate('com.tempedge.msg.label.firstname')}</label>
                      <Field name="firstName" type="text" placeholder={translate('com.tempedge.msg.label.firstname')} category="person" component={InputBox} />
                    </div>

                    <div className="col-md-4">
                      <label className="control-label">{translate('com.tempedge.msg.label.middlename')}</label>
                      <Field name="middleName" type="text" placeholder={translate('com.tempedge.msg.label.middlename')} category="person" component={InputBox} />
                    </div>
                    <div className="col-md-4">
                      <label className="control-label">{translate('com.tempedge.msg.label.lastname')}</label>
                      <Field name="lastName" type="text" placeholder={translate('com.tempedge.msg.label.lastname')} category="person" component={InputBox} />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-4">
                      <label className="control-label">{translate('com.tempedge.msg.label.gender')}</label>
                      <Field
                        id="genderDropdown"
                        name="gender"
                        data={[translate('com.tempedge.msg.label.gender.male'), translate('com.tempedge.msg.label.gender.female')]}
                        valueField="value"
                        textField="gender"
                        category="person"
                        component={Dropdown}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="control-label">{translate('com.tempedge.msg.label.email')}</label>
                      <Field name="email" type="email" placeholder={translate('com.tempedge.msg.label.email')} category="person" component={InputBox} />
                    </div>
                    <div className="col-md-4">
                      <label className="control-label">{translate('com.tempedge.msg.label.birthday')}</label>
                      <Field
                        name="birthday"
                        type="text"
                        placeholder={translate('com.tempedge.msg.label.birthday')}
                        category="person"
                        customClass="form-control tempEdge-input-box"
                        component={Datepicker}
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-4">
                      <label className="control-label">{translate('com.tempedge.msg.label.username')}</label>
                      <Field name="username" type="text" placeholder={translate('com.tempedge.msg.label.username')} category="person" component={InputBox} />
                    </div>

                    <div className="col-md-4">
                      <label className="control-label">{translate('com.tempedge.msg.label.password')}</label>
                      <Field name="initialpassword" type="password" placeholder={translate('com.tempedge.msg.label.password')} category="person" component={InputBox} />
                    </div>

                    <div className="col-md-4">
                      <label className="control-label">{translate('com.tempedge.msg.label.confirmpassword')}</label>
                      <Field name="confirmpassword" type="password" placeholder={translate('com.tempedge.msg.label.confirmpassword')} category="person" component={InputBox} />
                    </div>
                  </div>

                  <div className="form-group prev-next-btns">
                    <div className="col-md-6 offset-md-3">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block register-save-btn next"
                        disabled={this.props.invalid || this.props.submiting || this.props.pristine}>
                        {translate('com.tempedge.msg.label.next')}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="panel-footer register-footer">
                <div className="pull-right">
                  <span className="no-account-query">{translate('com.tempedge.msg.label.account_exists')}</span>
                  <span className="sign-in-link">
                    <Link className="create-account" to={signInRoute}>
                      {translate('com.tempedge.msg.label.sign_in')}
                    </Link>
                  </span>
                </div>
              </div>
            </>
          )}
        </Translate>
      </div>
    );
  }
}

WizardCreateNewUserFirstPage = reduxForm({
  form: 'CreateNewUser', //                 <------ form name
  destroyOnUnmount: false, //                 <------ preserve form data
  validate: Validate
})(WizardCreateNewUserFirstPage);

export default withLocalize(connect(null, { push, notify })(WizardCreateNewUserFirstPage));
