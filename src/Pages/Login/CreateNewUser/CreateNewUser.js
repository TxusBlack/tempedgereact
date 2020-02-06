import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Stepper from 'react-stepper-horizontal';
import { connect } from 'react-redux';
import { notify } from 'reapop';
import { reset } from 'redux-form';
import { getList } from '../../../Redux/actions/tempEdgeActions';
import types from '../../../Redux/actions/types.js';
import httpService from '../../../utils/services/httpService/httpService.js';
import WizardCreateNewUserFirstPage from './WizardCreateNewUserFirstPage.js';
import WizardCreateNewUserSecondPage from './WizardCreateNewUserSecondPage.js';
import { withLocalize, Translate } from 'react-localize-redux';
const $ = window.$;

class CreateNewUser extends Component {
  constructor(props) {
    super(props);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);

    this.state = {
      page: 1,
      steps: [{ title: '' }, { title: '' }],
      message: '',
      errata: ''
    };
  }

  componentDidMount = () => {
    this.props.getList('/api/role/listAll', types.GET_ROLE_LIST);
  };

  nextPage() {
    this.setState({ page: this.state.page + 1 });
  }

  previousPage() {
    this.setState({ page: this.state.page - 1 });
  }

  onSubmit = async formValues => {
    console.log('userRoleId: ', formValues.agencyrole.roleId);
    let response = {
      orgName: formValues.agencyorganization,
      username: formValues.username,
      user: {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        username: formValues.username,
        password: formValues.initialpassword === formValues.confirmpassword ? formValues.initialpassword : null,
        email: formValues.email,
        identification: '2230'
        //"birthday"  : formValues.birthday,  // Miss also, middle name
        //"gender"    : formValues.gender,
        //"agencyrole": formValues.agencyrole,
      },
      //"agencyssnlastfour" : formValues.agencyssnlastfour
      clientName: formValues.agencyclient,
      officeName: formValues.agencyoffice,
      roleId: formValues.agencyrole.roleId
    };

    console.log('response: ', response);

    httpService
      .post('/api/user/save', response)
      .then(res => {
        console.log('res: ', res);

        this.setState(
          () => ({
            message: <Translate id={res.data.message} />
          }),
          () => {
            this.fireNotification(res.data.status);
          }
        );
      })
      .catch(err => {
        console.log('error: ', err);
        this.fireNotification();
      });
  };

  fireNotification = (status = null) => {
    let { notify } = this.props;
    let title = 'Sign Up Information Submitted';
    let message = $('#response-translated').text();
    let errata = (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-4' style={{ backgroundColor: '#f2dede', borderColor: '#eed3d7', color: '#b94a48', padding: 20 }}>
            <ul>
              <li>{message}</li>
            </ul>
          </div>
        </div>
      </div>
    );
    let statusCode = '';

    if (status == 500) {
      statusCode = 'warning';
      this.setState(() => ({
        page: 1,
        errata: errata
      }));
    } else if (status === 200) {
      statusCode = 'success';
      this.props.reset('CreateNewUser'); //Reset form fields all to empty
      this.setState({ page: 1 });
    } else {
      statusCode = 'error';
    }

    notify({
      title: title,
      message: message,
      status: statusCode,
      position: 'br',
      dismissible: true,
      dismissAfter: 6000
    });
  };

  componentWillUnmount() {
    this.props.reset('CreateNewUser'); //Reset form fields all to empty
  }

  render() {
    let { page, steps } = this.state;

    return (
      <div className='wizard-create-agency'>
        <Stepper steps={steps} activeStep={page - 1} activeColor='#eb8d34' completeColor='#8cb544' defaultBarColor='#eb8d34' completeBarColor='#8cb544' barStyle='solid' circleFontSize={16} />
        <div className='wizard-wrapper'>
          {page === 1 && <WizardCreateNewUserFirstPage onSubmit={this.nextPage} errata={this.state.errata} {...this.props} />}
          {page === 2 && <WizardCreateNewUserSecondPage previousPage={this.previousPage} onSubmit={this.onSubmit} {...this.props} />}
        </div>
        {
          <div id='response-translated' style={{ display: 'none' }}>
            {this.state.message}
          </div>
        }
      </div>
    );
  }
}

CreateNewUser.propTypes = {
  getList: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired
};

export default withLocalize(connect(null, { notify, getList, reset })(CreateNewUser));
