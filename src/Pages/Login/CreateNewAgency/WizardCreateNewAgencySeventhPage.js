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
import { uploadLogo, setCleanLogo } from '../../../Redux/actions/tempEdgeActions';

class WizardCreateNewAgencySeventhPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      btnDisabled: true,
      submitted: 0,
      now: 0,
      binaryString: null
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

    if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')) {
      if (file.size <= 1048576) {
        const fileName = file.name.replace(/\\/g, '/').replace(/.*\//, '');
        const reader = new FileReader();
        fileNameTextBox.textContent = fileName;
        // Event Listener for when a file is selected to be uploaded
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const binaryString = event.target.result;
          this.setState(() => ({
            binaryString,
            btnDisabled: false
          }));
          this.props.uploadLogo('SAVE_LOGO', this.state.binaryString);
        };
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

  componentWillUnmount() {
    this.props.setCleanLogo();
  }

  render() {
    const { btnDisabled, now, resultBar } = this.state;
    return (
      <div className="container-fluid login-container" style={{ width: '80vw' }}>
        <div className="row">
          <div className="col-md-12">
            <div className="login-form">
              <div className="panel panel-default login-form-panel">
                <div className="panel-heading login-header">
                  <h2 className="text-center">
                    <Translate id="com.tempedge.msg.label.uploadlogo"></Translate>
                  </h2>
                </div>
                <form className="panel-body" onSubmit={this.props.handleSubmit}>
                  <div className="container p-4">
                    <div className="row">
                      <div className="col-12">{resultBar}</div>
                    </div>

                    <div className="form-group row">
                      <div className="col-12">
                        <div className="input-group">
                          <div className="row">
                            <div className="col-6">
                              <label htmlFor="logo" className="input-group-btn">
                                <span className="btn department-list-button">
                                  <Translate id="com.tempedge.msg.label.choosefile" />
                                  <input id="logo" type="file" onChange={(e) => this.onChange(e)} className="d-none" accept=".jpg, .jpeg, .png" />
                                </span>
                              </label>
                              <br />
                              <div className="w-100">
                                <p className="text-left" ref={this.fileNameTextBox} />
                              </div>
                            </div>
                            <div className="col-6">
                              <img src={this.props.logo || '/img/Temp_Edge_250-80-1.png'} className="company-logo" alt="Company Logo" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <button type="submit" className="btn btn-primary btn-block">
                        <Translate id="com.tempedge.msg.label.uploadfile" />
                      </button>
                    </div>
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

WizardCreateNewAgencySeventhPage = reduxForm({
  form: 'CreateNewAgency',
  destroyOnUnmount: false,
  validate: Validate
})(WizardCreateNewAgencySeventhPage);

const mapStateToProps = (state) => {
  return {
    logo: state.tempEdge.logo,
  };
}

export default withLocalize(connect(mapStateToProps, { push, notify, uploadLogo, setCleanLogo })(WizardCreateNewAgencySeventhPage));
