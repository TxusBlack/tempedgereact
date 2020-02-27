import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, reset } from 'redux-form';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import { notify } from 'reapop';
import ProgressBar from 'react-bootstrap/ProgressBar';
import readXlsxFile from 'read-excel-file';
import Validate from '../../Validations/Validations';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation';
import { tempedgeAPI, clearTempedgeStoreProp } from '../../../Redux/actions/tempEdgeActions';
import types from '../../../Redux/actions/types';

const url = '/api/person/saveList';

class UploadEmployeeList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { btnDisabled: true, submitted: 0, now: 0 };
    this.fileNameTextBox = React.createRef();
    const { activeLanguage } = this.props;
    const { addTranslationForLanguage } = this.props;
    ActiveLanguageAddTranslation(activeLanguage, addTranslationForLanguage);
  }

  componentDidUpdate(prevProps) {
    const { saveEmployeeList, activeLanguage, addTranslationForLanguage, clearTempedgeStoreProp } = this.props;
    const { submitted } = this.state;
    const hasActiveLanguageChanged = prevProps.activeLanguage !== activeLanguage;

    if (saveEmployeeList && submitted === 1) {
      this.changeProgressbar(100);
      this.setState({
        submitted: 0,
      });

      if (saveEmployeeList.status === 200) {
        if (saveEmployeeList.data.status === 200) {
          this.succesNotification();
          this.resetForm();
        } else {
          this.warningNotification({
            title: <Translate id="com.tempedge.msg.info.title.empleyeesAlreadyExist" />,
          });
        }
      } else {
        this.errorNotification({
          title: <Translate id="com.tempedge.error.undefine" />,
          message: <Translate id="com.tempedge.error.undefine" />,
        });
      }

      clearTempedgeStoreProp('saveEmployeeList');
    }

    if (hasActiveLanguageChanged) {
      push(`/auth/${activeLanguage.code}`);
      ActiveLanguageAddTranslation(activeLanguage, addTranslationForLanguage);
    }
  }

  componentWillUnmount() {
    const { clearTempedgeStoreProp } = this.props;
    clearTempedgeStoreProp('saveEmployeeList');
  }

  onChange = (e) => {
    const [file] = e.target.files;
    const fileNameTextBox = this.fileNameTextBox.current;

    if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel')) {
      const fileName = file.name.replace(/\\/g, '/').replace(/.*\//, '');
      const reader = new FileReader();
      fileNameTextBox.textContent = fileName;
      // Read Blob as binary
      reader.readAsBinaryString(file);
      // Event Listener for when a file is selected to be uploaded
      reader.onload = () => {
        this.setState(() => ({
          file,
          btnDisabled: false,
        }));
      };
    } else {
      this.warningNotification({
        title: <Translate id="com.tempedge.msg.info.title.incorrectFileExtension" />,
      });
    }
  };

  onSubmit = async () => {
    const { file } = this.state;
    const { tempedgeAPI } = this.props;
    this.changeProgressbar(0);

    const schema = {
      DEPARTMENT: {
        prop: 'empDepartment',
        type: String,
      },
      'EMPLOYEE ID': {
        prop: 'employeeId',
        type: String,
        required: true,
      },
      LASTNAME: {
        prop: 'lastName',
        type: String,
        required: true,
      },
      FIRSTNAME: {
        prop: 'firstName',
        type: String,
        required: true,
      },
      MIDDLENAME: {
        prop: 'middleName',
        type: String,
      },
      SSN: {
        prop: 'identification',
        type: String,
        required: true,
      },
      ADDRESS: {
        prop: 'address',
        type: String,
        required: true,
      },
      ADDRESS2: {
        prop: 'address2',
        type: String,
      },
      CITY: {
        prop: 'city',
        type: String,
        required: true,
      },
      'STATE (2CHARS)': {
        prop: 'region',
        type: Number,
        required: true,
      },
      ZIPCODE: {
        prop: 'zipcode',
        type: String,
        required: true,
      },
      PHONE: {
        prop: 'phone',
        type: String,
        required: true,
      },
      GENDER: {
        prop: 'gender',
        type: String,
        required: true,
      },
      BIRTHDAY: {
        prop: 'birthDay',
        type: String,
        required: true,
      },
    };

    readXlsxFile(file, { schema }).then(({ rows, errors }) => {
      const request = { orgId: 1, personEntityList: rows };
      if (errors.length === 0) {
        if (rows.length === 0) {
          this.warningNotification({
            title: <Translate id="com.tempedge.msg.info.title.emptyFile" />,
          });
          this.changeProgressbar(100);
        } else {
          this.setState(() => ({
            submitted: 1,
          }));
          tempedgeAPI(url, request, types.SAVE_EMPLOYEE_LIST);
        }
      } else {
        this.errorNotification({
          title: <Translate id="com.tempedge.msg.info.title.errorProcessingFile" />,
        });
        this.changeProgressbar(100);
      }
    });
  };

  fireNotification = (notifyMessage) => {
    const message = {
      ...notifyMessage,
      position: 'br',
      dismissible: true,
      dismissAfter: 3000,
    };
    const { notify } = this.props;
    notify(message);
  };

  errorNotification = (message) => {
    this.fireNotification({ ...message, status: 'error' });
  };

  warningNotification = (message) => {
    this.fireNotification({ ...message, status: 'warning' });
  };

  succesNotification = () => {
    this.fireNotification({
      title: <Translate id="com.tempedge.msg.info.title.employeeCreated" />,
      message: <Translate id="com.tempedge.msg.info.body.employeeCreated" />,
      status: 'success',
    });
  };

  changeProgressbar(progress) {
    this.setState({
      now: progress,
    });
  }

  resetForm() {
    const { reset } = this.props;
    reset('uploadEmployeeList');
    this.fileNameTextBox.current.textContent = '';
    clearTempedgeStoreProp('saveEmployeeList');
    this.setState(() => ({
      btnDisabled: true,
    }));
  }

  render() {
    const { btnDisabled, now } = this.state;
    const { handleSubmit } = this.props;

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
                <form className="panel-body" onSubmit={handleSubmit(this.onSubmit)}>
                  <div className="form-group row">
                    <div className="col-12">
                      <p className="text-left label-p">
                        <Translate id="com.tempedge.msg.label.uploadEmployeeList" />
                      </p>
                      <div className="input-group">
                        <label htmlFor="employeeListFile" className="input-group-btn">
                          <span className="btn department-list-button">
                            <Translate id="com.tempedge.msg.label.choosefile" />
                            <input id="employeeListFile" type="file" onChange={(e) => this.onChange(e)} className="d-none" accept=".xlsx, .xls" />
                          </span>
                        </label>
                        <br />
                        <div className="w-100">
                          <p className="text-left" ref={this.fileNameTextBox} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <ProgressBar animated now={now} label={`${now}%`} />
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block" disabled={btnDisabled}>
                      <Translate id="com.tempedge.msg.label.upload" />
                    </button>
                  </div>
                </form>
                <div className="panel-footer login-footer" />
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
  handleSubmit: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
};

const mapStateToProps = ({ tempEdge }) => ({ saveEmployeeList: tempEdge.saveEmployeeList });

const uploadEmployeeList = reduxForm({
  form: 'uploadEmployeeList',
  validate: Validate,
})(UploadEmployeeList);

export default withLocalize(
  connect(mapStateToProps, {
    tempedgeAPI,
    push,
    notify,
    reset,
    clearTempedgeStoreProp,
  })(uploadEmployeeList),
);
