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

class UploadEmployeeList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { btnDisabled: true, submitted: 0, now: 0, loading: false };
    this.fileNameTextBox = React.createRef();
    const { activeLanguage } = this.props;
    const { addTranslationForLanguage } = this.props;
    ActiveLanguageAddTranslation(activeLanguage, addTranslationForLanguage);
  }

  componentDidUpdate(prevProps) {
    const { savePerson, activeLanguage, addTranslationForLanguage } = this.props;
    const { submitted } = this.state;
    let { totalFilesToProccess, currentFileNum } = this.state;
    const hasActiveLanguageChanged = prevProps.activeLanguage !== activeLanguage;
    if (currentFileNum !== totalFilesToProccess && savePerson && submitted === 1) {
      const notifyMessage = {
        position: 'br',
        dismissible: true,
        dismissAfter: 3000,
      };
      currentFileNum += 1;
      this.setState({
        // submitted: 0,
        currentFileNum,
        now: (currentFileNum / totalFilesToProccess) * 100,
        loading: currentFileNum === totalFilesToProccess ? false : true,
      });

      if (savePerson.status === 200) {
        if (savePerson.data.status === 200) {
          notifyMessage.title = <Translate id="com.tempedge.msg.info.title.employeeCreated" />;
          notifyMessage.message = <Translate id="com.tempedge.msg.info.body.employeeCreated" />;
          notifyMessage.status = 'success';
          this.resetChangePasswordForm();
        } else {
          notifyMessage.title = <Translate id="com.tempedge.msg.info.title.undefine" />;
          notifyMessage.message = <Translate id="com.tempedge.msg.info.body.undefine" />;
          notifyMessage.status = 'error';
        }
      } else {
        notifyMessage.title = <Translate id="com.tempedge.error.undefine" />;
        notifyMessage.message = <Translate id="com.tempedge.error.undefine" />;
        notifyMessage.status = 'error';
      }

      this.props.clearTempedgeStoreProp('savePerson');
      this.fireNotification(notifyMessage);
    }

    if (hasActiveLanguageChanged) {
      push(`/auth/${activeLanguage.code}`);
      ActiveLanguageAddTranslation(activeLanguage, addTranslationForLanguage);
    }
  }

  componentWillUnmount() {
    this.props.clearTempedgeStoreProp('savePerson');
  }

  onChange = (e) => {
    const [file] = e.target.files;
    const fileNameTextBox = this.fileNameTextBox.current;
    const fileName = file.name.replace(/\\/g, '/').replace(/.*\//, '');
    const reader = new FileReader();
    fileNameTextBox.textContent = fileName;
    // Read Blob as binary
    reader.readAsBinaryString(file);
    // Event Listener for when a file is selected to be uploaded
    reader.onload = (event) => {
      // (on_file_select_event), 'result' if not 'null', contains the contents of the file as a binary string
      const data = event.target.result;

      /* Update state */
      this.setState(() => ({
        name: file.name,
        data,
        file,
        btnDisabled: false,
      }));
    };
  };

  onSubmit = async () => {
    const { file } = this.state;
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
      if (errors.length === 0) {
        // progressInstance = ;
        this.setState(() => ({
          submitted: 1,
          now: 0,
          totalFilesToProccess: rows.length,
          currentFileNum: 0,
          loading: true,
        }));
        rows.forEach((employee) => {
          this.props.tempedgeAPI('/api/person/save', employee, types.PERSON_SAVE);
        });
      } else {
        throw new Error('There was an error procesing your excel file.');
      }
    });
  };

  fireNotification = (notifyMessage) => {
    const { notify } = this.props;
    notify(notifyMessage);
  };

  render() {
    const { btnDisabled, currentFileNum, totalFilesToProccess, now, loading } = this.state;
    const { handleSubmit } = this.props;
    let progressInstance = null;
    // if (loading) {
    //   console.log('ok');
    //   progressInstance = <ProgressBar animated now={now} label={`${now}%`} />;
    // }

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
                        <p className="text-left label-p" ref={this.fileNameTextBox} />
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
};

const mapStateToProps = ({ tempEdge }) => ({ savePerson: tempEdge.savePerson });

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
