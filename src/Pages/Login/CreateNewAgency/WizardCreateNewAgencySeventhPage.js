import React, { Component } from 'react';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Captcha from '../../../components/common/Captcha/Captcha';
import Validate from '../../Validations/Validations';
import { notify } from 'reapop';
import ProgressBar from 'react-bootstrap/ProgressBar';
import OutcomeBar from '../../../components/common/OutcomeBar/index.js';

class WizardCreateNewAgencySeventhPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      btnDisabled: true,
      submitted: 0,
      now: 0
    }

    this.fileNameTextBox = React.createRef();
    const { activeLanguage, addTranslationForLanguage } = this.props;
    ActiveLanguageAddTranslation(activeLanguage, addTranslationForLanguage);
    this.regionsList = null;
  }

  onChange = (e) => {
    this.hideResultBar();
    const [file] = e.target.files;
    const fileNameTextBox = this.fileNameTextBox.current;

    console.log('file.type', file);

    if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')) {
      if (file.size <= 1048576) {
        const fileName = file.name.replace(/\\/g, '/').replace(/.*\//, '');
        const reader = new FileReader();
        fileNameTextBox.textContent = fileName;
        // Event Listener for when a file is selected to be uploaded
        reader.onload = (event) => {
          const binaryString = event.target.result;
          this.setState(() => ({
            binaryString,
            btnDisabled: false
          }));
        };
        // Read Blob as binary
        reader.readAsBinaryString(file);
      } else {
        this.setState(() => ({
          btnDisabled: true
        }));
        this.showWarningResultBar("com.tempedge.error.fileerrorsize");
      }
    } else if (file) {
      this.setState(() => ({
        btnDisabled: true
      }));
      this.showWarningResultBar("com.tempedge.warn.fileerror");
    }
  };

  showResultBar(translateId, messageType, customMessage) {
    this.setState({
      resultBar: <OutcomeBar classApplied={`announcement-bar ${messageType}`} translateId={translateId} customData={customMessage}></OutcomeBar>
    });

    setTimeout(() => {
      this.changeProgressbar(0);
    }, 2000);
  }

  hideResultBar() {
    this.setState({
      resultBar: ''
    });
  }

  showSuccessResultBar(translateId, customMessage) {
    this.showResultBar(translateId, 'success', customMessage);
  }

  showWarningResultBar(translateId, customMessage) {
    this.showResultBar(translateId, 'warning', customMessage);
  }

  showErrorResultBar(translateId, customMessage) {
    this.showResultBar(translateId, 'fail', customMessage);
  }

  changeProgressbar(progress) {
    this.setState({
      now: progress
    });
  }

  render() {
    console.log("Seventh Page");

    const { btnDisabled, now, resultBar } = this.state;

    return (
      <React.Fragment>
        <h2 className="text-center page-title-agency"><Translate id="com.tempedge.msg.label.uploadlogo"></Translate></h2>
        <form className="panel-body" onSubmit={this.props.handleSubmit} className="form-horizontal center-block register-form-agency" style={{ paddingBottom: "0px" }}>
          <div className="container p-4">
            <div className="row">
              <div className="col-12">{resultBar}</div>
            </div>

            <div className="form-group row">
              <div className="col-12">
                <p className="text-left label-p">
                  <Translate id="com.tempedge.msg.label.uploadEmployeeList" />
                </p>
                <div className="input-group">
                  <label htmlFor="employeeListFile" className="input-group-btn">
                    <span className="btn department-list-button">
                      <Translate id="com.tempedge.msg.label.choosefile" />
                      <input id="employeeListFile" type="file" onChange={(e) => this.onChange(e)} className="d-none" accept=".jpg, .jpeg, .png" />
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
                <Translate id="com.tempedge.msg.label.uploadfile" />
              </button>
            </div>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    // address: state.form.CreateNewAgency.values.agencyaddress,
    // city: state.form.CreateNewAgency.values.agencycity,
    // recruitmentoffice: state.form.CreateNewAgency.values.recruitmentofficephonenumbers.length,
    // phonenumbers: state.form.CreateNewAgency.values.recruitmentofficephonenumbers.length,
    // salesmen: state.form.CreateNewAgency.values.recruitmentofficesalespersons.length
  }
};

WizardCreateNewAgencySeventhPage = reduxForm({
  form: 'CreateNewAgency',
  destroyOnUnmount: false,
  validate: Validate
})(WizardCreateNewAgencySeventhPage);

export default withLocalize(connect(mapStateToProps, { push, notify })(WizardCreateNewAgencySeventhPage));
