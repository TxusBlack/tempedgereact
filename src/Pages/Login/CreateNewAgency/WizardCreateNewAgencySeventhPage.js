import React, { Component } from 'react';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Captcha from '../../../components/common/Captcha/Captcha';
import Validate from '../../Validations/Validations';

class WizardCreateNewAgencySeventhPage extends Component{
  constructor(props){
    super(props);

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  state= { captchaRef: null, reCaptchaToken: '', btnDisabled: true }

  componentDidUpdate(prevProps, prevState){
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/registerAgency/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
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
    console.log("Seventh Page");

    return(
      <React.Fragment>
        <h2 className="text-center page-title-agency"><Translate id="com.tempedge.msg.label.newagencyregistration">New Agency Registration</Translate></h2>
        <form className="panel-body" onSubmit={this.props.handleSubmit(this.props.onSubmit)} className="form-horizontal center-block register-form-agency" style={{paddingBottom: "0px"}}>
          <div className="form-group row row-agency-name">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-2">
                  <label className="control-label pull-right" style={{paddingTop: 8}}><Translate id="com.tempedge.msg.label.agencyname">Agency</Translate></label>
                </div>
                <div className="col-md-8" style={{paddingLeft: 0, paddingRight: 71}}>
                  <Field name="agencyname" type="text" placeholder="Agency Name" active="disabled" component={InputBox} />
                </div>
              </div>
            </div>
          </div>
          <div className="panel register-form-panel">
            <div className="panel-heading register-header">
              <h2 className="text-center"><Translate id="com.tempedge.msg.label.confirm">Confirm</Translate></h2>
            </div>
          </div>
          <div className="register-form-panel-inputs">
            <div className="form-group register-form wizard-register-agency-form row">
              <div className="row">
                <div className="col-md-12">
                  <h3 className="confirmation-page-subtitle"><Translate id="com.tempedge.msg.label.confirminformation">Confirm Information</Translate></h3>
                </div>
                <div className="col-md-6">
                  <h3 className="confirmation-page-categories"><Translate id="com.tempedge.msg.label.address">Address</Translate>:</h3>
                  <p className="confirmation-page-paragraph">{this.props.address}</p>
                  <h3 className="confirmation-page-categories"><Translate id="com.tempedge.msg.label.city">City</Translate>:</h3>
                  <p className="confirmation-page-paragraph">{this.props.city}</p>
                  <h3 className="confirmation-page-categories"><Translate id="com.tempedge.msg.label.addrecruitingoffice">Add A Recruiting Office</Translate>:</h3>
                  <p className="confirmation-page-paragraph">{this.props.recruitmentoffice}</p>
                </div>
                <div className="col-md-6">
                  <h3 className="confirmation-page-categories"><Translate id="com.tempedge.msg.label.phonesadded">Phones Added</Translate>:</h3>
                  <p className="confirmation-page-paragraph">{this.props.phonenumbers}</p>
                  <h3 className="confirmation-page-categories"><Translate id="com.tempedge.msg.label.salesmenadded">Added Salesmen</Translate>:</h3>
                  <p className="confirmation-page-paragraph">{this.props.salesmen}</p>
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
          <div className="panel-footer register-footer panel-footer-agency-height-override">
            <div className="prev-next-btns-agency">
              <div className="col-md-4 col-md-offset-2">
                <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={this.props.previousPage}>Back</button>
              </div>
              <div className="col-md-4">
                <button type="button" className="btn btn-primary btn-block register-save-btn next" onClick={this.props.onSubmit} disabled={this.props.invalid || this.props.submiting || this.props.pristine || this.state.btnDisabled}><Translate id="com.tempedge.msg.label.save">Save</Translate></button>
              </div>
            </div>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    address: state.form.CreateNewAgency.values.agencyaddress,
    city: state.form.CreateNewAgency.values.agencycity,
    recruitmentoffice: state.form.CreateNewAgency.values.recruitmentofficephonenumbers.length,
    phonenumbers: state.form.CreateNewAgency.values.recruitmentofficephonenumbers.length,
    salesmen: state.form.CreateNewAgency.values.recruitmentofficesalespersons.length
  }
};

WizardCreateNewAgencySeventhPage = reduxForm({
  form: 'CreateNewAgency',
  destroyOnUnmount: false,
  validate: Validate
})(WizardCreateNewAgencySeventhPage);

export default withLocalize(connect(mapStateToProps, { push })(WizardCreateNewAgencySeventhPage));
