import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import Dropdown from '../../../components/common/Dropdown/Dropdown.js';
import DropdownList from 'react-widgets/lib/DropdownList';      //DO NOT REMOVE or it will break
import CountryRegionParser from '../../../components/common/CountryRegionParser/CountryRegionParser.js';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Validate from '../../Validations/Validations';

class WizardCreateNewUserSecondPage extends Component{
  constructor(props){
    super(props);

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  state = {
    mounted: false,
    country_list: [],
    region_list: []
  }

  componentDidMount = async() => {
    let list = await CountryRegionParser.getCountryList(this.props.country_region_list).country_list;

    this.setState(() => ({
      country_list: list,
      mounted: true
    }));
  }

  componentDidUpdate(prevProps, prevState){
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if(hasActiveLanguageChanged){
      this.props.push(`/createClient/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  componentWillReceiveProps = async(nextProps) => {
    if(typeof nextProps.country === 'undefined'){
      let regionsList = await CountryRegionParser.getRegionList(this.props.country_region_list, "United States");

      this.setState({
        region_list: regionsList
      });
    }else{
      let regionsList = await CountryRegionParser.getRegionList(this.props.country_region_list, nextProps.country.name);

      this.setState({
        region_list: regionsList
      });
    }
  }

  render(){
    let salesmen = ["Paco", "Joaquin", "Alvaro", "Tom"];
    let payrollCycle = ["1", "2", "3", "4"];

    return(
      <div className="sign-up-wrapper" style={{margin: 0}} ref="createNewUser1">
        <h2 className="text-center page-title-new-client"><Translate id="com.tempedge.msg.label.createNewClient"></Translate></h2>
        <div className="row new-client-form">
          <form className="panel-body" onSubmit={this.props.handleSubmit} className="form-horizontal center-block" style={{paddingBottom: "0px"}}>
            <div className="col-lg-8 client-col">
              <div className="create-client">
                <div className="new-client-header">
                  <h2>Create Client</h2>
                </div>

                <div className="new-clients-contents">

                    <div className="client-contents">
                      <div className="form-group row">
                        <div className="col-md-4">
                          <label className="control-label top-label-agency-form"><Translate id="com.tempedge.msg.label.country"></Translate></label>
                          <Field name="clientcountry" data={this.state.country_list} valueField="countryId" textField="name" category="agency" component={Dropdown} />
                        </div>
                        <div className="col-md-4">
                          <label className="control-label"><Translate id="com.tempedge.msg.label.agencyaddress"></Translate></label>
                          <Field name="clientaddress" type="textarea" placeholder="Enter Address" category="agency" component={InputBox} />
                        </div>
                        <div className="col-md-4">
                          <label className="control-label"><Translate id="com.tempedge.msg.label.city"></Translate></label>
                          <Field name="clientcity" type="text" placeholder="Enter City" category="agency" component={InputBox} />
                        </div>
                      </div>

                      <div className="form-group row">
                        <div className="col-md-4">
                          <label className="control-label"><Translate id="com.tempedge.msg.label.state"></Translate></label>
                          <Field name="clientstate" data={this.state.region_list} valueField="regionId" textField="name" category="agency" component={Dropdown} />
                        </div>
                        <div className="col-md-4">
                          <label className="control-label"><Translate id="com.tempedge.msg.label.agencyzipcode"></Translate></label>
                          <Field name="clientzipcode" type="text" placeholder="Enter Zip Code" category="agency" component={InputBox} />
                        </div>
                      </div>

                    <div className="new-clients-footer">
                      <div className="prev-next-btns-agency">
                        <div className="col-md-4 col-md-offset-2">
                          <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={this.props.previousPage}>Back</button>
                        </div>
                        <div className="col-md-4">
                          <button type="submit" className="btn btn-primary btn-block register-save-btn next" disabled={this.props.invalid || this.props.pristine}><Translate id="com.tempedge.msg.label.next">Next</Translate></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 dept-col">
              <div className="department-list">
                <div className="department-list-header">
                  <h2>Department List</h2>
                </div>

                <div className="department-list-contents">
                  <div style={{height: "2.9rem"}}></div>
                  <button className="department-list-button center-block">Add Departments</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

WizardCreateNewUserSecondPage = reduxForm({
  form: 'CreateNewClient', //                 <------ form name
  destroyOnUnmount: false, //        <------ preserve form data
  // forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate: Validate
})(WizardCreateNewUserSecondPage);

let mapStateToProps = (state) => {
  let selector = formValueSelector('CreateNewClient'); // <-- same as form name

  return({
    country_region_list: state.tempEdge.country_region_list,
    country: selector(state, 'clientcountry')
  });
}

export default withLocalize(connect(mapStateToProps, { push })(WizardCreateNewUserSecondPage));
