import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import Dropdown from '../../../components/common/Dropdown/Dropdown.js';
import DropdownList from 'react-widgets/lib/DropdownList';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Captcha from '../../../components/common/Captcha/Captcha';
import Validate from '../../Validations/Validations';
import deleteIcon from "./assets/delete.png"; // Tell Webpack this JS file uses this image
import addIcon from "./assets/plus.png";

const $ = window.$;

class WizardCreateNewAgencySixthPage extends Component{
  constructor(props){
    super(props);

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  state= { mounted: false }

  componentDidMount(){
    this.setState({
      mounted: true
    });
  }

  componentDidUpdate(prevProps, prevState){
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/registerAgency/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  render(){
    let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    console.log("Sixth Page");

    return(
      <React.Fragment>
        <h2 className="text-center page-title-agency"><Translate id="com.tempedge.msg.label.newagencyregistration">New Agency Registration</Translate></h2>
        <form className="panel-body" onSubmit={this.props.handleSubmit} className="form-horizontal center-block register-form-agency" style={{paddingBottom: "0px"}}>
          <div className="form-group row row-agency-name">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-2">
                  <label className="control-label pull-right" style={{paddingTop: 8}}><Translate id="com.tempedge.msg.label.agencyname">Agency</Translate></label>
                </div>
                <div className="col-md-8" style={{paddingLeft: 0, paddingRight: 71}}>
                  <Field name="agencyname" type="text" placeholder="Agency Name" category="agency" component={InputBox} />
                </div>
              </div>
            </div>
          </div>
          <div className="panel register-form-panel">
            <div className="panel-heading register-header">
              <h2 className="text-center"><Translate id="com.tempedge.msg.label.information">Information</Translate></h2>
            </div>
          </div>
          <div className="register-form-panel-inputs">
            <div className="form-group register-form wizard-register-agency-form row">
              <div className="register-agency-flex payroll-hours-validation">
                <div className="col-md-4">
                  <label className="control-label top-label-agency-form"><Translate id="com.tempedge.msg.label.payrollhours">Last date to add payroll hours</Translate></label>
                  <Field name="weekdaysdropdown1" data={weekdays} valueField="value" textField="country" category="agency" component={Dropdown} />
                </div>

                <div className="col-md-4">
                  <label className="control-label top-label-agency-form"><Translate id="com.tempedge.msg.label.payrollvalidation">Last day for payroll validation</Translate></label>
                  <Field name="weekdaysdropdown2" data={weekdays} valueField="value" textField="option" category="agency" component={Dropdown} />
                </div>

                <div className="col-md-4">
                  <label className="control-label top-label-agency-form"><Translate id="com.tempedge.msg.label.fundingcompany">Select if your company uses a funding company</Translate></label>
                  <Field name="weekdaysdropdown3" data={weekdays} valueField="value" textField="option" category="agency" component={Dropdown} />
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="panel-footer register-footer panel-footer-agency-height-override">
          <div className="prev-next-btns-agency">
            <div className="col-md-4 col-md-offset-2">
              <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={this.props.previousPage}>Back</button>
            </div>
            <div className="col-md-4">
              <button type="button" className="btn btn-primary btn-block register-save-btn next" onClick={this.props.onSubmit} disabled={this.props.invalid || this.props.submiting || this.props.pristine}><Translate id="com.tempedge.msg.label.next">Next</Translate></button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

WizardCreateNewAgencySixthPage = reduxForm({
  form: 'CreateNewAgency',
  destroyOnUnmount: false,
  validate: Validate
})(WizardCreateNewAgencySixthPage);

export default withLocalize(connect(null, { push })(WizardCreateNewAgencySixthPage));
