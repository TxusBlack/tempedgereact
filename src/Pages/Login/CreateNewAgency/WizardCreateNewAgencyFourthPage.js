import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Validate from '../../Validations/Validations';
import deleteIcon from "./assets/delete.png"; // Tell Webpack this JS file uses this image
import addIcon from "./assets/plus.png";

const $ = window.$;
const selector = formValueSelector('CreateNewAgency');

class WizardCreateNewAgencyFourthPage extends Component{
  constructor(props){
    super(props);

    this.addTranslationsForActiveLanguage();
  }

  state= { mounted: false, phonelabels: '' }

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

  addTranslationsForActiveLanguage = async () => {
    await ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);

    let phonelabel = $(ReactDOM.findDOMNode(this.refs.phonelabel)).text();

    if(this.state.mounted && phonelabel !== '') {
      this.setState({
        phonelabels: phonelabel
      });
    }
  }

  renderError(formProps){
    let fieldId='';

    if(typeof formProps.input !== 'undefined'){
      if(formProps.index != null || typeof formProps.index != 'undefined' || formProps.index !== ''){
        if(formProps.input.name.indexOf("recruitmentofficephonenumbers") !== -1){
           if(formProps.input.name.indexOf("officeName") !== -1){
             fieldId = `com.tempedge.error.recruitmentoffice.recruitmentofficephonenumbers.officeNamerequired`;
           }else if(formProps.input.name.indexOf("address") !== -1){
             fieldId = `com.tempedge.error.recruitmentoffice.recruitmentofficephonenumbers.addressrequired`;
           }else if(formProps.input.name.indexOf("city") !== -1){
             fieldId = `com.tempedge.error.recruitmentoffice.recruitmentofficephonenumbers.cityrequired`;
           }else if(formProps.input.name.indexOf("zip") !== -1){
             fieldId = `com.tempedge.error.recruitmentoffice.recruitmentofficephonenumbers.zipcoderequired`;
           }else if(formProps.input.name.indexOf("phonenumber") !== -1){
             fieldId = `com.tempedge.error.recruitmentoffice.recruitmentofficephonenumbers.phonenumberrequired`;
          }
        }
      }

      if(formProps.meta.touched && formProps.meta.error && typeof formProps.meta.error !== 'undefined'){
        return(
          <p style={{color: '#a94442'}}><Translate id={fieldId}>{formProps.meta.error}</Translate></p>
        );
      }
    }
  }

  renderPhoneNumberInputs = (formProps) => {
    let recruitment_office = formProps.label.split(" ");

    if(this.props.activeLanguage.code === 'en'){
      recruitment_office[0] = (recruitment_office[0] === 'OfficeName')? 'Office Name': '';
    }else if(this.props.activeLanguage.code === 'es'){
      recruitment_office[0] = (recruitment_office[0] === 'NombredeOficina')? 'Nombre de Oficina': '';
    }

    if(formProps.fields.length < 1){
      formProps.fields.push({});
    }

    let block = formProps.fields.map((recruitmentOffice, index) => {
      return(
        <div key={index} className="recruitment-office-row">
          <div className="row">
            <Field name={`${recruitmentOffice}.officeName`} type="text" placeholder="Office Name" index={index} label={recruitment_office[0]} fields={formProps.fields} component={this.renderInput} />
            <Field name={`${recruitmentOffice}.address`} type="text" placeholder="Address" index={index} label={recruitment_office[1]} fields={formProps.fields} component={this.renderInput} />
          </div>

          <div className="row">
            <Field name={`${recruitmentOffice}.city`} type="text" placeholder="City" index={index} label={recruitment_office[2]} fields={formProps.fields} component={this.renderInput} />
            <Field name={`${recruitmentOffice}.zip`} type="text" placeholder="Zip Code" index={index} label={recruitment_office[3]} fields={formProps.fields} component={this.renderInput} />
            <Field name={`${recruitmentOffice}.phonenumber`} type="text" placeholder="xxx-xxx-xxxx" index={index} label={recruitment_office[4]} fields={formProps.fields} component={this.renderInput} />
          </div>
        </div>
      );
    });

    let addBtn = (
      <div>
        <div className="row">
          <span className="center-block pull-right add-fieldArray-btn" onClick={() => formProps.fields.push({})}><img src={addIcon} alt="addIcon" /></span>
        </div>
      </div>
    );

    return(
      <React.Fragment>
        <div className="clearfix recruiting-office-phone">
          <label className="pull-left checkbox-inline">
            <Translate id="com.tempedge.msg.label.recruitingoffice">Recruiting Office</Translate>
          </label>
          <Field name="recruitingofficecheckbox" id="recruitingoffice" component="input" type="checkbox"/>
        </div>
        <div>
          { (!this.props.checkbox || typeof this.props.checkbox === 'undefined')? block: '' }
          { (!this.props.checkbox || typeof this.props.checkbox === 'undefined')? addBtn: ''}
        </div>
      </React.Fragment>
    );
  }

  renderInput = (formProps) => {
    let colClass;
    let errorClass = `${(formProps.meta.error && formProps.meta.touched)? 'has-error': ''}`;
    let inputClass = (formProps.label === "Phone" || formProps.label === "Telefono")? "form-control tempEdge-input-box agency-phone-delete": "form-control tempEdge-input-box";
    let deleteIconClass = "pull-right delete-btn";

    if(formProps.input.name.indexOf("officeName") !== -1){
      colClass = "col-md-4";
    }else if(formProps.input.name.indexOf("address") !== -1){
      colClass = "col-md-8";
      inputClass = "form-control tempEdge-input-box agency-phone-delete";
    }else if(formProps.input.name === "agencyname"){
      colClass = "col-md-12";
    }else{
      colClass = "col-md-4";
    }

    return(
      <div className={colClass}>
        <label className="control-label">{formProps.label}</label>
        { (formProps.label === "Phone" || formProps.label === "Telefono")? <span className={deleteIconClass} title="Remove Agency" onClick={() => formProps.fields.remove(formProps.index)}><img className="delete-icon" src={deleteIcon} alt="deleteIcon" /></span>: '' }
        <div className={errorClass}>
          <input className={inputClass} placeholder={formProps.placeholder} {...formProps.input} autoComplete="off" />
          {this.renderError(formProps)}
        </div>
      </div>
    );
  }

  render(){
    console.log("Fourth Page");

    return(
      <React.Fragment>
        <h2 className="text-center page-title-agency"><Translate id="com.tempedge.msg.label.newagencyregistration">New Agency Registration</Translate></h2>
        <form className="panel-body" onSubmit={this.props.handleSubmit} className="form-horizontal center-block register-form-agency" style={{paddingBottom: "0px"}}>
          <div className="form-group row row-agency-name">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-2">
                  <label className="control-label pull-right agency-label"><Translate id="com.tempedge.msg.label.agencyname">Agency</Translate></label>
                </div>
                <div className="col-md-8" style={{paddingLeft: 0, paddingRight: 71}}>
                  <Field name="agencyname" type="text" placeholder="Agency Name" component={InputBox} />
                </div>
              </div>
            </div>
          </div>
          <div className="panel register-form-panel">
            <div className="panel-heading register-header">
              <h2 className="text-center"><Translate id="com.tempedge.msg.label.recruitingoffice">Recruiting Office</Translate></h2>
            </div>
          </div>
          <div className="register-form-panel-inputs">
            <div className="form-group register-form wizard-register-agency-form row">
              <div className="register-agency-flex">
                <div className="col-md-12">
                  <span className="translation-placeholder" ref="phonelabel"><Translate id="com.tempedge.msg.label.recruitmentofficephonenumbers">OfficeName Address City Zip Phone</Translate></span>
                  <FieldArray name="recruitmentofficephonenumbers" type="text" placeholder="Phone Number" label={this.state.phonelabels} component={this.renderPhoneNumberInputs} />
                </div>
              </div>
            </div>
          </div>

          <div className="panel-footer register-footer panel-footer-agency-height-override">
            <div className="prev-next-btns-agency">
              <div className="col-md-4 col-md-offset-2">
                <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={this.props.previousPage}>Back</button>
              </div>
              <div className="col-md-4">
                <button type="submit" className="btn btn-primary btn-block register-save-btn next" disabled={this.props.invalid || this.props.pristine}><Translate id="com.tempedge.msg.label.next">Next</Translate></button>
              </div>
            </div>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

WizardCreateNewAgencyFourthPage = reduxForm({
  form: 'CreateNewAgency',
  destroyOnUnmount: false,
  validate: Validate
})(WizardCreateNewAgencyFourthPage);

WizardCreateNewAgencyFourthPage = connect(
  state => ({
    checkbox: selector(state, 'recruitingofficecheckbox')
  })
)(WizardCreateNewAgencyFourthPage)

export default withLocalize(connect(null, { push })(WizardCreateNewAgencyFourthPage));
