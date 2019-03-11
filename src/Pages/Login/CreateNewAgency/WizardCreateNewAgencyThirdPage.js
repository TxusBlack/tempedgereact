import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Field, FieldArray, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Validate from '../Validations/Validations';

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
      phonelabels: 'Phone: Extension:'
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
    let errorClass = `col-xs-10 ${(formProps.meta.error && formProps.meta.touched)? 'has-error': ''}`;

    if(formProps.fields.length < 1){
      formProps.fields.push({});
    }

    return(
      <ul>
        {formProps.fields.map((agency, index) => (
          <li key={index} className="agency-phone-li">
            <div className="row">
              { (index > 0)? <button type="button" className="pull-right phone-num-btn-close" title="Remove Agency" onClick={() => formProps.fields.remove(index)}>X</button>: '' }
            </div>
            <Field name={`${agency}.phonenumber`} type="text" index={index} placeholder="xxx-xxx-xxxx" label={formProps.label.substring(0, formProps.label.indexOf(":")+1)} component={this.renderInput} />
            <Field name={`${agency}.phoneext`} type="text" index={index} placeholder="xxxx" label={formProps.label.substring(formProps.label.indexOf(": ")+2, formProps.label.lenght)} component={this.renderInput} />
          </li>
        ))}
        <li>
          <div className="row">
            <button type="button" className="center-block" onClick={() => formProps.fields.push({})}>Add Phone Number</button>
          </div>
        </li>
      </ul>
    );
  }

  renderInput = (formProps) => {
    let errorClass = `col-xs-10 ${(formProps.meta.error && formProps.meta.touched)? 'has-error': ''}`;

    console.log("formProps: ", formProps);

    return(
      <React.Fragment>
        <div className="row agency-phone-box">
          <label className="col-xs-2 control-label">{formProps.label}</label>
          <div className={errorClass}>
            <input className="form-control" placeholder={formProps.placeholder} {...formProps.input} autoComplete="off" />      {/*<input onChange={formProps.input.onChange} value={formProps.input.value} />*/}
            {this.renderError(formProps)}
          </div>
        </div>
      </React.Fragment>
    );
  }

  render(){
    console.log("Third Page");

    return(
      <React.Fragment>
        <h2 className="text-center page-title"><Translate id="com.tempedge.msg.label.newagency">New Agency</Translate></h2>
        <form onSubmit={this.props.handleSubmit(this.props.onSubmit)} className="form-horizontal center-block register-form" style={{width: "40%", padding: "30px 0"}}>
          <div className="form-group">
            <span className="translation-placeholder" ref="phonelabel"><Translate id="com.tempedge.msg.label.newagencyphonenumber">Phone: Extension:</Translate></span>
            <FieldArray name="agencyphonenumbers" type="text" placeholder="Phone Number" label={this.state.phonelabels} component={this.renderPhoneNumberInputs} />
          </div>
          <div className="form-group prev-next-btns">
            <div className="col-md-4 col-md-offset-2">
              <button type="button" className="btn btn-primary btn-block register-save-btn previous" onClick={this.props.previousPage}>Previous</button>
            </div>
            <div className="col-md-4">
              <button type="submit" className="btn btn-primary btn-block register-save-btn next" disabled={this.props.invalid || this.props.pristine}><Translate id="com.tempedge.msg.label.next">Next</Translate></button>
            </div>
          </div>
        </form>
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
