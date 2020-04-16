import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import { Translate, withLocalize } from 'react-localize-redux';
import { Field, reduxForm, reset, change, formValueSelector, initialize } from 'redux-form';
import moment from 'moment';
import momentLocaliser from 'react-widgets-moment';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Stepper from 'react-stepper-horizontal';
import DropdownList from '../../../components/common/Dropdown/DropdownList';
import ToggleSwitch from '../../../components/common/ToggleSwitch/ToggleSwitch';
import Datepicker from '../../../components/common/Datepicker/Datepicker';
import types from '../../../Redux/actions/types.js';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import CountryRegionParser from '../../../components/common/CountryRegionParser/CountryRegionParser.js';
import PaginatedTable from '../../../components/common/Table/PaginatedTable.js';
import { tempedgeAPI, tempedgeMultiPartApi, clearTempedgeStoreProp, clearErrorField, getList, getListSafe } from '../../../Redux/actions/tempEdgeActions';
import Validate from '../../Validations/Validations';
import Modal from '../../../Modals/Modal/Modal.js';
import normalizePhone from '../../Normalizers/normalizePhone.js';
import normalizeSSN from '../../Normalizers/normalizeSSN.js';
import ModalSimple from '../../../Modals/ModalSimple/ModalSimple.js';
import DepartmentList from '../../Department/DepartmentList/DepartmentList';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import { notify } from 'reapop';
import OutcomeBar from '../../../components/common/OutcomeBar';

const { $ } = window;
const api_url = '/api/orgdepartment/findAll';
const defaultCountry = { name: 'United States', countryId: 234 };
const defaultRegion = { name: 'New Jersey', regionId: 4134 };
const maxSizeAllowedForFiles = 1e7; // Equals to 10MB -> 10 000 000 bytes
momentLocaliser(moment);

class CreateEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 0,
      activePage: 3,
      getCountryList: false,
      prevCountry: '',
      countryList: [],
      regionList: [],
      orgDepartmentList: [],
      officeList: [],
      steps: [{ title: '' }, { title: '' }, { title: '' }, { title: '' }],
      genders: [],
      mounted: false,
      drugTest: [],
      backgroundTest: [],
      maritalStatus: [],
      modal: '',
      paginatedTable: '',
      btn: '',
      showModal: false,
      formData: {},
      announcementBar: '',
      validateMsg: '',
      chkResult: [[], [], [], []],
      errorPanel: [{}, {}, {}, {}],
      tabRequiredFields: [
        ['office', 'department', 'ssn', 'employeeid', 'hireDate_', 'firstName', 'lastName', 'birthday_', 'gender'],
        ['phone', 'country', 'address', 'city', 'state', 'zip'],
        [],
        ['drugTestDate', 'backgroundTestDate', 'joblocation', 'maritalstatusDropdown', 'numberofallowances']
      ],
      agency: JSON.parse(sessionStorage.getItem('agency'))
    };
    this.resumeLabel = React.createRef();
    this.documentLabel = React.createRef();
    this.resumeFileInput = React.createRef();
    this.documentFileInput = React.createRef();

    this.departmentInput = React.createRef();
    this.tbodyRef = React.createRef();

    this.addTranslationsForActiveLanguage();
  }

  componentDidMount = async () => {
    const { orgId } = this.state.agency.organizationEntity;
    await this.props.getList('/api/country/listAll', types.GET_COUNTRY_REGION_LIST);
    await this.props.getListSafe('/api/orgdepartment/findAll', { orgId, filterBy: {} }, types.GET_ORG_DEPARTMENT_LIST);
    await this.props.getListSafe('/api/office/findAll', { orgId }, types.GET_OFFICE_LIST);
    let parent = $(ReactDOM.findDOMNode(this.refs.createNewEmployee1));
    parent.closest('.tabs-stepper-wrapper').css('max-width', '1600px');
    await this.props.getListSafe('/api/person/skillList', { orgId }, types.SKILLS_LIST);
    this.initialStates();
  };

  initialStates = async () => {
    this.setState(() => ({
      announcementBar: ''
    }));
    let gendersTranslate = [];
    let drugTest = [];
    let backgroundTest = [];
    let maritalStatus = [];
    let todaysDate = new Date();
    let backDate = todaysDate.setFullYear(todaysDate.getFullYear() - 18);
    let defaultDate = new Date(backDate);
    this.props.dispatch(change('NewEmployee', 'birthday_', defaultDate));
    gendersTranslate.push({ value: 0, gender: await this.props.translate("com.tempedge.msg.label.gender.male") });
    gendersTranslate.push({ value: 1, gender: await this.props.translate("com.tempedge.msg.label.gender.female") });
    await drugTest.push({ value: 0, drugTest: $(ReactDOM.findDOMNode(this.refs.drugtestAffirmativeOption)).text() });
    await drugTest.push({ value: 1, drugTest: $(ReactDOM.findDOMNode(this.refs.drugtestNegativeOption)).text() });
    await backgroundTest.push({ value: 0, backgroundTest: $(ReactDOM.findDOMNode(this.refs.backgroundtestAffirmativeOption)).text() });
    await backgroundTest.push({ value: 1, backgroundTest: $(ReactDOM.findDOMNode(this.refs.backgroundtestNegativeOption)).text() });
    await maritalStatus.push({ value: 0, maritalStatus: $(ReactDOM.findDOMNode(this.refs.maritalstatusAffirmativeOption)).text() });
    await maritalStatus.push({ value: 1, maritalStatus: $(ReactDOM.findDOMNode(this.refs.maritalstatusNegativeOption)).text() });

    this.setState(() => ({
      mounted: true,
      genders: gendersTranslate,
      drugTest: drugTest,
      backgroundTest: backgroundTest,
      maritalStatus: maritalStatus
    }));
  }

  componentWillUnmount = () => {
    const { reset, clearErrorField, clearTempedgeStoreProp } = this.props;
    reset();
    clearErrorField();
    clearTempedgeStoreProp('savePerson');
    clearTempedgeStoreProp('orgDepartmentList');
    clearTempedgeStoreProp('officeList');
    clearTempedgeStoreProp('skillList');
    clearTempedgeStoreProp('validatePerson');
    this.resetFileFields();
  };

  createDepartmentsTable() {
    const departmentsTable = <DepartmentList onClickRows={(e) => this.setInputValue(e)} />; // If you want to select multiple rows add 'multipleRows' property
    this.setState({
      departmentsTable
    });
  }

  setInputValue(selectedData) {
    const [orgDepartmentId, departmentSelected] = selectedData[0];
    this.props.dispatch(change('NewEmployee', 'department', departmentSelected));
    this.setState({
      orgDepartmentId
    });
    this.toggleModalOnOff();
  }

  componentDidUpdate = async (prevProps) => {
    const { getCountryList } = this.state;
    const { countryRegionList } = this.props;
    let chkResult = [...this.state.chkResult];
    let errorPanel = [...this.state.errorPanel];
    if (getCountryList === false) {
      if (typeof countryRegionList !== 'undefined') {
        this.setState(() => ({
          getCountryList: true
        }));
        this.setCountryList(defaultCountry, defaultRegion);
      }
    }

    if (this.state.orgDepartmentList.length === 0 && Array.isArray(this.props.orgDepartmentList)) {
      if (this.props.orgDepartmentList.length > 0) {
        this.setState(() => ({
          orgDepartmentList: this.props.orgDepartmentList
        }));
      }
    }

    if (this.state.officeList.length === 0 && Array.isArray(this.props.officeList)) {
      if (this.props.officeList.length > 0) {
        this.setState(() => ({
          officeList: this.props.officeList
        }));
      }
    }

    let hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/employee/new/${this.props.activeLanguage.code}`);
      this.addTranslationsForActiveLanguage();
    }

    if (errorPanel[2]) {
      if (errorPanel[2].border) {
        if (!this.props.skillErr) {
          chkResult[2] = [];
          errorPanel[2] = chkResult[2].length > 0 ? { border: '2px solid red' } : {};
          this.setState(() => ({
            chkResult: chkResult,
            errorPanel: errorPanel
          }));
        }
      }
    }

    // Date formated
    if (this.props.birthday && this.props.birthday != null) {
      if (String(this.props.birthday).match(/\//ig) && String(this.props.birthday).indexOf('/')) {
        let spl = String(this.props.birthday).split('/');
        if (spl[2]) {
          let todaysDate = new Date();
          if (spl[2] < todaysDate.getFullYear() - 18 || spl[2] > todaysDate.getFullYear() - 100) {
            let backDate = todaysDate.setFullYear(todaysDate.getFullYear() - 18);
            let defaultDate = new Date(backDate);
            this.props.dispatch(change('NewEmployee', 'birthday_', defaultDate));
          }
        }
      }
    } else {
      if (typeof this.props.birthday === 'undefined') {
        let todaysDate = new Date();
        let backDate = todaysDate.setFullYear(todaysDate.getFullYear() - 18);
        let defaultDate = new Date(backDate);
        this.props.dispatch(change('NewEmployee', 'birthday_', defaultDate));
      }
    }
  }

  onChangeCountry(country) {
    const { countryRegionList } = this.props;
    const { prevCountry } = this.state;

    if (typeof country.name !== 'undefined') {
      if (prevCountry !== country.name) {
        if (typeof countryRegionList !== 'undefined' && countryRegionList.length > 0) {
          this.setCountryList(country);
        }
      }
    }
  }

  async setCountryList(countrySelected, regionSelected) {
    const country = countrySelected || { name: '', countryId: '' };
    const region = regionSelected || { name: '', regionId: '' };
    const { countryRegionList, dispatch } = this.props;

    if (typeof countryRegionList !== 'undefined') {
      const countryList = CountryRegionParser.getCountryList(countryRegionList).country_list;
      const regionList = await CountryRegionParser.getRegionList(countryRegionList, country.name);
      dispatch(change('NewEmployee', 'country', country));
      dispatch(change('NewEmployee', 'state', region));
      dispatch(change('NewEmployee', 'joblocation', ''));
      this.setState(() => ({
        countryList,
        regionList,
        prevCountry: country.name
      }));
    }
  }

  componentWillReceiveProps = async (nextProps) => {
    if (typeof nextProps.errorFields !== 'undefined') {
      let chkResult = [...this.state.chkResult];
      let errorPanel = [...this.state.errorPanel];

      this.state.tabRequiredFields[0].map((field) => {
        let found = nextProps.errorFields.indexOf(field);

        if (found > -1 && this.state.chkResult[0].indexOf(field) === -1) {
          chkResult[0].push(field);
        } else if (field === nextProps.lastRemoved) {
          let idx = chkResult[0].indexOf(field);
          chkResult[0].splice(idx, 1);
          errorPanel[0] = {};
        }
      });

      this.state.tabRequiredFields[1].map((field) => {
        let found = nextProps.errorFields.indexOf(field);

        if (found > -1 && this.state.chkResult[1].indexOf(field) === -1) {
          chkResult[1].push(field);
        } else if (field === nextProps.lastRemoved) {
          let idx = chkResult[1].indexOf(field);
          chkResult[1].splice(idx, 1);
          errorPanel[1] = {};
        }
      });

      this.state.tabRequiredFields[3].map((field) => {
        let found = nextProps.errorFields.indexOf(field);

        if (found > -1 && this.state.chkResult[3].indexOf(field) === -1) {
          chkResult[3].push(field);
        } else if (field === nextProps.lastRemoved) {
          let idx = chkResult[3].indexOf(field);
          chkResult[3].splice(idx, 1);
          errorPanel[3] = {};
        }
      });

      errorPanel[0] = chkResult[0].length > 0 ? { border: '2px solid red', borderTopLeftRadius: '1.6rem' } : {};
      errorPanel[1] = chkResult[1].length > 0 ? { border: '2px solid red' } : {};
      errorPanel[3] = chkResult[3].length > 0 ? { border: '2px solid red', borderTopRightRadius: '1.6rem' } : {};

      this.setState(() => ({
        chkResult: chkResult,
        errorPanel: errorPanel
      }));
    }

    if (nextProps.savePerson !== null) {
      if (nextProps.savePerson.data.status === 200) {
        this.setState(
          () => ({
            announcementBar: (
              <div className="announcement-bar success">
                <p>
                  <Translate id="com.tempedge.msg.person.newperson" />
                </p>
              </div>
            )
          }),
          () => this.componentWillUnmount()
        );

        this.props.clearTempedgeStoreProp('savePerson'); // I added this to avoid a loop
      } else {
        //Validation Failed
        this.setState(() => ({
          announcementBar: (
            <div className="announcement-bar fail">
              <p>
                <Translate id={this.state.validateMsg || nextProps.savePerson.data.message} />
              </p>
            </div>
          )
        }));

        this.props.clearTempedgeStoreProp('savePerson'); // I added this to avoid a loop
      }
    }

    if (nextProps.validatePerson !== null && nextProps.validatePerson.data) {
      if (nextProps.validatePerson.data.status === 409) {
        if (nextProps.validatePerson.data.code === 'TE-E07') {
          //Validation Found multiple records with similar fields
          if (nextProps.validatePerson.data.result !== null) {
            let save = () => {
              this.props.tempedgeMultiPartApi('/api/person/save', this.state.formData, this.state.fileArray, types.PERSON_SAVE);
              this.props.clearTempedgeStoreProp('validatePerson');

              this.setState(
                () => ({
                  validateMsg: nextProps.validatePerson.data.message
                }),
                () => {
                  this.toggleModalOnOff();
                }
              );
            };

            //Other people with the same name exist in the db, display popup with their list.
            let paginatedTable = (
              <div style={{ maxHeight: 500, overflowY: 'scroll' }}>
                <PaginatedTable payload={nextProps.validatePerson.data.result} title="com.tempedge.msg.label.validatedpersonlist" />
              </div>
            );
            let btns = (
              <div className="prev-next-btns-agency row" style={{ width: '-webkit-fill-available' }}>
                <div className="col-md-5 offset-md-1">
                  <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={() => this.cancel()}>
                    <Translate id="com.tempedge.msg.label.cancel" />
                  </button>
                </div>
                <div className="col-md-5">
                  <button type="submit" className="btn btn-primary btn-block register-save-btn next" onClick={() => save()}>
                    <Translate id="com.tempedge.msg.label.save" />
                  </button>
                </div>
              </div>
            );

            this.setState(
              () => ({
                showModal: !this.state.showModal
              }),
              () => {
                this.setState(() => ({
                  modal: <Modal content={paginatedTable} buttons={btns} open={this.state.showModal} />
                }));
              }
            );

            this.setState(() => ({
              paginatedTable: paginatedTable,
              btns: btns
            }));
          } else {
            //Validation Failed
            this.setState(() => ({
              announcementBar: (
                <div className="announcement-bar fail">
                  <p>
                    <Translate id={nextProps.validatePerson.data.message} />
                  </p>
                </div>
              )
            }));
          }
        } else {
          //Validation Failed
          this.setState(() => ({
            announcementBar: (
              <div className="announcement-bar fail">
                <p>
                  <Translate id={nextProps.validatePerson.data.message} />
                </p>
              </div>
            )
          }));
        }
      } else if (nextProps.validatePerson.data.status === 500) {
        if (nextProps.validatePerson.data.code === 'TE-E00') {
          this.setState(() => ({
            announcementBar: (
              <div className="announcement-bar fail">
                <p>
                  <Translate id={nextProps.validatePerson.data.message} />
                </p>
              </div>
            )
          }));
        }
      } else if (nextProps.validatePerson.data.status === 200) {
        if (nextProps.validatePerson.data.code === 'TE00') {
          if (nextProps.validatePerson.data.result === null) {
            // null means the person doesn't exist in the db, no other people with the same name exist
            // Create New Person
            this.onSave();
          }
        }
      }
    }
  };

  checkSkillsErr = () => {
    // Error panel skills

    let chkResult = [...this.state.chkResult];
    let errorPanel = [...this.state.errorPanel];

    if (this.props.skillErr) {
      chkResult[2].push({});
    } else {
      chkResult[2] = [];
    }

    errorPanel[2] = chkResult[2].length > 0 ? { border: '2px solid red' } : {};

    this.setState(() => ({
      chkResult: chkResult,
      errorPanel: errorPanel
    }));
  }

  addTranslationsForActiveLanguage = async () => {
    await ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);

    let gendersTranslate = [];
    let drugTest = [];
    let backgroundTest = [];
    let maritalStatus = [];

    gendersTranslate.push({ value: 0, gender: await this.props.translate("com.tempedge.msg.label.gender.male") });
    gendersTranslate.push({ value: 1, gender: await this.props.translate("com.tempedge.msg.label.gender.female") });

    await drugTest.push($(ReactDOM.findDOMNode(this.refs.drugtestAffirmativeOption)).text());
    await drugTest.push($(ReactDOM.findDOMNode(this.refs.drugtestNegativeOption)).text());

    await backgroundTest.push($(ReactDOM.findDOMNode(this.refs.backgroundtestAffirmativeOption)).text());
    await backgroundTest.push($(ReactDOM.findDOMNode(this.refs.backgroundtestNegativeOption)).text());

    await maritalStatus.push($(ReactDOM.findDOMNode(this.refs.maritalstatusAffirmativeOption)).text());
    await maritalStatus.push($(ReactDOM.findDOMNode(this.refs.maritalstatusNegativeOption)).text());

    if (this.state.mounted && gendersTranslate.length !== 0) {
      await this.setState(() => ({
        genders: gendersTranslate,
        drugTest: drugTest,
        backgroundTest: backgroundTest,
        maritalStatus: maritalStatus
      }));
    }
  };

  static setFileLabel(file, labelRef) {
    const fileName = file ? file.name.replace(/\\|\//g, '') : '';
    labelRef.current.textContent = fileName;
  }

  resetFileFields() {
    this.documentFileInput.current.value = '';
    this.resumeFileInput.current.value = '';
    this.documentLabel.current.textContent = '';
    this.resumeLabel.current.textContent = '';
  }

  onChangeFile = (e, labelRef) => {
    const [file] = e.target.files;
    const inputName = e.target.getAttribute('name');
    this.setState(() => ({
      announcementBar: ''
    }));
    this.constructor.setFileLabel(null, labelRef);

    if (file) {
      if (file.size <= maxSizeAllowedForFiles) {
        if (inputName === 'documentFile') {
          if (file.type !== 'application/pdf') {
            this.setState(() => ({
              announcementBar: <OutcomeBar classApplied="announcement-bar warning" translateId="com.tempedge.warning.pdfInvalidFileType" />
            }));
            e.target.value = '';
          } else {
            this.constructor.setFileLabel(file, labelRef);
          }
        } else if (
          file.type !== 'application/pdf' &&
          file.type !== 'application/msword' &&
          file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
          inputName === 'resumeFile'
        ) {
          this.setState(() => ({
            announcementBar: <OutcomeBar classApplied="announcement-bar warning" translateId="com.tempedge.warning.invalidFileType" />
          }));
          e.target.value = '';
        } else {
          this.constructor.setFileLabel(file, labelRef);
        }
      } else {
        e.target.value = '';
        this.setState(() => ({
          announcementBar: (
            <OutcomeBar
              classApplied="announcement-bar warning"
              translateId="com.tempedge.warning.maxSizeAllowedForFiles"
              customData={{ maxSizeAllowedForFiles: maxSizeAllowedForFiles / 1000000 }}
            />
          )
        }));
      }
    }
  };

  onSubmit = async (formValues) => {
    let skills = [];
    let counter = 0;
    let fomrValueLen = Object.keys(formValues).length;
    const documentFile = this.documentFileInput.current.files[0];
    const resumeFile = this.resumeFileInput.current.files[0];

    return new Promise((resolve, reject) => {
      for (let prop in formValues) {
        let id = null;

        if (prop.indexOf('data-skill-id-') > -1) {
          id = prop.match(/(\d+)/);
          skills.push({
            skillId: parseInt(id[0])
          });
        }

        if (counter === fomrValueLen - 1) {
          resolve(skills);
        }

        counter++;
      }
    }).then((skills) => {
      let data = {
        temporalInfo: formValues.temporarydata ? true : false,
        skills: skills,
        orgId: this.state.agency.organizationEntity.orgId,
        address: formValues.address.toUpperCase(),
        address2: typeof formValues.address2_ !== 'undefined' ? formValues.address2_.toUpperCase() : '',
        backgroundTestDate: formValues.backgroundTest ? (formValues.backgroundTest.backgroundTest === 'Yes' ? moment(formValues.backgroundTestDate, 'YYYY-MM-DD') : null) : null,
        backgroundtest: formValues.backgroundTest ? (formValues.backgroundTest.backgroundTest === 'Yes' ? true : false) : null,
        birthDay: moment(formValues.birthday_, 'YYYY-MM-DD'),
        cellPhone: formValues.phone,
        city: formValues.city.toUpperCase(),
        country: formValues.country.countryId,
        drugTest: formValues.drugTest && formValues.drugTest.drugTest === 'Yes' ? true : false,
        drugTestDate: moment(formValues.drugTestDate, 'YYYY-MM-DD'),
        email: formValues.email_,
        empDepartment: this.state.orgDepartmentId || formValues.department,
        employeeId: formValues.employeeid,
        firstName: formValues.firstName.toUpperCase(),
        gender: formValues.gender.gender === 'Male' ? 'M' : 'F',
        hireDate: moment(formValues.hireDate_, 'YYYY-MM-DD'),
        identification: formValues.ssn,

        lastName: formValues.lastName.toUpperCase(),
        maritalStatus: formValues.maritalstatusDropdown ? 0 : 1,
        middleName: formValues.middleName_ ? formValues.middleName_.toUpperCase() : '',
        phone: formValues.phone,
        region: formValues.state.regionId,
        taxRegion: formValues.joblocation.regionId,
        usrCreatedBy: this.state.agency.portalUserConfId,
        zipcode: formValues.zip,
        docExt: null,
        resumeExt: null,
        personType: {
          personTypeId: 1 // ** TODO **
        },
        office: {
          officeId: formValues.office.officeId
        }
      };

      const fileArray = {};
      if (documentFile) {
        fileArray.documents = documentFile;
        data.docExt = documentFile.name.split('.').pop();
      }

      if (resumeFile) {
        fileArray.resume = resumeFile;
        data.resumeExt = resumeFile.name.split('.').pop();
      }

      this.setState(
        () => ({
          formData: { ...data },
          fileArray,
          key: 0
        }),
        () => {
          this.props.tempedgeAPI('/api/person/validate', data, types.VALIDATE_PERSON);
        }
      );
      // debugger;
    });
  };

  convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      // Select the very first file from list
      let fileToLoad = file;
      // FileReader function for read the file.
      let fileReader = new FileReader();
      let base64;

      // Convert data to base64
      fileReader.readAsDataURL(fileToLoad);

      // Onload of file read the file content
      fileReader.onload = function (fileLoadedEvent) {
        base64 = fileLoadedEvent.target.result;
        base64 = base64.replace('data:application/pdf;base64,', '');

        // return base 64 data
        resolve(base64);
      };
    });
  };

  onSave = () => {
    this.props.tempedgeMultiPartApi('/api/person/save', this.state.formData, this.state.fileArray, types.PERSON_SAVE);
    this.props.clearTempedgeStoreProp('validatePerson');
  };

  //Set Modal visible or not
  toggleModalOnOff = () => {
    this.setState({
      showModal: !this.state.showModal,
      modal: ''
    });
  };

  //Close Modal
  cancel = (value) => {
    if (value) this.toggleModalOnOff(); //Close Modal
    
    // document.getElementsByClassName('aTab1').click();
    console.log(this.props.history.location.pathname);
    // this.props.push(`/employee/new/${this.props.activeLanguage.code}#tab1`);

    this.setState({ key: 0 });
    this.props.reset();
    this.initialStates();
  };

  openModal() {
    this.createDepartmentsTable();
    this.toggleModalOnOff(); // Open or close Modal
  }

  render() {
    const { translate } = this.props;
    let key = this.state.key;
    let sortedSkillList = undefined;
    let birthDay = this.props.birthday !== null ? moment().diff(this.props.birthday, 'years', false) : '';
    let modal = <ModalSimple content={this.state.departmentsTable} open={this.state.showModal} onClose={() => this.cancel(true)} modalSize="modal-sm" />;
    if (typeof this.props.skillsList !== 'undefined' && Array.isArray(this.props.skillsList)) {
      sortedSkillList = this.props.skillsList.sort((a, b) => {
        let x = a.skill;
        let y = b.skill;

        return x < y ? -1 : x > y ? 1 : 0;
      });
    }

    let drugTestDate = (
      <div style={{ width: '80%', margin: 'auto' }}>
        <label className="control-label" style={{ marginBottom: 5 }}>
          <Translate id="com.tempedge.msg.label.date" />
        </label>
        <Field name="drugTestDate" type="text" placeholder="Drug Test Date" category="person" customClass="form-control tempEdge-input-box" component={Datepicker} />
      </div>
    );

    let backgroundTestDate = (
      <div style={{ width: '80%', margin: 'auto' }}>
        <label className="control-label" style={{ marginBottom: 5 }}>
          <Translate id="com.tempedge.msg.label.date" />
        </label>
        <Field name="backgroundTestDate" type="text" placeholder="Background Test Date" category="person" customClass="form-control tempEdge-input-box" component={Datepicker} />
      </div>
    );

    return (
      <div style={{ marginBottom: 20 }}>
        <Stepper
          steps={this.state.steps}
          activeStep={key}
          activeColor="#eb8d34"
          completeColor="#8cb544"
          defaultBarColor="#eb8d34"
          completeBarColor="#8cb544"
          barStyle="solid"
          circleFontSize={16}
        />
        <div
          style={{
            padding: '3rem',
            width: '90%',
            border: 'dotted 1px #888888',
            borderTopLeftRadius: '1.6rem',
            borderTopRightRadius: '1.6rem',
            borderBottomLeftRadius: '1.6rem',
            borderBottomRightRadius: '1.6rem',
            backgroundColor: '#ffff',
            margin: 'auto'
          }}>
          {this.state.announcementBar}
          <div className="tabs-stepper-wrapper register-form-panel-inputs" ref="createNewEmployee1" style={{ margin: 'auto', padding: 0 }}>
            <div className="formPanel" style={{ padding: 0, margin: 0 }}>
              <Form className="panel-body form-horizontal center-block" onSubmit={this.props.handleSubmit(this.onSubmit)}>
                <ul className="nav nav-panel">
                  <li className="nav-item first-panel " onClick={() => this.setState({ key: 0 })}>
                    {/* <a className="nav-link active" style={this.state.errorPanel[0]} data-toggle="tab" href="#tab1"> */}
                    <a className={(this.state.key === 0) ? "nav-link active" : "nav-link"} style={this.state.errorPanel[0]} data-toggle="tab" href="#tab1">
                      Info
                    </a>
                  </li>
                  <li className="nav-item panel" onClick={() => this.setState({ key: 1 })}>
                    {/* <a className="nav-link" style={this.state.errorPanel[1]} data-toggle="tab" href="#tab2"> */}
                    <a className={(this.state.key === 1) ? "nav-link active" : "nav-link"} style={this.state.errorPanel[1]} data-toggle="tab" href="#tab2">
                      Contact
                    </a>
                  </li>
                  <li className="nav-item panel" onClick={() => this.setState({ key: 2 })}>
                    {/* <a className="nav-link" style={this.state.errorPanel[2]} data-toggle="tab" href="#tab4"> */}
                    <a className={(this.state.key === 2) ? "nav-link active" : "nav-link"} style={this.state.errorPanel[2]} data-toggle="tab" href="#tab4">
                      Skills
                    </a>
                  </li>
                  <li className="nav-item last-panel" onClick={() => this.setState({ key: 3 })}>
                    {/* <a className="nav-link" style={this.state.errorPanel[3]} data-toggle="tab" href="#tab6"> */}
                    <a className={(this.state.key === 3) ? "nav-link active" : "nav-link"} style={this.state.errorPanel[3]} data-toggle="tab" href="#tab6">
                      Misc
                    </a>
                  </li>
                </ul>

                <div className="tab-content formPanelBody" style={{ background: '#ffff' }}>
                  {/* <div className="tab-pane fade show active" id="tab1" role="tabpanel"> */}
                  <div className={(this.state.key === 0) ? "tab-pane fade show active" : "tab-pane fade"} id="tab1" role="tabpanel">
                    <div className="form-group row">
                      <div className="col-3 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.tempdata" />
                        </label>
                        <Field name="temporarydata" category="person" checked component={ToggleSwitch} />
                      </div>
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.office" />
                        </label>
                        <Field name="office" data={this.state.officeList} valueField="officeId" textField="name" category="person" component={DropdownList} />
                      </div>
                      <div className="form-group col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.department" />
                        </label>
                        <div className="input-group">
                          <Field
                            name="department"
                            placeholder={translate('com.tempedge.msg.label.department')}
                            category="person"
                            component={InputBox}
                            customClass="square-right-side"
                            ref={this.departmentInput}
                            active="disabled"
                          />
                          <div className="input-group-append">
                            <button className="btn btn-green" title={translate('com.tempedge.msg.label.viewdepartmentlist')} type="button" onClick={() => this.openModal()}>
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.ssnonly" />
                        </label>
                        <Field name="ssn" type="text" placeholder="SSN" category="person" component={InputBox} normalize={normalizeSSN} />
                      </div>
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.employeeid" />
                        </label>
                        <Field name="employeeid" type="text" placeholder="Employee ID" category="person" component={InputBox} />
                      </div>
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.hiredate" />
                        </label>
                        <Field name="hireDate_" type="text" placeholder="Hire Date" category="person" customClass="form-control tempEdge-input-box" component={Datepicker} />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.firstname" />
                        </label>
                        <Field name="firstName" type="text" placeholder="First Name" category="person" pattern="[a-zA-Z]*" component={InputBox} />
                      </div>
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.middlename"></Translate>
                        </label>
                        <Field name="middleName_" type="text" placeholder="Middle Name" category="person" pattern="[a-zA-Z]*" component={InputBox} />
                      </div>
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.lastname"></Translate>
                        </label>
                        <Field name="lastName" type="text" placeholder="Last Name" category="person" pattern="[a-zA-Z]*" component={InputBox} />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.birthday" />
                        </label>
                        <Field name="birthday_" type="text" category="person" customClass="form-control tempEdge-input-box" component={Datepicker} />
                      </div>
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">Age</label>
                        <label className="control-label">{birthDay}</label>
                      </div>
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.gender" />
                        </label>
                        <Field id="genderDropdown" name="gender" data={this.state.genders} valueField="value" textField="gender" category="person" component={DropdownList} />
                      </div>
                    </div>
                  </div>
                  {/* <div className="tab-pane fade" id="tab2" role="tabpanel"> */}
                  <div className={(this.state.key === 1) ? "tab-pane fade show active" : "tab-pane fade"} id="tab2" role="tabpanel">
                    <div className="form-group row">
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.phone" />
                        </label>
                        <Field name="phone" type="text" placeholder="Phone" category="person" component={InputBox} normalize={normalizePhone} />
                      </div>
                      <div className="col-10 col-md-8">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.email" />
                        </label>
                        <Field name="email_" type="text" placeholder="Email" category="person" component={InputBox} />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.country" />
                        </label>
                        <Field
                          name="country"
                          data={this.state.countryList}
                          onChange={(e) => this.onChangeCountry(e)}
                          valueField="countryId"
                          textField="name"
                          category="agency"
                          component={DropdownList}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-10 col-md-8">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.address" />
                        </label>
                        <Field name="address" type="text" placeholder="Address" category="person" component={InputBox} />
                      </div>
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.agencyaddress2" />
                        </label>
                        <Field name="address2_" type="text" placeholder="Address 2" category="person" component={InputBox} />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.city" />
                        </label>
                        <Field name="city" type="text" placeholder="City" category="person" component={InputBox} />
                      </div>
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.state" />
                        </label>
                        <Field name="state" data={this.state.regionList} valueField="regionId" textField="name" category="person" component={DropdownList} />
                      </div>
                      <div className="col10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.agencyzipcode" />
                        </label>
                        <Field name="zip" type="text" placeholder="Zip Code" category="person" component={InputBox} />
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="tab3" role="tabpanel">
                    tab 3 content...
                  </div>
                  {/* <div className="tab-pane fade" id="tab4" role="tabpanel"> */}
                  <div className={(this.state.key === 2) ? "tab-pane fade show active" : "tab-pane fade"} id="tab4" role="tabpanel">
                    <div className="row">
                      <div className="col-md-6">
                        {typeof sortedSkillList !== 'undefined'
                          ? sortedSkillList.map((item, index) => {
                            let listLen = this.props.skillsList.length;
                            if (index < (listLen - 1) / 2) {
                              return (
                                <div style={{ width: '60%', margin: 'auto', marginBottom: 5 }} key={index}>
                                  <Field name={`data-skill-id-${item.skillId}`} data-skill-id={item.skillId} component="input" type="checkbox" />
                                  <span style={{ paddingLeft: 10 }}>{item.skill}</span>
                                </div>
                              );
                            }
                          })
                          : ''}
                      </div>
                      <div className="col-md-6">
                        {typeof sortedSkillList !== 'undefined'
                          ? sortedSkillList.map((item, index) => {
                            let listLen = this.props.skillsList.length;
                            if (index > (listLen - 1) / 2) {
                              return (
                                <div style={{ width: '60%', margin: 'auto', marginBottom: 5 }} key={index}>
                                  <Field name={`data-skill-id-${item.skillId}`} data-skill-id={item.skillId} component="input" type="checkbox" />
                                  <span style={{ paddingLeft: 10 }}>{item.skill}</span>
                                </div>
                              );
                            }
                          })
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="tab5" role="tabpanel">
                    tab 3 content...
                  </div>
                  {/* <div className="tab-pane fade" id="tab6" role="tabpanel"> */}
                  <div className={(this.state.key === 3) ? "tab-pane fade show active" : "tab-pane fade"} id="tab6" role="tabpanel">
                    <div className="row">
                      <div className="col-md-4" style={{ borderRight: '1px solid #d7d7d7' }}>
                        <div style={{ width: '60%', margin: 'auto', marginBottom: 10 }}>
                          <label className="control-label" style={{ marginBottom: 5 }}>
                            <Translate id="com.tempedge.msg.label.joblocation" />
                          </label>
                          <Field name="joblocation" data={this.state.regionList} valueField="regionId" textField="name" category="person" component={DropdownList} />
                        </div>

                        <div style={{ width: '60%', margin: 'auto', marginBottom: 10 }}>
                          <label className="control-label" style={{ marginBottom: 5 }}>
                            <Translate id="com.tempedge.msg.label.maritalstatus" />
                          </label>
                          <span style={{ display: 'none' }} ref="maritalstatusAffirmativeOption">
                            <Translate id="com.tempedge.msg.label.single" />
                          </span>
                          <span style={{ display: 'none' }} ref="maritalstatusNegativeOption">
                            <Translate id="com.tempedge.msg.label.married" />
                          </span>
                          <Field
                            name="maritalstatusDropdown"
                            data={this.state.maritalStatus}
                            valueField="value"
                            textField="maritalStatus"
                            category="person"
                            component={DropdownList}
                          />
                        </div>

                        <div style={{ width: '60%', margin: 'auto' }}>
                          <label className="control-label" style={{ marginBottom: 5 }}>
                            <Translate id="com.tempedge.msg.label.numberofallowances" />
                          </label>
                          <Field name="numberofallowances" type="text" placeholder="Number of allowances" category="person" component={InputBox} />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="row">
                          <div className="col-md-6">
                            <div style={{ width: '80%', margin: 'auto', marginBottom: 10 }}>
                              <label className="control-label" style={{ marginBottom: 5 }}>
                                <Translate id="com.tempedge.msg.label.drugtest" />
                              </label>
                              <span style={{ display: 'none' }} ref="drugtestAffirmativeOption">
                                <Translate id="com.tempedge.msg.label.affirmative" />
                              </span>
                              <span style={{ display: 'none' }} ref="drugtestNegativeOption">
                                <Translate id="com.tempedge.msg.label.negative" />
                              </span>
                              <Field name="drugTest" data={this.state.drugTest} valueField="value" textField="drugTest" category="person" component={DropdownList} />
                            </div>
                            {this.props.drugTest && typeof this.props.drugTest.drugTest === 'string' ? (
                              this.props.drugTest.drugTest === 'Yes' || this.props.drugTest.drugTest === 'Si' ? (
                                drugTestDate
                              ) : (
                                <div style={{ height: 77 }}></div>
                              )
                            ) : (
                              <div style={{ height: 77 }}></div>
                            )}
                          </div>

                          <div className="col-md-6">
                            <div style={{ width: '80%', margin: 'auto', marginBottom: 10 }}>
                              <label className="control-label" style={{ marginBottom: 5 }}>
                                <Translate id="com.tempedge.msg.label.backgroundtest" />
                              </label>
                              <span style={{ display: 'none' }} ref="backgroundtestAffirmativeOption">
                                <Translate id="com.tempedge.msg.label.affirmative" />
                              </span>
                              <span style={{ display: 'none' }} ref="backgroundtestNegativeOption">
                                <Translate id="com.tempedge.msg.label.negative" />
                              </span>
                              <Field
                                name="backgroundTest"
                                data={this.state.backgroundTest}
                                valueField="value"
                                textField="backgroundTest"
                                category="person"
                                component={DropdownList}
                              />
                            </div>
                            {this.props.backgroundTest && typeof this.props.backgroundTest.backgroundTest === 'string' ? (
                              this.props.backgroundTest.backgroundTest === 'Yes' || this.props.backgroundTest.backgroundTest === 'Si' ? (
                                backgroundTestDate
                              ) : (
                                <div style={{ height: 77 }}></div>
                              )
                            ) : (
                              <div style={{ height: 77 }}></div>
                            )}
                          </div>
                        </div>
                        <hr style={{ margin: '40px 0 25px 0' }} />
                        <div className="row" style={{ marginTop: 20 }}>
                          <div className="col-md-6">
                            <label className="control-label" style={{ width: 'fit-content', margin: 'auto', marginBottom: 10 }}>
                              <Translate id="com.tempedge.msg.label.documents" />
                            </label>
                            <div style={{ width: '80%', margin: 'auto' }}>
                              <div className="input-group">
                                <label className="input-group-btn" style={{ width: '100%', textAlign: 'center' }}>
                                  <span className="btn department-list-button">
                                    <Translate id="com.tempedge.msg.label.choosefile" />
                                    <input
                                      ref={this.documentFileInput}
                                      type="file"
                                      name="documentFile"
                                      onChange={(e) => this.onChangeFile(e, this.documentLabel)}
                                      style={{ display: 'none' }}
                                      accept=".pdf"
                                    />
                                  </span>
                                </label>
                                <br />
                                <p ref={this.documentLabel} style={{ margin: '20px auto 0 auto', background: '#ffff', border: 'none', textAlign: 'center' }}></p>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <label className="control-label" style={{ width: 'fit-content', margin: 'auto', marginBottom: 10 }}>
                              <Translate id="com.tempedge.msg.label.resume" />
                            </label>
                            <div style={{ width: '80%', margin: 'auto' }}>
                              <div className="input-group">
                                <label className="input-group-btn" style={{ width: '100%', textAlign: 'center' }}>
                                  <span className="btn department-list-button">
                                    <Translate id="com.tempedge.msg.label.choosefile" />
                                    <input
                                      ref={this.resumeFileInput}
                                      name="resumeFile"
                                      type="file"
                                      onChange={(e) => this.onChangeFile(e, this.resumeLabel)}
                                      style={{ display: 'none' }}
                                      accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf"
                                    />
                                  </span>
                                </label>
                                <br />
                                <p ref={this.resumeLabel} style={{ margin: '20px auto 0 auto', background: '#ffff', border: 'none', textAlign: 'center' }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ width: '100%', margin: '30px 0' }}></div>
                  <hr />
                  <div className="prev-next-btns-agency row" style={{ marginTop: 30 }}>
                    <div className="col-md-5 offset-md-1">
                      <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={() => this.cancel()}>
                        <Translate id="com.tempedge.msg.label.cancel" />
                      </button>
                    </div>
                    <div className="col-md-5">
                      <button type="submit" className="btn btn-primary btn-block register-save-btn next" onClick={() => this.checkSkillsErr()}>
                        <Translate id="com.tempedge.msg.label.save" />
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
        {this.state.modal}
        {modal}
      </div>
    );
  }
}

