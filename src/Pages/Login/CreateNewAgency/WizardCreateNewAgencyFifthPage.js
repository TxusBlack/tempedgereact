import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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

class WizardCreateNewAgencyFifthPage extends Component{
  constructor(props){
    super(props);

    this.addTranslationsForActiveLanguage();
  }

  state= { mounted: false, salespersonlabels: '', captchaRef: null, reCaptchaToken: '', btnDisabled: true }

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

        let phonelabel = $(ReactDOM.findDOMNode(this.refs.phonelabel)).text();

        if(this.state.mounted && phonelabel != '') {
          this.setState({
            salespersonlabels: phonelabel
          });
        }
      });
  }

  renderError(formProps){
    let fieldId='';

    if(typeof formProps.input !== 'undefined'){
      if(formProps.index != null || typeof formProps.index != 'undefined' || formProps.index != ''){
        if(formProps.input.name.indexOf("recruitmentofficesalespersons") !== -1){
           if(formProps.input.name.indexOf("salespersonfirstname") !== -1){
             fieldId = `com.tempedge.error.recruitmentoffice.recruitmentofficesalespersons.salespersonfirstnamerequired`;
           }else if(formProps.input.name.indexOf("salespersonlastname") !== -1){
             fieldId = `com.tempedge.error.recruitmentoffice.recruitmentofficesalespersons.salespersonlastnamerequired`;
           }else if(formProps.input.name.indexOf("salespersongenre") !== -1){
             fieldId = `com.tempedge.error.recruitmentoffice.recruitmentofficesalespersons.salespersongenrerequired`;
           }else if(formProps.input.name.indexOf("salespersonphonenumber") !== -1){
             fieldId = `com.tempedge.error.recruitmentoffice.recruitmentofficesalespersons.salespersonphonenumberrequired`;
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

  renderSalesPersonInputs = (formProps) => {
    let errorClass = `col-xs-10 ${(formProps.meta.error && formProps.meta.touched)? 'has-error': ''}`;
    let recruitment_office = formProps.label.split(" ");

    if(formProps.fields.length < 1){
      formProps.fields.push({});
    }

    let block = formProps.fields.map((salesPerson, index) => (
      <div key={index}>
        <Field name={`${salesPerson}.salespersonfirstname`} type="text" placeholder="First Name" index={index} label={recruitment_office[0]} fields={formProps.fields} component={this.renderInput} />
        <Field name={`${salesPerson}.salespersonlastname`} type="text" placeholder="Last Name" index={index} label={recruitment_office[1]} fields={formProps.fields} component={this.renderInput} />
        <div className="col-md-2">
          <label className="control-label">{recruitment_office[2]}</label>
          <div className="gender-radio-group">
            <label style={{paddingRight: 7}}><Field name={`${salesPerson}.salespersongenre`} type="radio" index={index} value="male" fields={formProps.fields} component="input" /><span className="radio-label">{recruitment_office[3]}</span></label>
            <label><Field name={`${salesPerson}.salespersongenre`} type="radio" index={index} value="female" fields={formProps.fields} component="input" /><span className="radio-label">{recruitment_office[4]}</span></label>
          </div>
        </div>
        <Field name={`${salesPerson}.salespersonphonenumber`} type="text" placeholder="xxx-xxx-xxxx" index={index} label={recruitment_office[5]} fields={formProps.fields} component={this.renderInput} />
      </div>
    ));

    return(
      <React.Fragment>
        <div>
          { block }
          <div>
            <div className="row">
              <span className="center-block pull-right add-fieldArray-btn" onClick={() => formProps.fields.push({})}><img src={addIcon} /></span>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  renderInput = (formProps) => {
    let colClass = (formProps.input.name === "agencyname")? "col-md-12": "col-md-3";
    colClass = (formProps.label === "Phone" || formProps.label === "Telefono")? "col-md-4": colClass;
    let errorClass = `${(formProps.meta.error && formProps.meta.touched)? 'has-error': ''}`;
    let inputClass = ((formProps.label === "Phone" || formProps.label === "Telefono"))? "form-control tempEdge-input-box agency-phone-delete": "form-control tempEdge-input-box";

    return(
      <div className={colClass}>
        <label className="control-label">{formProps.label}</label>
        { ((formProps.label === "Phone" || formProps.label === "Telefono") && (formProps.index > 0))? <span className="pull-right delete-btn" title="Remove Salesman" onClick={() => formProps.fields.remove(formProps.index)}><img className="delete-icon" src={deleteIcon} /></span>: '' }
        <div className={errorClass}>
          <input className={inputClass} placeholder={formProps.placeholder} {...formProps.input} autoComplete="off" />
          {this.renderError(formProps)}
        </div>
      </div>
    );
  }

  onChange = (recaptchaToken) => {
    console.log("recaptchaToken: ", recaptchaToken);

    this.setState({
      reCaptchaToken: recaptchaToken,
      btnDisabled: false
    });
  }

  setCaptchaRef = (ref) => {
    this.setState(
      () => {
        return{
          captchaRef: React.createRef(ref)
        }
    });
  }

  generateCaptcha = (formProps) => {
    return <Captcha formProps={formProps} setCaptchaRef={this.setCaptchaRef} onChange={this.onChange} />;
  }

  render(){
    console.log("Fifth Page");

    return(
      <React.Fragment>
        <h2 className="text-center page-title-agency"><Translate id="com.tempedge.msg.label.newagencyregistration">New Agency Registration</Translate></h2>
        <form className="panel-body" onSubmit={this.props.onSubmit} className="form-horizontal center-block register-form-agency" style={{paddingBottom: "0px"}}>
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
              <h2 className="text-center"><Translate id="com.tempedge.msg.label.salesperson">Salesmen</Translate></h2>
            </div>
          </div>
          <div className="register-form-panel-inputs">
            <div className="form-group register-form wizard-register-agency-form row">
              <div className="register-agency-flex">
                <div className="col-md-12">
                  <span className="translation-placeholder" ref="phonelabel"><Translate id="com.tempedge.msg.label.recruitmentofficesalespersongenre">FirstName LastName Gender Male Female Phone</Translate></span>
                  <FieldArray name="recruitmentofficesalespersons" type="text" label={this.state.salespersonlabels} component={this.renderSalesPersonInputs} />
                </div>
              </div>

              <div className="row">
              <div className="col-md-12">
                <div className="center-block new-agency-captcha">
                  <Field name='captcha' size="normal" height="130px" theme="light" component={this.generateCaptcha} />
                </div>
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
              <button type="button" className="btn btn-primary btn-block register-save-btn next" onClick={this.props.onSubmit} disabled={this.props.invalid || this.props.submiting || this.props.pristine || this.state.btnDisabled}><Translate id="com.tempedge.msg.label.submit">Submit</Translate></button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

WizardCreateNewAgencyFifthPage.propTypes = {
  setActivePage: PropTypes.func.isRequired
}

WizardCreateNewAgencyFifthPage = reduxForm({
  form: 'CreateNewAgency',
  destroyOnUnmount: false,
  validate: Validate
})(WizardCreateNewAgencyFifthPage);

export default withLocalize(connect(null, { push })(WizardCreateNewAgencyFifthPage));
