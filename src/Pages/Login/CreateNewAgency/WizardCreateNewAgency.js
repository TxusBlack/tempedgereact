import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WizardCreateNewAgencyFirstPage from './WizardCreateNewAgencyFirstPage';
import WizardCreateNewAgencySecondPage from './WizardCreateNewAgencySecondPage';
import WizardCreateNewAgencyThirdPage from './WizardCreateNewAgencyThirdPage';
import WizardCreateNewAgencyFourthPage from './WizardCreateNewAgencyFourthPage';
import WizardCreateNewAgencyFifthPage from './WizardCreateNewAgencyFifthPage';
import Stepper from 'react-stepper-horizontal';
import { connect } from 'react-redux';
import countryList from '../../../country-region-data/data';

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
       {title: ""}
      ]
    };
  }

  nextPage(){
    console.log("Next Page!");
    this.setState({ page: this.state.page + 1 });
  }

  previousPage(){
    console.log("Previous Page!");
    this.setState({ page: this.state.page - 1 });
  }

  onSubmit(formValues){
    console.log(formValues);
  }

  render() {
    let { page } = this.state;
    let countries = countryList();

    console.log("this.state.page: ",this.state.page);

    return (
      <div className="wizard-create-agency">
        <Stepper steps={ this.state.steps } activeStep={ page-1 } activeColor="#eb8d34" completeColor="#8cb544" defaultBarColor="#eb8d34" completeBarColor="#8cb544" barStyle="solid" />
        <div className="wizard-wrapper">
          {page === 1 && <WizardCreateNewAgencyFirstPage onSubmit={this.nextPage} countryList={countries} {...this.props} />}
          {page === 2 &&
            <WizardCreateNewAgencySecondPage previousPage={this.previousPage} onSubmit={this.nextPage} countryList={countries} {...this.props} />}
          {page === 3 &&
            <WizardCreateNewAgencyThirdPage previousPage={this.previousPage} onSubmit={this.nextPage} countryList={countries} {...this.props} />}
          {page === 4 &&
            <WizardCreateNewAgencyFourthPage previousPage={this.previousPage} onSubmit={this.nextPage} countryList={countries} {...this.props} />}
            {page === 5 &&
              <WizardCreateNewAgencyFifthPage previousPage={this.previousPage} onSubmit={this.onSubmit} countryList={countries} {...this.props} />}
        </div>
      </div>
    );
  }
}

export default connect(null)(CreateNewAgency);
