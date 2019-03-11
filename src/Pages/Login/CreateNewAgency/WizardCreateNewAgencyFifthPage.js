import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Captcha from '../../../components/common/Captcha/Captcha';
import Validate from '../Validations/Validations';

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

    let block = formProps.fields.map((recruitmentOffice, index) => (
      <li key={index} className="agency-phone-li">
        <div className="row">
          { (index > 0)? <button type="button" className="pull-right phone-num-btn-close" title="Remove Salesperson" onClick={() => formProps.fields.remove(index)}>X</button>: '' }
        </div>
        <Field name={`${recruitmentOffice}.salespersonfirstname`} type="text" placeholder="First Name" index={index} label={recruitment_office[0]} component={this.renderInput} />
        <Field name={`${recruitmentOffice}.salespersonlastname`} type="text" placeholder="Last Name" index={index} label={recruitment_office[1]} component={this.renderInput} />
        <div className="row agency-phone-box">
          <label className="col-xs-2 control-label">{recruitment_office[2]}</label>
          <div className="col-xs-10">
            <label><Field name={`${recruitmentOffice}.salespersongenre`} type="radio" index={index} value="male" component="input" />{recruitment_office[3]}</label><br />
            <label><Field name={`${recruitmentOffice}.salespersongenre`} type="radio" index={index} value="female" component="input" />{recruitment_office[4]}</label>
          </div>
        </div>
        <Field name={`${recruitmentOffice}.salespersonphonenumber`} type="text" placeholder="xxx-xxx-xxxx" index={index} label={recruitment_office[5]} component={this.renderInput} />
      </li>
    ));

    return(
      <React.Fragment>
        <ul>
          { block }
          <li>
            <div className="row">
              <button type="button" className="center-block" onClick={() => formProps.fields.push({})}>Add a New Salesperson</button>
            </div>
          </li>
        </ul>
      </React.Fragment>
    );
  }

  renderInput = (formProps) => {
    let errorClass = `col-xs-10 ${(formProps.meta.error && formProps.meta.touched)? 'has-error': ''}`;

    return(
      <React.Fragment>
        <div className="row agency-phone-box">
          <label className="col-xs-2 control-label">{formProps.label}</label>
          <div className={errorClass}>
            <input className="form-control" placeholder={formProps.placeholder} {...formProps.input} autoComplete="off" />
            {this.renderError(formProps)}
          </div>
        </div>
      </React.Fragment>
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
      }
    );
  }

  generateCaptcha = (formProps) => {
    return <Captcha formProps={formProps} setCaptchaRef={this.setCaptchaRef} onChange={this.onChange} />;
  }

  render(){
    console.log("Fifth Page");

    return(
      <React.Fragment>
        <h2 className="text-center page-title"><Translate id="com.tempedge.msg.label.newagency">New Agency</Translate></h2>
        <form onSubmit={this.props.handleSubmit(this.props.onSubmit)} className="form-horizontal center-block register-form" style={{width: "40%", padding: "30px 0"}}>
          <div className="form-group">
            <span className="translation-placeholder" ref="phonelabel"><Translate id="com.tempedge.msg.label.recruitmentofficesalespersongenre">FirstName LastName Sex Male Female Phone</Translate></span>
            <FieldArray name="recruitmentofficesalespersons" type="text" placeholder="Phone Number" label={this.state.salespersonlabels} component={this.renderSalesPersonInputs} />
          </div>
          <div className="form-group prev-next-btns">
            <div className="col-md-4 col-md-offset-2">
              <button type="button" className="btn btn-primary btn-block register-save-btn previous" onClick={this.props.previousPage}>Previous</button>
            </div>
            <div className="col-md-4">
              <button type="submit" className="btn btn-primary btn-block register-save-btn next" disabled={this.props.invalid || this.props.submiting || this.props.pristine || this.state.btnDisabled}><Translate id="com.tempedge.msg.label.submit">Submit</Translate></button>
            </div>
          </div>
        </form>
        <div className="row">
          <div className="col-md-12">
            <div className="center-block new-agency-captcha">
              <Field name='captcha' size="normal" height="130px" theme="light" component={this.generateCaptcha} />
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
