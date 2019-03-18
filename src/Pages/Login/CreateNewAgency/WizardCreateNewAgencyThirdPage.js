import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Field, FieldArray, reduxForm } from 'redux-form';
import DropdownList from 'react-widgets/lib/DropdownList';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Validate from '../Validations/Validations';
import deleteIcon from "./assets/delete.png"; // Tell Webpack this JS file uses this image
import addIcon from "./assets/plus.png";

const $ = window.$;

class WizardCreateNewAgencyThirdPage extends Component{
  constructor(props){
    super(props);

    this.addTranslationsForActiveLanguage();
  }

  state= { mounted: false, phonelabels: '' }

  componentDidMount(){
    this.setState({
      mounted: true,
      phonelabels: 'Phone: Extension: Phone Type'
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

    if (!activeLanguage) {
      return;
    }

    import(`../../../translations/${activeLanguage.code}.tempedge.json`)
      .then(async translations => {
        await this.props.addTranslationForLanguage(translations, activeLanguage.code);

        let phonelabel = $(ReactDOM.findDOMNode(this.refs.phonelabel)).text();

        if(this.state.mounted && phonelabel != '') {
          this.setState({
            phonelabels: phonelabel
          });
        }
      });
  }

  renderError(formProps){
    let fieldId='';

    if(typeof formProps.input !== 'undefined'){
      if(formProps.index != null || typeof formProps.index != 'undefined' || formProps.index != ''){
        if(formProps.input.name.indexOf("agencyphonenumbers") !== -1 || formProps.input.name.indexOf("phonenumber_0")!== -1)
          fieldId = `com.tempedge.error.agency.agencyphonenumbers.phonenumberrequired`;
      }else
        fieldId = `com.tempedge.error.agency.${formProps.input.name}phonenumberrequiredrequired`;

      if(formProps.meta.touched && formProps.meta.error && typeof formProps.meta.error !== 'undefined'){
        return(
          <p style={{color: '#a94442'}}><Translate id={fieldId}>{formProps.meta.error}</Translate></p>
        );
      }
    }
  }

  renderPhoneNumberInputs = (formProps) => {
    let phoneTypeList = ["fax", "local", "other", "toll-free", "tty"];
    let errorClass = `${(formProps.meta.error && formProps.meta.touched)? 'has-error': ''}`;

    if(formProps.fields.length < 1){
      formProps.fields.push({});
    }

    return(
      <div className="list" style={{padding: 0}}>
        {formProps.fields.map((agency, index) => (
          <div key={index} className="list-item row">
            <Field name={`${agency}.phonenumber`} type="text" index={index} placeholder="xxx-xxx-xxxx" label={formProps.label.substring(0, formProps.label.indexOf(":"))} component={this.renderInput} />
            <Field name={`${agency}.phoneext`} type="text" index={index} placeholder="xxxx" label={formProps.label.substring(formProps.label.indexOf(":")+2, formProps.label.lastIndexOf(":"))} component={this.renderInput} />
            <Field name={`${agency}.phonetype`} label={formProps.label.substring(formProps.label.lastIndexOf(":")+2, formProps.label.lenght)} index={index} fields={formProps.fields} component={this.renderDropdownList} data={phoneTypeList} valueField="value" textField="option" />
          </div>
        ))}
        <div className="list-item">
          <div className="row">
            <span className="center-block pull-right add-fieldArray-btn" onClick={() => formProps.fields.push({})}><img src={addIcon} /></span>
          </div>
        </div>
      </div>
    );
  }

  renderInput = (formProps) => {
    let colClass = (formProps.input.name === "agencyname")? "col-md-12": "col-md-4";
    let errorClass = `${(formProps.meta.error && formProps.meta.touched)? 'has-error': ''}`;

    return(
      <div className={colClass}>
        <label className="control-label">{formProps.label}</label>
          <div className={errorClass}>
            <input className="form-control tempEdge-input-box" placeholder={formProps.placeholder} {...formProps.input} autoComplete="off" />      {/*<input onChange={formProps.input.onChange} value={formProps.input.value} />*/}
              {this.renderError(formProps)}
          </div>
      </div>
    );
  }

  renderDropdownList = (formProps) => {
    let errorClass = `${(formProps.meta.error && formProps.meta.touched)? 'tempEdge-dropdown-input-box has-error-dropdown': ''}`;

    return(
      <div className="col-md-4 agency-phone-type">
        <label className="control-label">{formProps.label}</label>
        <div className={errorClass}>
          <DropdownList {...formProps.input} data={formProps.data} valueField={formProps.valueField} textField={formProps.textField} onChange={formProps.input.onChange} />
          {this.renderError(formProps)}
        </div>
        { (formProps.index > 0)? <span className="pull-right" title="Remove Agency" onClick={() => formProps.fields.remove(formProps.index)}><img className="delete-icon" src={deleteIcon} /></span>: '' }
      </div>
    );
  }

  render(){
    console.log("Third Page");

    return(
      <React.Fragment>
        <h2 className="text-center page-title-agency"><Translate id="com.tempedge.msg.label.newagencyregistration">New Agency Registration</Translate></h2>
        <form className="panel-body" onSubmit={(e) => e.preventDefault} className="form-horizontal center-block register-form-agency" style={{paddingBottom: "0px"}}>
          <div className="form-group row row-agency-name">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-2">
                  <label className="control-label pull-right" style={{paddingTop: 13}}><Translate id="com.tempedge.msg.label.agencyname">Agency</Translate></label>
                </div>
                <div className="col-md-8" style={{paddingLeft: 0, paddingRight: 71}}>
                  <Field name="agencyname" type="text" placeholder="Agency Name" component={this.renderInput} />
                </div>
              </div>
            </div>
          </div>
          <div className="panel register-form-panel">
            <div className="panel-heading register-header">
              <h2 className="text-center"><Translate id="com.tempedge.msg.label.phones">Phones</Translate></h2>
            </div>
          </div>
          <div className="register-form-panel-inputs">
            <div className="form-group register-form wizard-register-agency-form row">
              <div className="register-agency-flex">
                <div className="col-md-12">
                  <span className="translation-placeholder" ref="phonelabel"><Translate id="com.tempedge.msg.label.newagencyphonenumber">Phone: Extension: Phone Type</Translate></span>
                  <FieldArray name="agencyphonenumbers" type="text" placeholder="Phone Number" label={this.state.phonelabels} component={this.renderPhoneNumberInputs} />
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
              <button type="button" className="btn btn-primary btn-block register-save-btn next" onClick={this.props.onSubmit} disabled={this.props.invalid || this.props.pristine}><Translate id="com.tempedge.msg.label.next">Next</Translate></button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

WizardCreateNewAgencyThirdPage = reduxForm({
  form: 'CreateNewAgency',
  destroyOnUnmount: false,
  validate: Validate
})(WizardCreateNewAgencyThirdPage);

export default withLocalize(connect(null, { push })(WizardCreateNewAgencyThirdPage));
