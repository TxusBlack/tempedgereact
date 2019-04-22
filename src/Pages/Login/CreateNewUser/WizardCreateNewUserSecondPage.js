import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Field, reduxForm } from 'redux-form';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import Dropdown from '../../../components/common/Dropdown/Dropdown.js';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { required, date } from 'redux-form-validators';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Captcha from '../../../components/common/Captcha/Captcha';
import Validate from '../../Validations/Validations.js';

const $ = window.$;

class WizardCreateNewUserSecondPage extends Component{
  constructor(props){
    super(props);

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  state= { captchaRef: null, reCaptchaToken: '', btnDisabled: true }

  componentDidMount(){
    let parent = $(ReactDOM.findDOMNode(this.refs.userConfigContainer));
    parent.closest(".wizard-wrapper").css("width", "409px");
    parent.closest(".wizard-create-agency").css("width", "409px");
  }

  componentDidUpdate(prevProps, prevState){
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/register/${this.props.activeLanguage.code}`);
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
    this.setState({
      captchaRef: React.createRef(ref)
    });
  }

  generateCaptcha = (formProps) => {
    return <Captcha formProps={formProps} setCaptchaRef={this.setCaptchaRef} onChange={this.onChange} />;
  }

  render(){
    // let rolesList = [{ name: "Client", id: 0 }, { name: "Agency", id: 1 }];

    console.log("Second Page");

    return(
      <div ref="userConfigContainer">
        <h2 className="text-center page-title-agency" style={{marginBottom: "0.7rem"}}><Translate id="com.tempedge.msg.label.userconfiguration"></Translate></h2>
        <h3 className="text-center page-subtitle" style={{marginTop: 0}}>Please tell us more about you.</h3>
        <form name="newUser" className="panel-body" onSubmit={this.props.handleSubmit(this.props.onSubmit)} className="form-horizontal center-block register-form-agency" style={{paddingBottom: "0px"}}>
          <div className="panel register-form-panel">
            <div className="panel-heading register-header">
              <h2 className="text-center"><Translate id="com.tempedge.msg.label.userinformation"></Translate></h2>
            </div>
          </div>
          <div className="register-form-panel-inputs">
            <div className="form-group register-form wizard-register-agency-form row">
              <div>
                <div className="row">
                  <div className="col-md-12">
                    <label className="control-label top-label-agency-form"><Translate id="com.tempedge.msg.label.role"></Translate></label>
                    <Field name="agencyrole" data={this.props.role_list} valueField="id" textField="name" category="agency" component={Dropdown} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <label className="control-label"><Translate id="com.tempedge.msg.label.organization"></Translate></label>
                    <Field name="agencyorganization" type="textarea" placeholder="Enter Organization Name" category="agency" component={InputBox} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <label className="control-label"><Translate id="com.tempedge.msg.label.client"></Translate></label>
                    <Field name="agencyclient" type="textarea" placeholder="Enter Client" category="agency" component={InputBox} />
                  </div>
                </div>
                <div className="row">
                  <div className="captcha-container" style={{marginTop:40}}>
                    <div className="center-block captcha-panel" style={{width: "304px"}}>
                      <Field name='captcha' size="normal" height="130px" theme="light" component={this.generateCaptcha} />
                    </div>
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
                <button type="submit" className="btn btn-primary btn-block register-save-btn next" disabled={this.props.invalid || this.props.submiting || this.props.pristine || this.state.btnDisabled}><Translate id="com.tempedge.msg.label.submit"></Translate></button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

WizardCreateNewUserSecondPage = reduxForm({
  form: 'CreateNewUser', //                 <------ form name
  destroyOnUnmount: false, //        <------ preserve form data
  // forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate: Validate
})(WizardCreateNewUserSecondPage);

let mapStateToProps = (state) => {
  return{
    role_list: state.tempEdge.role_list,
  };
}

export default withLocalize(connect(mapStateToProps, { push })(WizardCreateNewUserSecondPage));
