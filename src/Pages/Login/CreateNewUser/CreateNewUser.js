import React, { Component } from 'react';
import Stepper from 'react-stepper-horizontal';
import { connect } from 'react-redux';
import { notify } from 'reapop';
import httpService from '../../../utils/services/httpService/httpService.js';
import WizardCreateNewUserFirstPage from './WizardCreateNewUserFirstPage.js';
import WizardCreateNewUserSecondPage from './WizardCreateNewUserSecondPage.js';

class CreateNewUser extends Component {
  constructor(props) {
    super(props);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);

    this.state = {
      page: 1,
      steps: [
       {title: ""},
       {title: ""}
      ]
    };
  }

  nextPage(){
    this.setState({ page: this.state.page + 1 });
  }

  previousPage(){
    this.setState({ page: this.state.page - 1 });
  }

  onSubmit = async (formValues) => {
    window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);

    // httpService.post('/recognizeFace', this.state.currentImage)
    //   .then((res) => {
    //     console.log('response: ', res);
    //   }).catch((err) => {
    //     console.log('error: ', err);
    //   });

    this.fireNotification();
  }

  fireNotification = () => {
    console.log("NOTIFY RAN!");
    let { notify } = this.props;

    notify({
      title: 'Sign Up Information Submitted',
      message: 'you clicked on the Submit button',
      status: 'success',
      position: 'br',
      dismissible: true,
      dismissAfter: 3000
    });
  }

  render(){
    let { page, steps } = this.state;

    return(
      <div className="wizard-create-agency">
        <Stepper steps={ steps } activeStep={ page-1 } activeColor="#eb8d34" completeColor="#8cb544" defaultBarColor="#eb8d34" completeBarColor="#8cb544" barStyle="solid" circleFontSize={16} />
        <div className="wizard-wrapper">
          {page === 1 && <WizardCreateNewUserFirstPage  onSubmit={this.nextPage} {...this.props} />}
          {page === 2 && <WizardCreateNewUserSecondPage previousPage={this.previousPage} onSubmit={this.onSubmit} {...this.props} />}
        </div>
      </div>
    );
  }
}

export default connect(null, { notify })(CreateNewUser);
