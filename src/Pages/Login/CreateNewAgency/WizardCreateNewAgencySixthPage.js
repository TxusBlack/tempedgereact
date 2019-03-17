import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DropdownList from 'react-widgets/lib/DropdownList';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Captcha from '../../../components/common/Captcha/Captcha';
import Validate from '../Validations/Validations';
import deleteIcon from "./assets/delete.png"; // Tell Webpack this JS file uses this image
import addIcon from "./assets/plus.png";

const $ = window.$;

class WizardCreateNewAgencySixthPage extends Component{
  constructor(props){
    super(props);

    this.addTranslationsForActiveLanguage();
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
      this.addTranslationsForActiveLanguage();
    }
  }

  addTranslationsForActiveLanguage(){
    const {activeLanguage} = this.props;

    if(!activeLanguage){
      return;
    }

    import(`../../../translations/${activeLanguage.code}.tempedge.json`)
      .then(async translations => {
        await this.props.addTranslationForLanguage(translations, activeLanguage.code);
      });
  }

  renderError(formProps){
    let fieldId='';
    let errMsg = '';

    if(typeof formProps.input !== 'undefined'){
      fieldId = `com.tempedge.error.agency.${formProps.input.name}required`;
      errMsg = formProps.meta.error;

      if(formProps.meta.touched && formProps.meta.error && typeof errMsg !== 'undefined'){
        return(
          <p style={{color: '#a94442'}}><Translate id={fieldId}>{errMsg}</Translate></p>
        );
      }
    }
  }

  renderInput = (formProps) => {
    let colClass = (formProps.input.name === "agencyname")? "col-md-12": "col-md-3";
    colClass = (formProps.label === "Phone" || formProps.label === "Telefono")? "col-md-4": colClass;
    let errorClass = `${(formProps.meta.error && formProps.meta.touched)? 'has-error': ''}`;
    let inputClass = ((formProps.label === "Phone" || formProps.label === "Telefono"))? "form-control tempEdge-input-box agency-phone-delete": "form-control tempEdge-input-box";

    return(
      <div className={colClass}>
        <label className="control-label">{formProps.label}</label>
        <div className={errorClass}>
          <input className={inputClass} placeholder={formProps.placeholder} {...formProps.input} autoComplete="off" />
          {this.renderError(formProps)}
        </div>
      </div>
    );
  }

  renderDropdownList = (formProps) => {
    let errorClass = `${(formProps.meta.error && formProps.meta.touched)? 'tempEdge-dropdown-input-box has-error-dropdown': ''}`;

    return(
      <div className={errorClass}>
        <DropdownList {...formProps.input} data={formProps.data} valueField={formProps.valueField} textField={formProps.textField} onChange={formProps.input.onChange} />
        {this.renderError(formProps)}
      </div>
    );
  }

  render(){
    let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    console.log("Sixth Page");

    return(
      <React.Fragment>
        <h2 className="text-center page-title-agency"><Translate id="com.tempedge.msg.label.newagencyregistration">New Agency Registration</Translate></h2>
        <form className="panel-body" onSubmit={this.props.onSubmit} className="form-horizontal center-block register-form-agency" style={{paddingBottom: "0px"}}>
          <div className="form-group row row-agency-name">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-2">
                  <label className="control-label pull-right" style={{paddingTop: 24}}><Translate id="com.tempedge.msg.label.agencyname">Agency</Translate></label>
                </div>
                <div className="col-md-8" style={{paddingLeft: 0, paddingRight: 71}}>
                  <Field name="agencyname" type="text" placeholder="Agency Name" component={this.renderInput} />
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
                  <Field name="weekdaysdropdown1" component={this.renderDropdownList} data={weekdays} valueField="value" textField="country" />
                </div>

                <div className="col-md-4">
                  <label className="control-label top-label-agency-form"><Translate id="com.tempedge.msg.label.payrollvalidation">Last day for payroll validation</Translate></label>
                  <Field name="weekdaysdropdown2" component={this.renderDropdownList} data={weekdays} valueField="value" textField="option" />
                </div>

                <div className="col-md-4">
                  <label className="control-label top-label-agency-form"><Translate id="com.tempedge.msg.label.fundingcompany">Select if your company uses a funding company</Translate></label>
                  <Field name="weekdaysdropdown3" component={this.renderDropdownList} data={weekdays} valueField="value" textField="option" />
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

WizardCreateNewAgencySixthPage.propTypes = {
  setActivePage: PropTypes.func.isRequired
}

WizardCreateNewAgencySixthPage = reduxForm({
  form: 'CreateNewAgency',
  destroyOnUnmount: false,
  validate: Validate
})(WizardCreateNewAgencySixthPage);

export default withLocalize(connect(null, { push })(WizardCreateNewAgencySixthPage));
