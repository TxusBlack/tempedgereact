import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import { Translate, withLocalize } from 'react-localize-redux';
import { Field, reduxForm, change, formValueSelector, reset, initialize } from 'redux-form';
import { date } from 'redux-form-validators';
import moment from 'moment';
import momentLocaliser from 'react-widgets-moment';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Stepper from 'react-stepper-horizontal';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import Dropdown from '../../../components/common/Dropdown/Dropdown.js';
import DateTime from '../../../components/common/DateTimePicker/DateTimePicker.js';
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

const $ = window.$;
const api_url = '/api/orgdepartment/findAll';

momentLocaliser(moment);

class CreateEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 3,
      prevCountry: '',
      country_list: [],
      regionsList: [],
      orgDepartmentList: [],
      officeList: [],
      steps: [{ title: '' }, { title: '' }, { title: '' }, { title: '' }],
      genders: [],
      mounted: false,
      getCountryList: false,
      countryListRendered: 0,
      drugTest: [],
      backgroundTest: [],
      documents: null,
      resume: null,
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
        ['temporarydata', 'office', 'department', 'ssn', 'employeeid', 'hireDate_', 'firstName', 'lastName', 'birthday_', 'gender'],
        ['phone', 'country', 'address', 'city', 'state', 'zip'],
        [],
        ['drugTestDate', 'backgroundTestDate', 'joblocation', 'maritalstatusDropdown', 'numberofallowances']
      ]
    };

    this.departmentInput = React.createRef();
    this.tbodyRef = React.createRef();

    this.addTranslationsForActiveLanguage();
  }

  componentDidMount = async () => {
    let gendersTranslate = [];
    let drugTest = [];
    let backgroundTest = [];
    let maritalStatus = [];

    await this.props.getList('/api/country/listAll', types.GET_COUNTRY_REGION_LIST);
    await this.props.getListSafe('/api/orgdepartment/findAll', { orgId: 1 }, types.GET_ORG_DEPARTMENT_LIST);
    await this.props.getListSafe('/api/office/findAll', { orgId: 1 }, types.GET_OFFICE_LIST);
    let parent = $(ReactDOM.findDOMNode(this.refs.createNewEmployee1));
    parent.closest('.tabs-stepper-wrapper').css('max-width', '1600px');

    await this.props.getListSafe('/api/person/skillList', { orgId: 1 }, types.SKILLS_LIST);

    let todaysDate = new Date();
    let backDate = todaysDate.setFullYear(todaysDate.getFullYear() - 18);
    let defaultDate = new Date(backDate);
    this.props.dispatch(change('NewEmployee', 'birthday_', defaultDate));

    await gendersTranslate.push($(ReactDOM.findDOMNode(this.refs.maleOption)).text());
    await gendersTranslate.push($(ReactDOM.findDOMNode(this.refs.femaleOption)).text());
    await drugTest.push($(ReactDOM.findDOMNode(this.refs.drugtestAffirmativeOption)).text());
    await drugTest.push($(ReactDOM.findDOMNode(this.refs.drugtestNegativeOption)).text());
    await backgroundTest.push($(ReactDOM.findDOMNode(this.refs.backgroundtestAffirmativeOption)).text());
    await backgroundTest.push($(ReactDOM.findDOMNode(this.refs.backgroundtestNegativeOption)).text());
    await maritalStatus.push($(ReactDOM.findDOMNode(this.refs.maritalstatusAffirmativeOption)).text());
    await maritalStatus.push($(ReactDOM.findDOMNode(this.refs.maritalstatusNegativeOption)).text());

    this.setState(() => ({
      mounted: true,
      genders: gendersTranslate,
      drugTest: drugTest,
      backgroundTest: backgroundTest,
      maritalStatus: maritalStatus
    }));
  };

  componentWillUnmount = () => {
    this.props.reset();
    this.props.clearErrorField();
    this.props.clearTempedgeStoreProp('savePerson');

    this.setState(() => ({
      announcementBar: ''
    }));
  };

  createDepartmentsTable() {
    const { orgDepartmentList, country_list } = this.state;
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

  componentDidUpdate = async (prevProps, prevState) => {
    if (this.state.getCountryList === false) {
      if (typeof this.props.country_region_list !== 'undefined') {
        this.setState(() => ({
          getCountryList: true
        }));
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
  };

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

    if (typeof nextProps.country_region_list !== 'undefined') {
      if (this.state.getCountryList) {
        let list = await CountryRegionParser.getCountryList(this.props.country_region_list).country_list;
        let regionsList = await CountryRegionParser.getRegionList(this.props.country_region_list, 'United States');
        let states = await regionsList.map((state, index) => {
          return state.name;
        });

        this.props.dispatch(change('NewEmployee', 'country', { name: 'United States', countryId: 234 }));
        this.props.dispatch(change('NewEmployee', 'state', { name: 'New Jersey', countryId: 4134 }));

        this.setState(
          () => ({
            countryListRendered: this.state.countryListRendered + 1,
            country_list: list,
            regionsList: states
          }),
          async () => {
            let regionsList = [];

            regionsList = await CountryRegionParser.getRegionList(this.props.country_region_list, typeof nextProps.country === 'undefined' ? 'United States' : nextProps.country.name);

            this.props.dispatch(change('NewEmployee', 'joblocationDropdown', ''));
            this.setState({
              countryListRendered: this.state.countryListRendered + 1,
              prevCountry: typeof nextProps.country === 'undefined' ? 'United States' : nextProps.country.name,
              region_list: regionsList
            });
          }
        );
      }
    }

    if (typeof nextProps.country !== 'undefined') {
      if (this.state.prevCountry !== nextProps.country.name) {
        if (typeof this.props.country_region_list !== 'undefined' && this.props.country_region_list.length > 0) {
          this.props.dispatch(change('NewEmployee', 'state', ''));
        }
      }
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
          () => this.props.reset()
        );
      } else {
        //Validation Failed
        this.setState(() => ({
          announcementBar: (
            <div className="announcement-bar fail">
              <p>
                <Translate id={this.state.validateMsg} />
              </p>
            </div>
          )
        }));
      }
    }

    if (nextProps.validatePerson !== null) {
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
                  <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={() => this.onClose()}>
                    Cancel
                  </button>
                </div>
                <div className="col-md-5">
                  <button type="submit" className="btn btn-primary btn-block register-save-btn next" onClick={() => save()}>
                    Save
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
            // null means the person doesn"t exist in the db, no other people with the same name exist
            // Create New Person
            this.onSave();
          }
        }
      }
    }
  };

  addTranslationsForActiveLanguage = async () => {
    await ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);

    let gendersTranslate = [];
    let drugTest = [];
    let backgroundTest = [];
    let maritalStatus = [];

    await gendersTranslate.push($(ReactDOM.findDOMNode(this.refs.maleOption)).text());
    await gendersTranslate.push($(ReactDOM.findDOMNode(this.refs.femaleOption)).text());

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

  onChange = (file, ref) => {
    let readOnlyTextBox = $(ReactDOM.findDOMNode(this.refs[ref]));
    let fileName = file.name.replace(/\\/g, '/').replace(/.*\//, '');

    readOnlyTextBox.text(fileName);

    let reader = new FileReader();

    reader.readAsBinaryString(file); //Read Blob as binary

    //Event Listener for when a file is selected to be uploaded
    reader.onload = (event) => {
      //(on_file_select_event)
      let data = event.target.result; //"result" if not "null", contains the contents of the file as a binary string
      let stateName = ref === 'fileInputDocuments' ? 'documents' : 'resume';

      /* Update state */
      this.setState(() => ({
        [stateName]: {
          name: file.name,
          data: data
        }
      }));
    };
  };

  onSubmit = async (formValues) => {
    let skills = [];
    let counter = 0;
    let fomrValueLen = Object.keys(formValues).length;

    let agency = sessionStorage.getItem('agency');
    agency = JSON.parse(agency);

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
        temporalInfo: true,
        skills: skills,
        orgId: agency.organizationEntity.orgId,
        address: formValues.address.toUpperCase(),
        address2: typeof formValues.address2_ !== 'undefined' ? formValues.address2_.toUpperCase() : '',
        backgroundTestDate: moment(formValues.backgroundTestDate, 'YYYY-MM-DD'),
        backgroundtest: formValues.backgroundTestDropdown === 'Yes' ? true : false,
        birthDay: moment(formValues.birthday_, 'YYYY-MM-DD'),
        cellPhone: formValues.phone,
        city: formValues.city.toUpperCase(),
        country: formValues.country.countryId,
        drugTest: formValues.drugTestDropdown === 'Yes' ? true : false,
        drugTestDate: moment(formValues.drugTestDate, 'YYYY-MM-DD'),
        email: formValues.email,
        empDepartment: this.state.orgDepartmentId || formValues.department,
        firstName: formValues.firstName.toUpperCase(),
        gender: formValues.gender === 'Male' ? 'M' : 'F',
        hireDate: moment(formValues.hireDate_, 'YYYY-MM-DD'),
        identification: formValues.employeeid,
        lastName: formValues.lastName.toUpperCase(),
        maritalStatus: formValues.maritalstatusDropdown ? 0 : 1,
        middleName: formValues.middleName_ ? formValues.middleName_.toUpperCase() : '',
        phone: formValues.phone,
        region: formValues.state.regionId,
        taxRegion: formValues.joblocation.regionId,
        usrCreatedBy: agency.portalUserConfId,
        zipcode: formValues.zip,
        docExt: null,
        resumExt: null,
        personType: {
          personTypeId: 1 // ** TODO **
        },
        office: {
          officeId: formValues.office.officeId
        }
      };

      var fileArray = {};
      if (this.state.documents !== null) {
        fileArray.documents = new Blob([this.state.documents.data], { type: 'application/pdf' });
        data.docExt = this.state.documents.name.split('.').pop();
      }

      if (this.state.resume !== null) {
        fileArray.resume = new Blob([this.state.resume.data], { type: 'application/pdf' });
        data.resumExt = this.state.resume.name.split('.').pop();
      }

      this.setState(
        () => ({
          formData: { ...data },
          fileArray
        }),
        () => {
          this.props.tempedgeAPI('/api/person/validate', data, types.VALIDATE_PERSON);
        }
      );
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
      fileReader.onload = function(fileLoadedEvent) {
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

  // Close Modal
  onClose = () => {
    // this.props.dispatch(reset("NewEmployee"));
    this.toggleModalOnOff(); // Close Modal
  };

  openModal() {
    this.createDepartmentsTable();
    this.toggleModalOnOff(); // Open or close Modal
  }

  render() {
    let key = this.state.key;
    let sortedSkillList = undefined;
    let birthDay = this.props.birthday !== null ? moment().diff(this.props.birthday, 'years', false) : '';

    let modal = <ModalSimple content={this.state.departmentsTable} open={this.state.showModal} onClose={() => this.onClose()} modalSize="modal-sm" />;

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
        <Field name="drugTestDate" type="text" placeholder="Drug Test Date" category="person" component={DateTime} validate={date()} />
      </div>
    );

    let backgroundTestDate = (
      <div style={{ width: '80%', margin: 'auto' }}>
        <label className="control-label" style={{ marginBottom: 5 }}>
          <Translate id="com.tempedge.msg.label.date" />
        </label>
        <Field name="backgroundTestDate" type="text" placeholder="Background Test Date" category="person" component={DateTime} validate={date()} />
      </div>
    );

    return (
      <div style={{ marginBottom: 20 }}>
        <Stepper steps={this.state.steps} activeStep={key} activeColor="#eb8d34" completeColor="#8cb544" defaultBarColor="#eb8d34" completeBarColor="#8cb544" barStyle="solid" circleFontSize={16} />
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
                    <a className="nav-link active" style={this.state.errorPanel[0]} data-toggle="tab" href="#tab1">
                      Info
                    </a>
                  </li>
                  <li className="nav-item panel" onClick={() => this.setState({ key: 1 })}>
                    <a className="nav-link" style={this.state.errorPanel[1]} data-toggle="tab" href="#tab2">
                      Contact
                    </a>
                  </li>
                  <li className="nav-item panel" onClick={() => this.setState({ key: 2 })}>
                    <a className="nav-link" data-toggle="tab" href="#tab4">
                      Skills
                    </a>
                  </li>
                  <li className="nav-item last-panel" onClick={() => this.setState({ key: 3 })}>
                    <a className="nav-link" style={this.state.errorPanel[3]} data-toggle="tab" href="#tab6">
                      Misc
                    </a>
                  </li>
                </ul>

                <div className="tab-content formPanelBody" style={{ background: '#ffff' }}>
                  <div className="tab-pane fade show active" id="tab1" role="tabpanel">
                    <div className="form-group row">
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.tempdata" />
                        </label>
                        <Field name="temporarydata" type="text" placeholder="Temporary Data" category="person" component={InputBox} />
                      </div>
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.office" />
                        </label>
                        <Field name="office" data={this.state.officeList} valueField="officeId" textField="name" category="person" component={Dropdown} />
                      </div>
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.department" />
                        </label>
                        <div className="row">
                          <div className="col-9 col-md-8 col-lg-9">
                            <Translate>
                              {({ translate }) => (
                                <Field
                                  name="department"
                                  placeholder={translate('com.tempedge.msg.label.department')}
                                  category="person"
                                  component={InputBox}
                                  ref={this.departmentInput}
                                  className="form-control tempEdge-input-box"
                                />
                              )}
                            </Translate>
                          </div>
                          <div className="col-3 col-md-4 col-lg-3 text-right">
                            <button className="btn symbol-button" type="button" onClick={() => this.openModal()}>
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
                        <Field name="hireDate_" type="text" placeholder="Hire Date" category="person" component={DateTime} validate={date()} />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.firstname" />
                        </label>
                        <Field name="firstName" type="text" placeholder="First Name" category="person" component={InputBox} />
                      </div>
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.middlename"></Translate>
                        </label>
                        <Field name="middleName_" type="text" placeholder="Middle Name" category="person" component={InputBox} />
                      </div>
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.lastname"></Translate>
                        </label>
                        <Field name="lastName" type="text" placeholder="Last Name" category="person" component={InputBox} />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.birthday" />
                        </label>
                        <Field name="birthday_" type="text" category="person" component={DateTime} validate={date()} />
                      </div>
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">Age</label>
                        <label className="control-label">{birthDay}</label>
                      </div>
                      <div className="col-10 col-md-5 col-lg-4">
                        <label className="control-label">
                          <Translate id="com.tempedge.msg.label.gender" />
                        </label>
                        <span style={{ display: 'none' }} ref="maleOption">
                          <Translate id="com.tempedge.msg.label.gender.male" />
                        </span>
                        <span style={{ display: 'none' }} ref="femaleOption">
                          <Translate id="com.tempedge.msg.label.gender.female" />
                        </span>
                        <Field id="genderDropdown" name="gender" data={this.state.genders} valueField="value" textField="gender" category="person" component={Dropdown} />
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="tab2" role="tabpanel">
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
                        <Field name="country" data={this.state.country_list} valueField="countryId" textField="name" category="agency" component={Dropdown} />
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
                        <Field name="state" data={this.state.region_list} valueField="regionId" textField="name" category="person" component={Dropdown} />
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
                  <div className="tab-pane fade" id="tab4" role="tabpanel">
                    <div className="row">
                      <div className="col-md-6">
                        {typeof sortedSkillList !== 'undefined'
                          ? sortedSkillList.map((item, index) => {
                              let listLen = this.props.skillsList.length;

                              if (index < (listLen - 1) / 2) {
                                return (
                                  <div style={{ width: '60%', margin: 'auto', marginBottom: 5 }}>
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
                                  <div style={{ width: '60%', margin: 'auto', marginBottom: 5 }}>
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
                  <div className="tab-pane fade" id="tab6" role="tabpanel">
                    <div className="row">
                      <div className="col-md-8" style={{ borderRight: '1px solid #d7d7d7' }}>
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
                              <Field name="drugTest" data={this.state.drugTest} valueField="value" textField="Drug Test" category="person" component={Dropdown} />
                            </div>
                            {typeof this.props.drugTest === 'string' ? (
                              this.props.drugTest === 'Yes' || this.props.drugTest === 'Si' ? (
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
                              <Field name="backgroundTest" data={this.state.backgroundTest} valueField="value" textField="Background Test" category="person" component={Dropdown} />
                            </div>
                            {typeof this.props.backgroundTest === 'string' ? (
                              this.props.backgroundTest === 'Yes' || this.props.backgroundTest === 'Si' ? (
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
                                    <input type="file" onChange={(e) => this.onChange(e.target.files[0], 'fileInputDocuments')} style={{ display: 'none' }} accept=".pdf" />
                                  </span>
                                </label>
                                <br />
                                <p ref="fileInputDocuments" style={{ margin: '20px auto 0 auto', background: '#ffff', border: 'none', textAlign: 'center' }}></p>
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
                                      type="file"
                                      onChange={(e) => this.onChange(e.target.files[0], 'fileInputResume')}
                                      style={{ display: 'none' }}
                                      accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, .pdf"
                                    />
                                  </span>
                                </label>
                                <br />
                                <p ref="fileInputResume" style={{ margin: '20px auto 0 auto', background: '#ffff', border: 'none', textAlign: 'center' }}></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div style={{ width: '60%', margin: 'auto', marginBottom: 10 }}>
                          <label className="control-label" style={{ marginBottom: 5 }}>
                            <Translate id="com.tempedge.msg.label.joblocation" />
                          </label>
                          <Field name="joblocation" data={this.state.region_list} valueField="regionId" textField="name" category="person" component={Dropdown} />
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
                          <Field name="maritalstatusDropdown" data={this.state.maritalStatus} valueField="value" textField="Marital Status" category="person" component={Dropdown} />
                        </div>

                        <div style={{ width: '60%', margin: 'auto' }}>
                          <label className="control-label" style={{ marginBottom: 5 }}>
                            <Translate id="com.tempedge.msg.label.numberofallowances" />
                          </label>
                          <Field name="numberofallowances" type="text" placeholder="Number of allowances" category="person" component={InputBox} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ width: '100%', margin: '30px 0' }}></div>
                  <hr />
                  <div className="prev-next-btns-agency row" style={{ marginTop: 30 }}>
                    <div className="col-md-5 offset-md-1">
                      <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={this.props.previousPage}>
                        Cancel
                      </button>
                    </div>
                    <div className="col-md-5">
                      <button type="submit" className="btn btn-primary btn-block register-save-btn next">
                        Save
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
  //Typechecking With PropTypes, will run on its own, no need to do anything else, separate library since React 16, wasn"t the case before on 14 or 15
  //Action, does the Fetch part from the posts API
  tempedgeAPI: PropTypes.func.isRequired,
  tempedgeMultiPartApi: PropTypes.func.isRequired,
  getList: PropTypes.func.isRequired,
  getListSafe: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  clearTempedgeStoreProp: PropTypes.func.isRequired,
  clearErrorField: PropTypes.func.isRequired
};

CreateEmployee = reduxForm({
  form: 'NewEmployee', //                 <------ form name
  destroyOnUnmount: false, //        <------ preserve form data
  validate: Validate
})(CreateEmployee);

let mapStateToProps = (state, ownProps) => {
  let selector = formValueSelector('NewEmployee'); // <-- same as form name
  return {
    skillsList: state.tempEdge.skillsList,
    country_region_list: state.tempEdge.country_region_list,
    orgDepartmentList: typeof state.tempEdge.orgDepartmentList !== 'undefined' ? state.tempEdge.orgDepartmentList : [],
    officeList: typeof state.tempEdge.officeList !== 'undefined' ? state.tempEdge.officeList : [],
    country: selector(state, 'country'),
    backgroundTest: typeof state.form.NewEmployee !== 'undefined' && typeof state.form.NewEmployee.values !== 'undefined' ? state.form.NewEmployee.values.backgroundTest : null,
    drugTest: typeof state.form.NewEmployee !== 'undefined' && typeof state.form.NewEmployee.values !== 'undefined' ? state.form.NewEmployee.values.drugTest : null,
    birthday: typeof state.form.NewEmployee !== 'undefined' && typeof state.form.NewEmployee.values !== 'undefined' ? state.form.NewEmployee.values.birthday_ : null,
    hiredate: typeof state.form.NewEmployee !== 'undefined' && typeof state.form.NewEmployee.values !== 'undefined' ? state.form.NewEmployee.values.hireDate_ : null,
    validatePerson: typeof state.tempEdge.validatePerson !== 'undefined' ? state.tempEdge.validatePerson : null,
    savePerson: typeof state.tempEdge.savePerson !== 'undefined' ? state.tempEdge.savePerson : null,
    errorFields: state.tempEdge.errorFields,
    lastRemoved: state.tempEdge.lastRemoved
  };
};

export default withLocalize(connect(mapStateToProps, { push, change, initialize, getList, tempedgeAPI, tempedgeMultiPartApi, getListSafe, clearTempedgeStoreProp, clearErrorField })(CreateEmployee));
