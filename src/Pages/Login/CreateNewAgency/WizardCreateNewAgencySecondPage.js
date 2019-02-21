import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Field, FieldArray, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import  { setActivePage } from '../../../Redux/actions/tempEdgeActions';

const $ = window.$;

class WizardCreateNewAgencySecondPage extends Component{
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
      console.log("props ---WizardSecond---: ", this.props);
      this.props.params.lang = this.props.activeLanguage.code;
      this.props.history.location.pathname = `/registerAgency/${this.props.activeLanguage.code}`;
      this.props.history.push(`/registerAgency/${this.props.activeLanguage.code}`);
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
    let errMsg = '';

    if(typeof formProps.input !== 'undefined'){
      if(formProps.index != null || typeof formProps.index != 'undefined' || formProps.index != ''){
        if(formProps.input.name.indexOf("agencyphonenumbers") !== -1 || formProps.input.name.indexOf("phonenumber_0")!== -1)
          fieldId = `com.tempedge.error.agency.agencyphonenumbers.phonenumberrequired`;
      }else
        fieldId = `com.tempedge.error.agency.${formProps.input.name}phonenumberrequiredrequired`;

      errMsg = formProps.meta.error;

      if(formProps.meta.touched && formProps.meta.error && typeof errMsg !== 'undefined'){
        return(
          <p style={{color: '#a94442'}}><Translate id={fieldId}>{errMsg}</Translate></p>
        );
      }
    }
  }

  renderPhoneNumberInputs = (formProps) => {
    let errorClass = `col-xs-10 ${(formProps.meta.error && formProps.meta.touched)? 'has-error': ''}`;

    return(
      <ul>
        <li key={0} className="agency-phone-li">
          <Field name={`phonenumber_${0}`} index={0} type="text" label={formProps.label.substring(0, formProps.label.indexOf(":")+1)} component={this.renderInput} />
          <Field name={`phoneext_${0}`} index={0} type="text" label={formProps.label.substring(formProps.label.indexOf(": ")+2, formProps.label.lenght)} component={this.renderInput} />
        </li>
        {formProps.fields.map((agency, index) => (
          <li key={index+1} className="agency-phone-li">
            <div className="row">
              <button type="button" className="pull-right phone-num-btn-close" title="Remove Agency" onClick={() => formProps.fields.remove(index)}>X</button>
            </div>
            <Field name={`${agency}.phonenumber`} type="text" index={index+1} label={formProps.label.substring(0, formProps.label.indexOf(":")+1)} component={this.renderInput} />
            <Field name={`${agency}.phoneext`} type="text" index={index+1} label={formProps.label.substring(formProps.label.indexOf(": ")+2, formProps.label.lenght)} component={this.renderInput} />
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

  onSubmit(formValues){
    console.log(formValues);
  }

  render(){
    console.log("Second Page");

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

let validate = (formValues) => {
  let errors ={};

  console.log("formValues: ", formValues);

  if(!formValues.phonenumber_0){
    errors.phonenumber_0 = 'Please enter a phone number.';
  }

  if (!formValues.agencyphonenumbers || !formValues.agencyphonenumbers.length) {
    errors.agencyphonenumbers = { _error: 'At least one phone number must be entered' };
  } else {
    let agencyphonenumbersArrayErrors = [];
    formValues.agencyphonenumbers.forEach((agency, index) => {
      let agencyphonenumbersErrors = {};
      let regX = new RegExp(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g);

      if (!agency || !regX.test(agency.phonenumber)) {
        agencyphonenumbersErrors.phonenumber = 'Please enter a phone number.';
        agencyphonenumbersArrayErrors[index] = agencyphonenumbersErrors;
      }
    });
    if (agencyphonenumbersArrayErrors.length) {
      errors.agencyphonenumbers = agencyphonenumbersArrayErrors;
    }
  }

  return errors;
}

WizardCreateNewAgencySecondPage.propTypes = {
  setActivePage: PropTypes.func.isRequired
}

let mapStateToProps = (state) => {
  return({
    activePage: state.tempEdge.active_page
  });
}

WizardCreateNewAgencySecondPage = reduxForm({
  form: 'CreateNewAgency',
  validate: validate
})(WizardCreateNewAgencySecondPage);

export default withLocalize(connect(mapStateToProps, { setActivePage })(WizardCreateNewAgencySecondPage));
