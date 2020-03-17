import React, { Component } from 'react';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import Validate from '../Validations/Validations';
import { tempedgeAPI } from '../../Redux/actions/tempEdgeActions';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import InputBox from '../../components/common/InputBox/InputBox';

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
      <div className="container-fluid login-container">
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
                    <div>
                      <div className="form-group row">
                        <div className="col-6">
                          <p className="text-left label-p">
                            <Translate id="com.tempedge.msg.label.firstname" />: {profile.user.firstName || '-'}
                          </p>
                        </div>
                        <div className="col-6">
                          <p className="text-left label-p">
                            <Translate id="com.tempedge.msg.label.middlename" />: {profile.user.middleName || '-'}
                          </p>
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-6">
                          <p className="text-left label-p">
                            <Translate id="com.tempedge.msg.label.lastname" />: {profile.user.lastName || '-'}
                          </p>
                        </div>
                        <div className="col-6">
                          <p className="text-left label-p">
                            <Translate id="com.tempedge.msg.label.email" />: {profile.user.email || '-'}
                          </p>
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-6">
                          <p className="text-left label-p">ID: {profile.user.identification || '-'}</p>
                        </div>
                        <div className="col-6">
                          <p className="text-left label-p">
                            <Translate id="com.tempedge.msg.label.organization" />: {profile.organizationEntity.organizationName || '-'}
                          </p>
                        </div>
                      </div>
                    </div>
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

// const mapStateToProps = (state) => {
//   return {
//     changePassword: state.tempEdge.changePassword ? state.tempEdge.changePassword : null,
//   };
// };

ProfilePage = reduxForm({
  form: 'changePassword',
  validate: Validate,
})(ProfilePage);

export default withLocalize(connect(null, { tempedgeAPI })(ProfilePage));