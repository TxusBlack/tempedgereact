import React, { Component } from 'react';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import Validate from '../Validations/Validations';
import { tempedgeAPI } from '../../Redux/actions/tempEdgeActions';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

class ProfilePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      profile: null
    }
  }

  _getProfileInfo = async () => {
    const profile = await JSON.parse(sessionStorage.getItem('agency'));
    this.setState({ profile: profile });
    console.log('profile', this.state.profile);
  }

  onSubmit = async (formValues) => {
  };

  componentDidMount() {
    this._getProfileInfo();
  }

  render() {
    const { profile } = this.state;
    const { handleSubmit } = this.props;
    return (
      <div className="container-fluid login-container" style={{ width: '80vw' }}>
        <div className="row">
          <div className="col-md-12">
            <div className="login-form">
              <div className="panel panel-default login-form-panel">
                <div className="panel-heading login-header">
                  <h2 className="text-center">
                    <Translate id="com.tempedge.msg.label.userinformation" />
                  </h2>
                </div>
                <form className="panel-body" onSubmit={handleSubmit(this.onSubmit)}>
                  {
                    profile &&
                    <table className="table table-striped">
                      <tbody>
                        <tr className="tableRow">
                          <td className="table-content" style={{ width: '50%' }}>
                            <Translate id="com.tempedge.msg.label.firstname" />
                          </td>
                          <td className="table-content" style={{ width: '50%' }}>
                            {profile.user.firstName || '-'}
                          </td>
                        </tr>
                        <tr className="tableRow">
                          <td className="table-content" style={{ width: '50%' }}>
                            <Translate id="com.tempedge.msg.label.middlename" />
                          </td>
                          <td className="table-content" style={{ width: '50%' }}>
                            {profile.user.middleName || '-'}
                          </td>
                        </tr>
                        <tr className="tableRow">
                          <td className="table-content" style={{ width: '50%' }}>
                            <Translate id="com.tempedge.msg.label.lastname" />
                          </td>
                          <td className="table-content" style={{ width: '50%' }}>
                            {profile.user.lastName || '-'}
                          </td>
                        </tr>
                        <tr className="tableRow">
                          <td className="table-content" style={{ width: '50%' }}>
                            <Translate id="com.tempedge.msg.label.email" />
                          </td>
                          <td className="table-content" style={{ width: '50%' }}>
                            {profile.user.email || '-'}
                          </td>
                        </tr>
                        <tr className="tableRow">
                          <td className="table-content" style={{ width: '50%' }}>
                            <Translate id="com.tempedge.msg.label.organization" />
                          </td>
                          <td className="table-content" style={{ width: '50%' }}>
                            {profile.organizationEntity.organizationName || '-'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  }
                </form>
                <div className="end-container">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfilePage.propTypes = {
  reset: PropTypes.func.isRequired,
  tempedgeAPI: PropTypes.func.isRequired,
  clearTempedgeStoreProp: PropTypes.func.isRequired,
};

ProfilePage = reduxForm({
  form: 'changePassword',
  validate: Validate,
})(ProfilePage);

export default withLocalize(connect(null, { tempedgeAPI })(ProfilePage));