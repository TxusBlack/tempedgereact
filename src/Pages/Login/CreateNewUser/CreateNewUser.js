import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Stepper from 'react-stepper-horizontal';
import { connect } from 'react-redux';
import { notify } from 'reapop';
import { reset } from 'redux-form';
import { getList, storeFormPageNumber } from '../../../Redux/actions/tempEdgeActions';
import { GET_ROLE_LIST } from '../../../Redux/actions/types.js'
import httpService from '../../../utils/services/httpService/httpService.js';
import WizardCreateNewUserFirstPage from './WizardCreateNewUserFirstPage.js';
import WizardCreateNewUserSecondPage from './WizardCreateNewUserSecondPage.js';

class CreateNewUser extends Component {
  constructor(props){
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

  componentWillMount = () => {
    this.props.getList('/api/role/listAll', GET_ROLE_LIST);

    if(typeof this.props.lastPage !== 'undefined' && this.props.lastPage.pos >= 1){
      this.setState(() => {
        return { page: this.props.lastPage.pos}
      });
    }
  }

  componentWillUnmount = () => {
    this.props.storeFormPageNumber("CreateNewUser", 1);
    this.props.reset("CreateNewUser");    //Reset form fields all to empty
  }

  nextPage(){
    this.setState({
      page: this.state.page + 1
    },() => {
      this.props.storeFormPageNumber("CreateNewUser", this.state.page);
    });
  }

  previousPage(){
    this.setState({
      page: this.state.page - 1
    },() => {
      this.props.storeFormPageNumber("CreateNewUser", this.state.page);
      //Make this.props.invalid = false, force re-check on all fields
    });
  }

  onSubmit = async (formValues) => {
    let response = {
      "orgId" : 1,
      "IPAddress" : "10.1.1.1",
      "user" : {
          "firstName" : formValues.firstName,
          "lastName" : formValues.lastName,
          "username" : formValues.username,
          "password" : formValues.password,
          "email" : formValues.email
      },
      "portalUserConfEntity" : {
          "clientId" : "",
          "officeId" : 1,
          "userRoleId" : formValues.agencyrole.id
      }
    }

    console.log("response: ", response);

    httpService.postCreateNew('/api/user/save', response)
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

CreateNewUser.propTypes = {
  getList: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired
}

let mapStateToProps = (state) => {
  return({
    lastPage: state.tempEdge[`CreateNewUserWizardFormTracker`],
  });
}

export default connect(mapStateToProps, { notify, getList, storeFormPageNumber, reset })(CreateNewUser);
