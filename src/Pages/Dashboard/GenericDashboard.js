import React from 'react';
import { Field, reduxForm } from 'redux-form';
import InputBox from '../../components/common/InputBox/InputBox.js';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import ActiveLanguageAddTranslation from '../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import Validate from '../Validations/Validations';

class GenericDashboard extends React.Component{
  constructor(props){
    super(props);
    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  componentDidUpdate(prevProps, prevState){
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/dashboard/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  render(){
    return(
      <React.Fragment>
        <form className="panel-body" onSubmit={this.props.handleSubmit} className="form-horizontal center-block main-panel" style={{paddingBottom: "0px"}}>
          <div className="panel main-form-panel">
            <div className="panel-heading main-header">
              <h2 className="text-center"><Translate id="com.tempedge.msg.label.salesperson">Salesmen</Translate></h2>
            </div>
            <div className="main-form-panel-inputs">
              <div className="panel-body" className="form-horizontal center-block main-form" style={{paddingBottom: "0px"}}>
                <div className="form-group main-form-group row">
                  <div className="col-md-4">
                    <label className="control-label"><Translate id="com.tempedge.msg.label.username">Username</Translate></label>
                    <Field name="username" type="text" placeholder="Enter username" category="person" component={InputBox} />
                  </div>

                  <div className="col-md-4">
                    <label className="control-label"><Translate id="com.tempedge.msg.label.password">Password</Translate></label>
                    <Field name="initialpassword" type="password" placeholder="Enter password" category="person" component={InputBox} />
                  </div>

                  <div className="col-md-4">
                    <label className="control-label"><Translate id="com.tempedge.msg.label.confirmpassword" /></label>
                    <Field name="confirmpassword" type="password" placeholder="Confirm password" category="person" component={InputBox} />
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-footer main-footer panel-footer-agency-height-override">
              <div className="prev-next-btns-agency">
                <div className="col-md-4 col-md-offset-2">
                  <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={this.props.previousPage}>Back</button>
                </div>
                <div className="col-md-4">
                  <button type="submit" className="btn btn-primary btn-block register-save-btn next" disabled={this.props.invalid || this.props.submiting || this.props.pristine}><Translate id="com.tempedge.msg.label.next">Next</Translate></button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </React.Fragment>
    )
  }
}

GenericDashboard = reduxForm({
  form: 'genericDashboard', //                 <------ form name
  destroyOnUnmount: false, //        <------ preserve form data
  // forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate: Validate
})(GenericDashboard);

export default withLocalize(connect(null, { push })(GenericDashboard));