CreateEmployee.propTypes = {
  //Typechecking With PropTypes, will run on its own, no need to do anything else, separate library since React 16, wasn't the case before on 14 or 15
  //Action, does the Fetch part from the posts API
  tempedgeAPI: PropTypes.func.isRequired,
  tempedgeMultiPartApi: PropTypes.func.isRequired,
  getList: PropTypes.func.isRequired,
  getListSafe: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  clearTempedgeStoreProp: PropTypes.func.isRequired,
  clearErrorField: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  countryRegionList: PropTypes.array
};

CreateEmployee = reduxForm({
  form: 'NewEmployee', //                 <------ form name
  destroyOnUnmount: false, //        <------ preserve form data
  enableReinitialize: true,
  validate: Validate
})(CreateEmployee);

let mapStateToProps = (state) => {
  let selector = formValueSelector('NewEmployee'); // <-- same as form name
  return {
    skillsList: state.tempEdge.skillsList,
    countryRegionList: state.tempEdge.country_region_list,
    orgDepartmentList: state.tempEdge.orgDepartmentList && state.tempEdge.orgDepartmentList.data ? state.tempEdge.orgDepartmentList.data.content : [],
    officeList: typeof state.tempEdge.officeList !== 'undefined' ? state.tempEdge.officeList : [],
    country: selector(state, 'country'),
    backgroundTest: typeof state.form.NewEmployee !== 'undefined' && typeof state.form.NewEmployee.values !== 'undefined' ? state.form.NewEmployee.values.backgroundTest : null,
    drugTest: typeof state.form.NewEmployee !== 'undefined' && typeof state.form.NewEmployee.values !== 'undefined' ? state.form.NewEmployee.values.drugTest : null,
    birthday: typeof state.form.NewEmployee !== 'undefined' && typeof state.form.NewEmployee.values !== 'undefined' ? state.form.NewEmployee.values.birthday_ : null,
    hiredate: typeof state.form.NewEmployee !== 'undefined' && typeof state.form.NewEmployee.values !== 'undefined' ? state.form.NewEmployee.values.hireDate_ : null,
    validatePerson: typeof state.tempEdge.validatePerson !== 'undefined' ? state.tempEdge.validatePerson : null,
    skillErr: typeof state.form.NewEmployee !== 'undefined' && typeof state.form.NewEmployee.values !== 'undefined' ? state.form.NewEmployee.syncErrors ? state.form.NewEmployee.syncErrors.skills : null : null,
    savePerson: typeof state.tempEdge.savePerson !== 'undefined' ? state.tempEdge.savePerson : null,
    errorFields: state.tempEdge.errorFields,
    lastRemoved: state.tempEdge.lastRemoved
  };
};

export default withLocalize(
  connect(mapStateToProps, { push, change, initialize, getList, tempedgeAPI, tempedgeMultiPartApi, getListSafe, clearTempedgeStoreProp, clearErrorField, notify })(CreateEmployee)
);
