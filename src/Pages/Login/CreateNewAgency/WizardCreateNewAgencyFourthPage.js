import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import  { setActivePage } from '../../../Redux/actions/tempEdgeActions';
import ReCaptcha from "react-google-recaptcha";
import keys from '../../../apiKeys/keys';

const $ = window.$;

class WizardCreateNewAgencyFourthPage extends Component{
  constructor(props){
    super(props);

    this.addTranslationsForActiveLanguage();
  }

  state= { mounted: false, phonelabels: '' }

  componentDidMount(){
    this.setState({
      mounted: true,
      phonelabels: 'OfficeName Address City Phone'
    });
  }

  componentDidUpdate(prevProps, prevState){
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.params.lang = this.props.activeLanguage.code;
      this.props.history.location.pathname = `/registerAgency/${this.props.activeLanguage.code}`;
      this.props.history.push(`/registerAgency/${this.props.activeLanguage.code}`);
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
            phonelabels: phonelabel
          });
        }
      });
  }

  renderError(formProps){
    let fieldId='';

    console.log("formProps: ", formProps);

    return '';
    // if(typeof formProps.input !== 'undefined'){
    //   if(formProps.index != null || typeof formProps.index != 'undefined' || formProps.index != ''){
    //     if(formProps.input.name.indexOf("recruitmentofficephonenumbers") !== -1){
    //        if(formProps.input.name.indexOf("officeName") !== -1){
    //          fieldId = `com.tempedge.error.recruitmentoffice.recruitmentofficephonenumbers.officeNamerequired`;
    //        }else if(formProps.input.name.indexOf("address") !== -1){
    //          fieldId = `com.tempedge.error.recruitmentoffice.recruitmentofficephonenumbers.addressrequired`;
    //        }else if(formProps.input.name.indexOf("city") !== -1){
    //          fieldId = `com.tempedge.error.recruitmentoffice.recruitmentofficephonenumbers.cityrequired`;
    //        }else if(formProps.input.name.indexOf("phonenumber") !== -1){
    //          fieldId = `com.tempedge.error.recruitmentoffice.recruitmentofficephonenumbers.phonenumberrequired`;
    //       }
    //     }
    //   }
    //
    //   if(formProps.meta.touched && formProps.meta.error && typeof formProps.meta.error !== 'undefined'){
    //     return(
    //       <p style={{color: '#a94442'}}>{formProps.meta.error}</p>
    //     );
    //   }
    // }
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
          <label class="col-xs-2 control-label">{recruitment_office[2]}</label>
          <div class="col-xs-10">
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
    }, () => {
      console.log("this.state.btnDisabled: ", this.state.btnDisabled);
    })
  }

  renderReCaptcha = (formProps) => {
    let errorClass = `col-xs-12 ${(formProps.meta.error && formProps.meta.touched)? 'has-error-login login-input-error': 'login-input'}`;

    return(
      <div className={errorClass}>
        <ReCaptcha
            ref={(ref) => {this.captcha = ref;}}
            size={formProps.size}
            height={formProps.height}
            theme={formProps.theme}
            sitekey={keys.RECAPTCHA_SITE_KEY}
            onChange={this.onChange}
        />
      </div>
    );
  }

  onSubmit(formValues){
    console.log(formValues);
  }

  render(){
    console.log("Fourth Page");

    return(
      <React.Fragment>
        <h2 className="text-center page-title"><Translate id="com.tempedge.msg.label.newagency">New Agency</Translate></h2>
        <form onSubmit={this.props.handleSubmit(this.props.onSubmit)} className="form-horizontal center-block register-form" style={{width: "40%", padding: "30px 0"}}>
          <div className="form-group">
            <span className="translation-placeholder" ref="phonelabel"><Translate id="com.tempedge.msg.label.recruitmentofficesalespersongenre">FirstName LastName Sex Male Female Phone</Translate></span>
            <FieldArray name="recruitmentofficephonenumbers" type="text" placeholder="Phone Number" label={this.state.phonelabels} component={this.renderSalesPersonInputs} />
          </div>
          <div className="form-group prev-next-btns">
            <div className="col-md-4 col-md-offset-2">
              <button type="button" className="btn btn-primary btn-block register-save-btn previous" onClick={this.props.previousPage}>Previous</button>
            </div>
            <div className="col-md-4">
              <button type="submit" className="btn btn-primary btn-block register-save-btn next" disabled={this.props.invalid || this.props.pristine}><Translate id="com.tempedge.msg.label.submit">Submit</Translate></button>
            </div>
          </div>
        </form>
        <div className="row">
          <div className="col-md-12">
            <div className="center-block new-agency-captcha">
              <Field name='captcha' size="normal" height="130px" theme="light" component={this.renderReCaptcha} />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

let validate = (formValues) => {
  let errors = {};

  if (!formValues.recruitmentofficephonenumbers || !formValues.recruitmentofficephonenumbers.length) {
    errors.recruitmentofficephonenumbers = { _error: 'At least one recruitment office phone number must be entered.' };
  }else{
    let recruitmentofficephonenumbersArrayErrors = [];

    formValues.recruitmentofficephonenumbers.forEach((recruitmentoffice, index) => {
      let recruitmentofficephonenumbersErrors = {};
      let regX = new RegExp(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g);

      if (!regX.test(recruitmentoffice.phonenumber)){
        recruitmentofficephonenumbersErrors.phonenumber = 'Enter the recruitment office phone number.';
      }

      if(!recruitmentoffice.officeName){
        recruitmentofficephonenumbersErrors.officeName = 'Enter the recruitment office name.';
      }

      if(!recruitmentoffice.address){
        recruitmentofficephonenumbersErrors.address = 'Enter the recruitment office address.';
      }

      if(!recruitmentoffice.city){
        recruitmentofficephonenumbersErrors.city = "Enter the recruitment office city.";
      }

      recruitmentofficephonenumbersArrayErrors[index] = recruitmentofficephonenumbersErrors;
    });

    if(recruitmentofficephonenumbersArrayErrors.length){
      errors.recruitmentofficephonenumbers = recruitmentofficephonenumbersArrayErrors;
    }
  }

  return errors;
}

WizardCreateNewAgencyFourthPage.propTypes = {
  setActivePage: PropTypes.func.isRequired
}

let mapStateToProps = (state) => {
  return({
    activePage: state.tempEdge.active_page
  });
}

WizardCreateNewAgencyFourthPage = reduxForm({
  form: 'CreateNewAgency',
  validate: validate
})(WizardCreateNewAgencyFourthPage);

export default withLocalize(connect(mapStateToProps, { setActivePage })(WizardCreateNewAgencyFourthPage));
