import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Stepper from 'react-stepper-horizontal';
import { connect } from 'react-redux';
import { notify } from 'reapop';
import { reset } from 'redux-form';
import httpService from '../../../utils/services/httpService/httpService.js';
import { getList } from '../../../Redux/actions/tempEdgeActions';
import { GET_COUNTRY_REGION_LIST, GET_FUNDING_LIST } from '../../../Redux/actions/types.js';
import WizardCreateNewAgencyrFirstPage  from './WizardCreateNewAgencyFirstPage.js';
import WizardCreateNewAgencySecondPage  from './WizardCreateNewAgencySecondPage.js';
import WizardCreateNewAgencyThirdPage   from './WizardCreateNewAgencyThirdPage';
import WizardCreateNewAgencyFourthPage  from './WizardCreateNewAgencyFourthPage';
import WizardCreateNewAgencyFifthPage   from './WizardCreateNewAgencyFifthPage';
import WizardCreateNewAgencySixthPage   from './WizardCreateNewAgencySixthPage';
import WizardCreateNewAgencySeventhPage from './WizardCreateNewAgencySeventhPage';
//import countryList from '../../../country-region-data/data';

class CreateNewAgency extends Component {
  constructor(props) {
    super(props);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);

    this.state = {
      page: 1,
      steps: [
       {title: ""},
       {title: ""},
       {title: ""},
       {title: ""},
       {title: ""},
       {title: ""},
       {title: ""}
      ]
    };
  }

  componentDidMount = () => {
    this.props.getList('/api/country/listAll', GET_COUNTRY_REGION_LIST);
    this.props.getList('/api/funding/listAll', GET_FUNDING_LIST);
  }

  nextPage(){
    this.setState({ page: this.state.page + 1 });
  }

  previousPage(){
    this.setState({ page: this.state.page - 1 });
  }

  onSubmit = async (formValues) => {
    console.log("CREATE NEW AGENCY SUBMITTED!!");
    let recruitmentOffices = {};
    var isRecruitmentOfficePhoneNumbersEmpty = !Object.keys(formValues.recruitmentofficephonenumbers[0]).length;

    if(isRecruitmentOfficePhoneNumbersEmpty){
      recruitmentOffices = null;
    }else{
      recruitmentOffices = await formValues.recruitmentofficephonenumbers.map((recruitmentOffice) => {
        return({
            "address" : recruitmentOffice.officeName,
            "city" : recruitmentOffice.city,
            "country" : formValues.agencycountry.value,
            "name" : recruitmentOffice.officeName,
            "phone" : recruitmentOffice.phonenumber,
            "zipcode" : recruitmentOffice.zip,
            "region" : formValues.agencystate.value
        });
      });
    }

    let phoneList = await formValues.agencyphonenumbers.map((phoneNumber) => {
      return({
          "phone" : phoneNumber.phonenumber,
          "ext" : phoneNumber.phoneext
      });
    });

    let response = {
        "user" : {
            "firstName" : formValues.firstName,
            "lastName"  : formValues.lastName,
            "username"  : formValues.username,
            "password"  : formValues.password,
            "email"     : formValues.email
        },
        "organizationEntity" : {
            "address" : formValues.agencyaddress,
            "addressType" : "",
            "address2" : formValues.agencyappartment,
            "city" : formValues.agencycity,
            "clientPayrollDate" : formValues.weekdaysdropdown1.value,
            "country" : formValues.agencycountry.countryId,
            "lastPayrollDate" : formValues.weekdaysdropdown2.value,
            "organizationName" : formValues.agencyname,
            "region" : formValues.agencystate.regionId,
            "zipcode" : formValues.agencyzipcode,
            "funding" : {
                "fundingId" : formValues.fundingCompanydropdown.fundingId
            },
            "officeEntityList" : recruitmentOffices
        },
        "phoneList" : phoneList
    }

    console.log("formValues: ", formValues);
    console.log("payload: ", response);

    httpService.postCreateNew('/api/agency/save', response)
      .then((res) => {
        console.log('response: ', res);
      }).catch((err) => {
        console.log('error: ', err);
      });

    //this.fireNotification();
  }

  fireNotification = () => {
    console.log("NOTIFY RAN!");
    let { notify } = this.props;

    notify({
      title: 'Agency Creation Information Submitted',
      message: 'you clicked on the Submit button',
      status: 'success',
      position: 'br',
      dismissible: true,
      dismissAfter: 3000
    });
  }

  componentWillUnmount(){
    this.props.reset("CreateNewAgency");    //Reset form fields all to empty
  }

  render(){
    let { page, steps } = this.state;

    return(
      <div className="wizard-create-agency">
        <Stepper steps={ steps } activeStep={ page-1 } activeColor="#eb8d34" completeColor="#8cb544" defaultBarColor="#eb8d34" completeBarColor="#8cb544" barStyle="solid" circleFontSize={16} />
        <div className="wizard-wrapper">
          {page === 1 && <WizardCreateNewAgencyrFirstPage  onSubmit={this.nextPage} {...this.props} />}
          {page === 2 && <WizardCreateNewAgencySecondPage  previousPage={this.previousPage} onSubmit={this.nextPage} {...this.props} />}
          {page === 3 && <WizardCreateNewAgencyThirdPage   previousPage={this.previousPage} onSubmit={this.nextPage} {...this.props} />}
          {page === 4 && <WizardCreateNewAgencyFourthPage  previousPage={this.previousPage} onSubmit={this.nextPage} {...this.props} />}
          {page === 5 && <WizardCreateNewAgencyFifthPage   previousPage={this.previousPage} onSubmit={this.nextPage} {...this.props} />}
          {page === 6 && <WizardCreateNewAgencySixthPage   previousPage={this.previousPage} onSubmit={this.nextPage} {...this.props} />}
          {page === 7 && <WizardCreateNewAgencySeventhPage previousPage={this.previousPage} onSubmit={this.onSubmit} {...this.props} />}
        </div>
      </div>
    );
  }
}

CreateNewAgency.propTypes = {
  getList: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired
}

export default connect(null, { notify, getList, reset  })(CreateNewAgency);
