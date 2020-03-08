import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, reset } from 'redux-form';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import { notify } from 'reapop';
import ProgressBar from 'react-bootstrap/ProgressBar';
import XLSX from 'xlsx';
import Validate from '../../Validations/Validations';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation';
import { tempedgeAPI, clearTempedgeStoreProp, getList } from '../../../Redux/actions/tempEdgeActions';
import types from '../../../Redux/actions/types';
import OutcomeBar from '../../../components/common/OutcomeBar';
import CountryRegionParser from '../../../components/common/CountryRegionParser/CountryRegionParser';
import ContainerBlue from '../../../components/common/Container/ContainerBlue';

const requestUrl = '/api/person/saveList';
const defaultCountry = 'United States';

class UploadEmployeeList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { btnDisabled: true, submitted: 0, now: 0 };
    this.fileNameTextBox = React.createRef();
    const { activeLanguage } = this.props;
    const { addTranslationForLanguage } = this.props;
    ActiveLanguageAddTranslation(activeLanguage, addTranslationForLanguage);
    this.regionsList = null;
  }

  async componentDidMount() {
    const { getList, countryRegionList } = this.props;
    await getList('/api/country/listAll', types.GET_COUNTRY_REGION_LIST);
  }

  componentDidUpdate(prevProps) {
    const { saveEmployeeList, activeLanguage, addTranslationForLanguage, clearTempedgeStoreProp, countryRegionList } = this.props;
    const { submitted } = this.state;
    const hasActiveLanguageChanged = prevProps.activeLanguage !== activeLanguage;

    if (!this.regionsList) {
      this.getRegionList(countryRegionList);
    }

    if (saveEmployeeList && submitted === 1) {
      this.changeProgressbar(100);
      this.setState({
        submitted: 0
      });
      if (saveEmployeeList.status === 200) {
        const { result } = saveEmployeeList.data;
        const summary = { newEmployees: result.newEmployees, modEmployees: result.modEmployees };
        if (saveEmployeeList.data.status === 200) {
          this.showSuccessResultBar('com.tempedge.msg.info.title.employeeCreated', summary);
        } else {
          this.showWarningResultBar(saveEmployeeList.data.message, summary);
        }
      } else {
        this.showErrorResultBar('com.tempedge.error.undefine');
      }

      this.resetForm();
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

  async getRegionList(countryRegionList) {
    this.regionsList = await CountryRegionParser.getRegionList(countryRegionList, defaultCountry);
  }

  onChange = (e) => {
    this.hideResultBar();
    const [file] = e.target.files;
    const fileNameTextBox = this.fileNameTextBox.current;

    if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel')) {
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
    } else if (file) {
      this.setState(() => ({
        btnDisabled: true
      }));
      this.showWarningResultBar('com.tempedge.msg.info.title.incorrectFileExtension');
    }
  };

  onSubmit = async () => {
    const { binaryString } = this.state;
    const { tempedgeAPI } = this.props;

    this.changeProgressbar(0);
    try {
      const wb = XLSX.read(binaryString, { type: 'binary', cellDates: true, dateNF: 'yyyy-mm-dd' });
      // Get first worksheet
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      // Convert excel to json
      const employeeList = XLSX.utils.sheet_to_json(ws, {
        header: ['empDepartment', 'employeeId', 'lastName', 'firstName', 'middleName', 'identification', 'address', 'address2', 'city', 'region', 'zipcode', 'phone', 'gender', 'birthDay']
      });
      const request = { orgId: 1, personEntityList: employeeList };
      if (employeeList.length === 0) {
        this.showWarningResultBar('com.tempedge.msg.info.title.emptyFile');
      } else {
        this.changeProgressbar(25);
        this.changeShortCodeByRegionCode(employeeList);
        this.setState(() => ({
          submitted: 1,
          btnDisabled: true
        }));
        tempedgeAPI(requestUrl, request, types.SAVE_EMPLOYEE_LIST);
      }
    } catch (error) {
      this.showErrorResultBar('com.tempedge.msg.info.title.errorProcessingFile');
      this.setState(() => ({
        submitted: 0,
        btnDisabled: false
      }));
    }
  };

  changeShortCodeByRegionCode(employeeList) {
    employeeList.map((employee) => {
      if (employee.region && typeof employee.region === 'string') {
        employee.region = this.findRegionId(employee.region);
      }
    });
  }

  findRegionId(shortCode) {
    const region = this.regionsList.find((regionData) => regionData.shortCode === shortCode);
    if (region) {
      return region.regionId;
    }
    return null;
  }

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

  resetForm() {
    const { reset } = this.props;
    reset('uploadEmployeeList');
    this.fileNameTextBox.current.textContent = '';
    clearTempedgeStoreProp('saveEmployeeList');
    this.setState(() => ({
      btnDisabled: true
    }));
  }

  render() {
    const { btnDisabled, now, resultBar } = this.state;
    const { handleSubmit } = this.props;

    const bodyContainer = (
      <form className="panel-body" onSubmit={handleSubmit(this.onSubmit)}>
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
    );
    return <ContainerBlue title="com.tempedge.msg.label.uploadEmployeeList" children={bodyContainer} width="40%" />;
  }
}

UploadEmployeeList.propTypes = {
  reset: PropTypes.func.isRequired,
  tempedgeAPI: PropTypes.func.isRequired,
  clearTempedgeStoreProp: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired
};

const mapStateToProps = ({ tempEdge }) => ({ saveEmployeeList: tempEdge.saveEmployeeList, countryRegionList: tempEdge.country_region_list });

const uploadEmployeeList = reduxForm({
  form: 'uploadEmployeeList',
  validate: Validate
})(UploadEmployeeList);

export default withLocalize(
  connect(mapStateToProps, {
    tempedgeAPI,
    push,
    notify,
    reset,
    getList,
    clearTempedgeStoreProp
  })(uploadEmployeeList)
);
