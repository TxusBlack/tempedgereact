import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import DropdownList from 'react-widgets/lib/DropdownList';
import 'react-widgets/dist/css/react-widgets.css';
import PropTypes from 'prop-types';
import { required, date } from 'redux-form-validators';
import 'react-widgets/dist/css/react-widgets.css';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import  { setActivePage } from '../../../Redux/actions/tempEdgeActions';

class WizardCreateNewAgencyFirstPage extends Component{
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
      console.log("props ---WizardFirst---: ", this.props);
      this.props.params.lang = this.props.activeLanguage.code;
      this.props.history.location.pathname = `/registerAgency/${this.props.activeLanguage.code}`;
      this.props.history.push(`/registerAgency/${this.props.activeLanguage.code}`);
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
    let errorClass = `col-xs-10 ${(formProps.meta.error && formProps.meta.touched)? 'has-error-dob': ''}`;

    return(
      <div className={errorClass}>
        <DropdownList {...formProps.input} data={formProps.data} valueField={formProps.valueField} textField={formProps.textField} onChange={formProps.input.onChange} />
        {this.renderError(formProps)}
      </div>
    );
  }

  renderInput = (formProps) => {
    let errorClass = `col-xs-10 ${(formProps.meta.error && formProps.meta.touched)? 'has-error': ''}`;

    return(
      <div className={errorClass}>
        <input className="form-control" placeholder={formProps.placeholder} {...formProps.input} autoComplete="off" />      {/*<input onChange={formProps.input.onChange} value={formProps.input.value} />*/}
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

    console.log("First Page");

    return(
      <React.Fragment>
        <h2 className="text-center page-title"><Translate id="com.tempedge.msg.label.newagency">New Agency</Translate></h2>
        <form onSubmit={this.props.handleSubmit(this.props.onSubmit)} className="form-horizontal center-block register-form" style={{width: "40%", padding: "30px 0"}}>
          <div className="form-group">
              <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.agencyname">Agency Name</Translate>:</label>
              <Field name="agencyname" type="text" placeholder="Agency Name" component={(formProps) => this.renderInput(formProps)} />
          </div>
          <div className="form-group">
              <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.agencyaddress">Address</Translate>:</label>
              <Field name="agencyaddress" type="text" placeholder="Address" component={(formProps) => this.renderInput(formProps)} />
          </div>
          <div className="form-group">
              <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.agencyappartment">Apartment (Required)</Translate>:</label>
              <Field name="agencyappartment" type="text" placeholder="Apartment" component={(formProps) => this.renderInput(formProps)} />
          </div>
          <div className="form-group">
              <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.agencyzipcode">Zip Code</Translate>:</label>
              <Field name="agencyzipcode" type="text" placeholder="Zip Code" component={(formProps) => this.renderInput(formProps)} />
          </div>
          <div className="form-group">
            <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.addresstype">Address Type</Translate>:</label>
            <Field  name="agencydropdown" component={this.renderDropdownList} data={address_list} valueField="value" textField="option" />
          </div>
          <div className="form-group">
            <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.state">State</Translate>:</label>
            <Field  name="agencystate" component={this.renderDropdownList} data={this.state.region_list} valueField="value" textField="state" />
          </div>
          <div className="form-group">
            <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.country">Country</Translate>:</label>
            <Field  name="agencycountry" component={this.renderDropdownList} data={country_list} valueField="value" textField="country" />
          </div>
          <div className="form-group prev-next-btns">
              <div className="col-md-6 col-md-offset-3">
                <button type="submit" className="btn btn-primary btn-block register-save-btn next" disabled={this.props.invalid || this.props.submiting || this.props.pristine}><Translate id="com.tempedge.msg.label.next">Next</Translate></button>
              </div>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

let validate = (formValues) => {
  let errors ={};

  if(!formValues.agencycountry){
    errors.agencycountry = 'Please choose a country from the list.';
  }

  if(!formValues.agencystate){
    errors.agencystate = 'Please choose a state from the list.';
  }

  if(!formValues.agencydropdown){
    errors.agencydropdown = 'Please choose an option from the list.';
  }

  if(!formValues.agencyname){
    errors.agencyname = 'Please enter the agency name';
  }

  if(!formValues.agencyaddress){
    errors.agencyaddress = 'Please enter the agency address';
  }

  if(!formValues.agencyappartment){
    errors.agencyappartment = 'Please enter the agency appartment';
  }

  return errors;
}

WizardCreateNewAgencyFirstPage = reduxForm({
  form: 'CreateNewAgency', //                 <------ form name
  destroyOnUnmount: false, //        <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate: validate
})(WizardCreateNewAgencyFirstPage);

let mapStateToProps = (state) => {
  let selector = formValueSelector('CreateNewAgency') // <-- same as form name
  return({
    country: selector(state, 'agencycountry')
  });
}

export default withLocalize(connect(mapStateToProps)(WizardCreateNewAgencyFirstPage));
