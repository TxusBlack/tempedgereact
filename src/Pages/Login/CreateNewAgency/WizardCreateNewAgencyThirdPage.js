import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Field, FieldArray, reduxForm } from 'redux-form';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import renderPhoneNumberInputs from '../../../components/common/PhoneNumberListGen/PhoneNumberListGen.js';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Validate from '../../Validations/Validations';
import { notify } from 'reapop';

const $ = window.$;

class WizardCreateNewAgencyThirdPage extends Component {
  constructor(props) {
    super(props);

    this.addTranslationsForActiveLanguage();
  }

  state = { mounted: false, phonelabels: '' }

  componentDidMount() {
    this.setState({
      mounted: true,
      phonelabels: 'Phone: Extension: Phone Type'
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/registerAgency/${this.props.activeLanguage.code}`);
      this.addTranslationsForActiveLanguage();
    }
  }

  addTranslationsForActiveLanguage = async () => {
    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);

    let phonelabel = $(ReactDOM.findDOMNode(this.refs.phonelabel)).text();

    if (this.state.mounted && phonelabel !== '') {
      this.setState({
        phonelabels: phonelabel
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="wizard-wrapper">
          <h2 className="text-center page-title-agency"><Translate id="com.tempedge.msg.label.newagencyregistration"></Translate></h2>
          <form className="panel-body" onSubmit={this.props.handleSubmit} className="form-horizontal center-block register-form-agency" style={{ paddingBottom: "0px" }}>
            <div className="form-group row row-agency-name">
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-2">
                    <label className="control-label pull-right agency-label"><Translate id="com.tempedge.msg.label.agencyname"></Translate></label>
                  </div>
                  <div className="col-md-8" style={{ paddingLeft: 0, paddingRight: 71 }}>
                    <Field name="agencyname" type="text" placeholder="Agency Name" component={InputBox} />
                  </div>
                </div>
              </div>
            </div>
            <div className="panel register-form-panel">
              <div className="panel-heading register-header">
                <h2 className="text-center"><Translate id="com.tempedge.msg.label.phones"></Translate></h2>
              </div>
            </div>
            <div className="register-form-panel-inputs">
              <div className="form-group register-form wizard-register-agency-form row">
                <div className="col-md-12">
                  <span className="translation-placeholder" ref="phonelabel"><Translate id="com.tempedge.msg.label.newagencyphonenumber">Phone: Extension: Phone Type</Translate></span>
                  <FieldArray name="agencyphonenumbers" type="text" placeholder="Phone Number" label={this.state.phonelabels} component={renderPhoneNumberInputs} />
                </div>
              </div>
            </div>

            <div className="panel-footer register-footer panel-footer-agency-height-override">
              <div className="prev-next-btns-agency row">
                <div className="col-md-4 offset-md-2">
                  <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={this.props.previousPage}>Back</button>
                </div>
                <div className="col-md-4">
                  <button type="submit" className="btn btn-primary btn-block register-save-btn next" disabled={this.props.invalid || this.props.pristine}><Translate id="com.tempedge.msg.label.next"></Translate></button>
                </div>
              </div>
            </div>
          </form>
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

export default withLocalize(connect(null, { push, notify })(WizardCreateNewAgencyThirdPage));
