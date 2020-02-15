import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Field, reduxForm, reset } from 'redux-form';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import { notify } from 'reapop';
import Validate from '../../Validations/Validations';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation';
import { tempedgeAPI, clearTempedgeStoreProp } from '../../../Redux/actions/tempEdgeActions';
import types from '../../../Redux/actions/types';

const $ = window.$;

class UploadEmployeeList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { btnDisabled: true, submitted: 0 };
    const { activeLanguage } = this.props;
    const { addTranslationForLanguage } = this.props;
    ActiveLanguageAddTranslation(activeLanguage, addTranslationForLanguage);
  }

  componentDidUpdate(prevProps) {
    // const { changePassword } = this.props;
    // const { submitted } = this.state;
    // if (changePassword && submitted === 1) {
    //   const notifyMessage = {
    //     position: 'br',
    //     dismissible: true,
    //     dismissAfter: 3000,
    //   };
    //   this.setState({
    //     submitted: 0,
    //   });
    //   if (changePassword.status === 200) {
    //     this.props.clearTempedgeStoreProp('changePassword');
    //     if (changePassword.data.status === 200) {
    //       notifyMessage.title = <Translate id="com.tempedge.msg.info.title.password_changed" />;
    //       notifyMessage.message = <Translate id="com.tempedge.msg.info.body.password_changed" />;
    //       notifyMessage.status = 'success';
    //       this.resetChangePasswordForm();
    //     } else {
    //       notifyMessage.title = <Translate id="com.tempedge.msg.info.title.invalid_password" />;
    //       notifyMessage.message = <Translate id="com.tempedge.msg.info.body.invalid_password" />;
    //       notifyMessage.status = 'error';
    //     }
    //   } else {
    //     notifyMessage.title = <Translate id="com.tempedge.error.undefine" />;
    //     notifyMessage.message = <Translate id="com.tempedge.error.undefine" />;
    //     notifyMessage.status = 'error';
    //   }
    //   this.fireNotification(notifyMessage);
    // }

    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/auth/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  onChange = (file, ref) => {
    let readOnlyTextBox = $(ReactDOM.findDOMNode(this.refs[ref]));
    let fileName = file.name.replace(/\\/g, '/').replace(/.*\//, '');

    readOnlyTextBox.text(fileName);

    let reader = new FileReader();

    reader.readAsBinaryString(file); //Read Blob as binary

    //Event Listener for when a file is selected to be uploaded
    reader.onload = (event) => {
      //(on_file_select_event)
      let data = event.target.result; //'result' if not 'null', contains the contents of the file as a binary string
      let stateName = ref === 'fileInputDocuments' ? 'documents' : 'resume';

      /* Update state */
      this.setState(() => ({
        [stateName]: {
          name: file.name,
          data: data,
        },
        btnDisabled: false,
      }));
    };
  };

  onSubmit = async (formValues) => {
    const request = {
      oldPassword: formValues.password,
      newPassword: formValues.confirmpassword,
    };

    this.setState(
      () => ({
        submitted: 1,
      }),
      () => {
        this.props.tempedgeAPI('/api/user/changePassword', request, types.CHANGE_PASSWORD);
      },
    );
  };

  fireNotification = (notifyMessage) => {
    const { notify } = this.props;
    notify(notifyMessage);
  };

  render() {
    return (
      <div className="container-fluid login-container">
        <div className="row">
          <div className="col-md-12">
            <div className="login-form">
              <div className="panel panel-default login-form-panel">
                <div className="panel-heading login-header">
                  <h2 className="text-center">
                    <Translate id="com.tempedge.msg.label.uploadEmployeeList" />
                  </h2>
                </div>
                <form className="panel-body" onSubmit={this.props.handleSubmit(this.onSubmit)}>
                  <div className="form-group row">
                    <div className="col-12">
                      <p className="text-left label-p">
                        <Translate id="com.tempedge.msg.label.uploadEmployeeList" />
                      </p>

                      <div className="input-group">
                        <label className="input-group-btn" style={{ width: '100%' }}>
                          <span className="btn department-list-button">
                            <Translate id="com.tempedge.msg.label.choosefile" />
                            <input type="file" onChange={(e) => this.onChange(e.target.files[0], 'fileInputDocuments')} style={{ display: 'none' }} accept=".xlsx" />
                          </span>
                        </label>
                        <br />
                        <p ref="fileInputDocuments" style={{ margin: '20px auto 0 auto', background: '#ffff', border: 'none', textAlign: 'center' }}></p>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block" disabled={this.state.btnDisabled}>
                      <Translate id="com.tempedge.msg.label.upload" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UploadEmployeeList.propTypes = {
  reset: PropTypes.func.isRequired,
  tempedgeAPI: PropTypes.func.isRequired,
  clearTempedgeStoreProp: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    // changePassword: state.tempEdge.changePassword ? state.tempEdge.changePassword : null,
  };
};

UploadEmployeeList = reduxForm({
  form: 'uploadEmployeeList',
  validate: Validate,
})(UploadEmployeeList);

export default withLocalize(connect(mapStateToProps, { tempedgeAPI, push, notify, reset, clearTempedgeStoreProp })(UploadEmployeeList));
