import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import Dropdown from '../../../components/common/Dropdown/Dropdown.js';
import DropdownList from 'react-widgets/lib/DropdownList';
import CountryRegionParser from '../../../components/common/CountryRegionParser/CountryRegionParser.js';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { required, date } from 'redux-form-validators';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Validate from '../../Validations/Validations';

class WizardCreateNewAgencySecondPage extends Component{
  constructor(props){
    super(props);

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  state = {
    region_list: []
  }

  componentDidUpdate(prevProps, prevState){
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/registerAgency/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  componentWillReceiveProps(nextProps){
    if(typeof nextProps.country === 'undefined'){
      this.setState({
        region_list: CountryRegionParser.getRegionList(this.props.countryList, "United States")
      })
    }else{
      this.setState({
        region_list: CountryRegionParser.getRegionList(this.props.countryList, nextProps.country)
      });
    }
  }

  render(){
    let country_list = CountryRegionParser.getCountryList(this.props.countryList);
    let address_list = ["billing", "other", "p-o-box", "shipping"];

    console.log("Second Page");

    return(
      <React.Fragment>
        <h2 className="text-center page-title-agency"><Translate id="com.tempedge.msg.label.newagencyregistration">New Agency Registration</Translate></h2>
        <form className="panel-body" onSubmit={this.props.handleSubmit} className="form-horizontal center-block register-form-agency" style={{paddingBottom: "0px"}}>
          <div className="form-group row row-agency-name">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-2">
                  <label className="control-label pull-right agency-label"><Translate id="com.tempedge.msg.label.agencyname">Agency</Translate></label>
                </div>
                <div className="col-md-8" style={{paddingLeft: 0, paddingRight: 71}}>
                  <Field name="agencyname" type="text" placeholder="Agency Name" category="agency" component={InputBox} />
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
            <div className="form-group register-form wizard-register-agency-form row">
              <div className="register-agency-flex">
                <div className="col-md-6 register-agency-input-left">
                  <label className="control-label top-label-agency-form"><Translate id="com.tempedge.msg.label.country">Country</Translate></label>
                  <Field name="agencycountry" data={country_list} valueField="value" textField="country" category="agency" component={Dropdown} />
                </div>

                <div className="col-md-6 register-agency-input-right">
                  <label className="control-label top-label-agency-form"><Translate id="com.tempedge.msg.label.addresstype">Address Type</Translate></label>
                  <Field name="agencydropdown" data={address_list} valueField="value" textField="option" category="agency" component={Dropdown} />
                </div>
              </div>

              <div className="register-agency-flex">
                <div className="col-md-12">
                  <label className="control-label"><Translate id="com.tempedge.msg.label.agencyaddress">Address</Translate></label>
                  <Field name="agencyaddress" type="textarea" placeholder="Enter Address" category="agency" component={InputBox} />
                </div>
              </div>

              <div className="register-agency-flex">
                <div className="col-md-6 register-agency-input-left">
                  <label className="control-label"><Translate id="com.tempedge.msg.label.agencyaddress2">Address 2</Translate></label>
                  <Field name="agencyappartment" type="text" placeholder="Enter Apartment" category="agency" component={InputBox} />
                </div>

                <div className="col-md-6 register-agency-input-right">
                  <label className="control-label"><Translate id="com.tempedge.msg.label.city">City</Translate></label>
                  <Field name="agencycity" type="text" placeholder="Enter City" category="agency" component={InputBox} />
                </div>
              </div>

              <div className="register-agency-flex">
                <div className="col-md-6 register-agency-input-left">
                  <label className="control-label"><Translate id="com.tempedge.msg.label.agencyzipcode">Zip Code</Translate></label>
                  <Field name="agencyzipcode" type="text" placeholder="Enter Zip Code" category="agency" component={InputBox} />
                </div>

                <div className="col-md-6 register-agency-input-right">
                  <label className="control-label"><Translate id="com.tempedge.msg.label.state">State</Translate></label>
                  <Field name="agencystate" data={this.state.region_list} valueField="value" textField="state" category="agency" component={Dropdown} />
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="panel-footer register-footer panel-footer-agency-height-override">
          <div className="prev-next-btns-agency">
            <div className="col-md-4 col-md-offset-2">
              <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={this.props.previousPage}>Back</button>
            </div>
            <div className="col-md-4">
              <button type="button" className="btn btn-primary btn-block register-save-btn next" onClick={this.props.onSubmit} disabled={this.props.invalid || this.props.pristine}><Translate id="com.tempedge.msg.label.next">Next</Translate></button>
            </div>
          </div>
        </div>
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
