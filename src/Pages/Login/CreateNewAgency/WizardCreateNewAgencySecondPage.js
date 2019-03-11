import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import DropdownList from 'react-widgets/lib/DropdownList';
import 'react-widgets/dist/css/react-widgets.css';
import PropTypes from 'prop-types';
import { required, date } from 'redux-form-validators';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Validate from '../Validations/Validations';

class WizardCreateNewAgencySecondPage extends Component{
  constructor(props){
    super(props);

    this.addTranslationsForActiveLanguage();
  }

  state = {
    region_list: []
  }

  componentDidUpdate(prevProps, prevState){
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/registerAgency/${this.props.activeLanguage.code}`);
      this.addTranslationsForActiveLanguage();
    }
  }

  componentWillReceiveProps(nextProps){
    if(typeof nextProps.country === 'undefined'){
      this.setState({
        region_list: this.createRegionsPerCountryList("United States")
      })
    }else{
      this.setState({
        region_list: this.createRegionsPerCountryList(nextProps.country)
      });
    }
  }

  addTranslationsForActiveLanguage(){
    const {activeLanguage} = this.props;

    if (!activeLanguage) {
      return;
    }

    import(`../../../translations/${activeLanguage.code}.tempedge.json`)
      .then(translations => {
        this.props.addTranslationForLanguage(translations, activeLanguage.code)
      });
  }

  renderError(formProps){
    let fieldId='';
    let errMsg = '';

    if(typeof formProps.input !== 'undefined'){
      fieldId = `com.tempedge.error.agency.${formProps.input.name}required`;
      errMsg = formProps.meta.error;

      if(formProps.meta.touched && formProps.meta.error && typeof errMsg !== 'undefined'){
        return(
          <p style={{color: '#a94442'}}><Translate id={fieldId}>{errMsg}</Translate></p>
        );
      }
    }
  }

  renderDropdownList = (formProps) => {
    let errorClass = `${(formProps.meta.error && formProps.meta.touched)? 'has-error-dob': ''}`;

    return(
      <div className={errorClass}>
        <DropdownList {...formProps.input} data={formProps.data} valueField={formProps.valueField} textField={formProps.textField} onChange={formProps.input.onChange} />
        {this.renderError(formProps)}
      </div>
    );
  }

  renderInput = (formProps) => {
    let errorClass = `${(formProps.meta.error && formProps.meta.touched)? 'has-error': ''}`;
    let input = null;

    if(formProps.type === "textarea")
      input = <input className="form-control tempEdge-input-box" type="textarea" rows="2" placeholder={formProps.placeholder} {...formProps.input} autoComplete="off" />
    else
      input = <input className="form-control tempEdge-input-box" type="text" placeholder={formProps.placeholder} {...formProps.input} autoComplete="off" />

    return(
      <div className={errorClass}>
        {input}
        {this.renderError(formProps)}
      </div>
    );
  }

  createRegionsPerCountryList(selectedCountry){
    let regions;
    let regions_list = [];

    this.props.countryList.map((country) => {
      if(country.countryName === selectedCountry){
        regions = country.regions;
      }
    });

    regions.map((region) => {
      regions_list.push(region.name);
    });

    return regions_list;
  }

  render(){
    let country_list = [];
    let region_list = [];
    let address_list = ["billing", "other", "p-o-box", "shipping"];

    this.props.countryList.map((country) => {
      country_list.push(country.countryName);
    });

    console.log("Second Page");

    return(
      <React.Fragment>
        <h2 className="text-center page-title"><Translate id="com.tempedge.msg.label.newagency">New Agency</Translate></h2>
        <form className="panel-body" onSubmit={this.props.handleSubmit(this.props.onSubmit)} className="form-horizontal center-block register-form-agency" style={{paddingBottom: "0px"}}>
          <div className="form-group row row-agency-name">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-2">
                  <label className="control-label pull-right" style={{paddingTop: 13}}><Translate id="com.tempedge.msg.label.agencyname">Agency</Translate></label>
                </div>
                <div className="col-md-8" style={{paddingLeft: 0}}>
                  <Field name="agencyname" type="text" placeholder="Agency Name" component={this.renderInput} />
                </div>
              </div>
            </div>
          </div>
          <div className="panel register-form-panel">
            <div className="panel-heading register-header">
              <h2 className="text-center"><Translate id="com.tempedge.msg.label.officeinformation">Main Office Information</Translate></h2>
            </div>
          </div>
          <div className="register-form-panel-inputs">
            <div className="form-group row">
              <div className="col-md-6">
                <label className="control-label"><Translate id="com.tempedge.msg.label.country">Country</Translate></label>
                <Field  name="agencycountry" component={this.renderDropdownList} data={country_list} valueField="value" textField="country" />
              </div>

              <div className="col-md-6">
                <label className="control-label"><Translate id="com.tempedge.msg.label.addresstype">Address Type</Translate></label>
                <Field name="agencydropdown" component={this.renderDropdownList} data={address_list} valueField="value" textField="option" />
              </div>

              <div className="col-md-12">
                <label className="control-label"><Translate id="com.tempedge.msg.label.agencyaddress">Address</Translate></label>
                <Field name="agencyaddress" type="textarea" placeholder="Enter Address" component={this.renderInput} />
              </div>

              <div className="col-md-6">
                <label className="control-label"><Translate id="com.tempedge.msg.label.agencyappartment">Apartment</Translate></label>
                <Field name="agencyappartment" type="text" placeholder="Enter Apartment" component={this.renderInput} />
              </div>

              <div className="col-md-6">
                <label className="control-label"><Translate id="com.tempedge.msg.label.city">City</Translate></label>
                <Field name="agencycity" type="text" placeholder="Enter City" component={this.renderInput} />
              </div>

              <div className="col-md-6">
                <label className="control-label"><Translate id="com.tempedge.msg.label.agencyzipcode">Zip Code</Translate></label>
                <Field name="agencyzipcode" type="text" placeholder="Enter Zip Code" component={this.renderInput} />
              </div>

              <div className="col-md-6">
                <label className="control-label"><Translate id="com.tempedge.msg.label.state">State</Translate></label>
                <Field name="agencystate" component={this.renderDropdownList} data={this.state.region_list} valueField="value" textField="state" />
              </div>
            </div>

            <div className="form-group prev-next-btns">
              <div className="col-md-4 col-md-offset-2">
                <button type="button" className="btn btn-primary btn-block register-save-btn previous" onClick={this.props.previousPage}>Previous</button>
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

WizardCreateNewAgencySecondPage = reduxForm({
  form: 'CreateNewAgency', //                 <------ form name
  destroyOnUnmount: false, //        <------ preserve form data
  // forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate: Validate
})(WizardCreateNewAgencySecondPage);

let mapStateToProps = (state) => {
  let selector = formValueSelector('CreateNewAgency') // <-- same as form name
  return({
    country: selector(state, 'agencycountry')
  });
}

export default withLocalize(connect(mapStateToProps, { push })(WizardCreateNewAgencySecondPage));
