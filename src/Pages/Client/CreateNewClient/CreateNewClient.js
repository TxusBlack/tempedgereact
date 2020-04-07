import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Stepper from 'react-stepper-horizontal';
import { connect } from 'react-redux';
import { reset, reduxForm, change, initialize } from 'redux-form';
import { withLocalize, Translate } from 'react-localize-redux';
import Validate from '../../Validations/Validations';
import types from '../../../Redux/actions/types.js';
import WizardCreateNewClientFirstPage from './WizardCreateNewClientFirstPage.js';
import WizardCreateNewClientSecondPage from './WizardCreateNewClientSecondPage.js';
import WizardCreateNewClientThirdPage from './WizardCreateNewClientThirdPage';
import ModalSimple from '../../../Modals/ModalSimple/ModalSimple.js';
import Department from './Department.js';
import OutcomeBar from '../../../components/common/OutcomeBar';
import { FieldArray } from 'redux-form';
import addIcon from './assets/plus.png';
import deleteIcon from './assets/delete.png'; // Tell Webpack this JS file uses this image
import editIcon from './assets/edit.png';
import upIcon from './assets/up.png';
import downIcon from './assets/down.png';
import { getList, tempedgeAPI, saveDepartmentList, savePositionsList, saveToPositionsList, removeFromDepartmentList, clearTempedgeStoreProp } from '../../../Redux/actions/tempEdgeActions';

//Department Modal re-init data
const reInitData = {
  position: '',
  description: '',
  markup: '',
  otmarkup: '',
  payRate: '',
  timeIn: '',
  timeOut: '',
  employeeContact: '',
  contactPhone: ''
};

//Form re-init data
const reInitFormData = {
  departmentname: '',
  position: '',
  description: '',
  markup: '',
  otmarkup: '',
  payRate: '',
  timeIn: '',
  timeOut: '',
  employeeContact: '',
  contactPhone: '',
  company: '',
  salesman: '',
  payrollCycle: '',
  workCompCode: '',
  workCompRate: '',
  companyInitials: '',
  attnTo: '',
  email: '',
  comments: '',
  markupClient: '',
  otMarkupClient: '',
  clientcountry: '',
  clientaddress: '',
  clientcity: '',
  clientstate: '',
  clientzipcode: '',
  clientlastName: '',
  clientfirstName: '',
  clientcontactphone: '',
  clientcontactcellphone: ''
};

class CreateNewClient extends Component {
  constructor(props) {
    super(props);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);

    this.state = {
      page: 1,
      steps: [{ title: '' }, { title: '' }, { title: '' }],
      departmentList: '',
      addDeptBtn: '',
      renderAddBtnDirty: false,
      positionList: '',
      departmentContent: '',
      deptPosfields: null,
      addDepartmentPositionsBtn: '',
      showModal: false,
      editMode: {
        index: null,
        edit: false
      },
      reduxFormDispatch: null,
      resultBar: '',
      submitted: 0,
      orgId: JSON.parse(sessionStorage.getItem('agency')).organizationEntity.orgId
    };
  }

  componentDidMount = async () => {
    this.props.getList('/api/country/listAll', types.GET_COUNTRY_REGION_LIST);
    this.props.getList('/api/funding/listAll', types.GET_FUNDING_LIST);
    this.props.tempedgeAPI(
      '/api/person/salesmanList',
      {
        orgId: this.state.orgId,
        page: 0,
        size: 5
      },
      types.GET_SALESMAN_LIST
    );
  };

  componentWillUnmount = () => {
    this.props.saveDepartmentList([]);
    this.props.savePositionsList([]);
    this.state.reduxFormDispatch(initialize('CreateNewClient', reInitFormData));
    this.props.clearTempedgeStoreProp('salesmanList');
  };

  componentWillReceiveProps = (nextprops) => {
    if (typeof nextprops.client !== 'undefined' && this.state.submitted === 1) {
      if (nextprops.client.status === 200) {
        if (nextprops.client.data.status === 200) {
          if (nextprops.client.data.code === 'TE00') {
            this.setState(() => ({
              resultBar: <OutcomeBar classApplied="announcement-bar success" translateId="com.tempedge.msg.person.newclient" />,
              submitted: 0
            }));

            this.props.saveDepartmentList([]);
            this.props.savePositionsList([]);
            this.state.reduxFormDispatch(initialize('CreateNewClient', reInitFormData));
            this.setState(() => ({
              page: 1,
              renderAddBtnDirty: false
            }));
          }
        } else if (nextprops.client.data.status === 401) {
          if (nextprops.client.data.code === 'TE-E00') {
            this.setState(() => ({
              resultBar: <OutcomeBar classApplied="announcement-bar fail" translateId="com.tempedge.error.recordexists" />,
              submitted: 0
            }));
          }
        } else if (nextprops.client.data.status === 405) {
          if (nextprops.client.data.code === 'TE-E09') {
            this.setState(() => ({
              resultBar: <OutcomeBar classApplied="announcement-bar fail" translateId={nextprops.client.data.message} />,
              submitted: 0
            }));
          }
        } else if (nextprops.client.data.status === 500) {
          if (nextprops.client.data.code === 'TE-E00') {
            this.setState(() => ({
              resultBar: <OutcomeBar classApplied="announcement-bar fail" translateId={nextprops.client.data.message} />,
              submitted: 0
            }));
          }
        } else {
          if (nextprops.client.data.code === 'TE-E07') {
            this.setState(() => ({
              resultBar: <OutcomeBar classApplied="announcement-bar fail" translateId={nextprops.client.data.message} />,
              submitted: 0
            }));
          }
        }
      } else {
        this.setState(() => ({
          resultBar: <OutcomeBar classApplied="announcement-bar fail" translateId="com.tempedge.error.undefine" />,
          submitted: 0
        }));
      }
    }
  };

  nextPage() {
    this.setState({ page: this.state.page + 1 });
  }

  previousPage() {
    this.setState({ page: this.state.page - 1 });
  }

  onSubmit = async (formValues) => {
    let phone = typeof formValues.clientcontactphone !== null ? formValues.clientcontactphone : formValues.clientcontactcellphone;
    let depList = this.props.deptList;
    let bill = this.props.billRate;

    let response = {
      orgId: this.state.orgId,
      address: typeof formValues.clientaddress !== 'undefined' ? formValues.clientaddress : '',
      attn: typeof formValues.attnTo !== 'undefined' ? formValues.attnTo : '',
      city: typeof formValues.clientcity !== 'undefined' ? formValues.clientcity : '',
      clientInitials: typeof formValues.companyInitials !== 'undefined' ? formValues.companyInitials : '',
      clientName: typeof formValues.company !== 'undefined' ? formValues.company : '',
      commonMarkup: typeof formValues.markupClient !== 'undefined' ? formValues.markupClient : '',
      commonOtMarkup: typeof formValues.otMarkupClient !== 'undefined' ? formValues.otMarkupClient : '',
      country: typeof formValues.clientcountry !== 'undefined' ? formValues.clientcountry.countryId : '',
      email: typeof formValues.email !== 'undefined' ? formValues.email : '',
      notes: typeof formValues.comments !== 'undefined' ? formValues.comments : '',
      payrollSchedule: typeof formValues.payrollCycle !== 'undefined' ? formValues.payrollCycle.payrollId : '',
      phone: typeof phone !== 'undefined' ? phone : '',
      region: typeof formValues.clientstate !== 'undefined' ? formValues.clientstate.regionId : '',
      wcCode: typeof formValues.workCompCode !== 'undefined' ? formValues.workCompCode : '',
      wcRate: typeof formValues.workCompRate !== 'undefined' ? formValues.workCompRate : '',
      zipcode: typeof formValues.clientzipcode !== 'undefined' ? formValues.clientzipcode : '',
      contact: {
        firstName: typeof formValues.clientfirstName !== 'undefined' ? formValues.clientfirstName : '',
        lastName: typeof formValues.clientlastName !== 'undefined' ? formValues.clientlastName : '',
        phone: typeof phone !== 'undefined' ? phone : '',
        personType: {
          personTypeId: 2
        }
      },
      departments: typeof depList !== 'undefined' ? depList : [],
      clientSellers: [
        {
          person: {
            personId: typeof formValues.salesman !== 'undefined' && formValues.salesman.personId !== 'undefined' ? formValues.salesman.personId : 0
          }
        },
        {
          person: {
            personId: 2
          }
        }
      ]
    };

    this.setState(
      () => ({
        submitted: 1
      }),
      () => {
        this.props.tempedgeAPI('/api/client/save', response, types.CREATE_CLIENT);
      }
    );
  };

  //Set Modal visible or not
  toggleModalOnOff = (destroy = null) => {
    this.setState({
      showModal: !this.state.showModal,
      departmentContent: destroy === null ? this.state.departmentContent : ''
    });
  };

  resetInitData = () => {
    for (let prop in this.props.formValues) {
      if (
        prop !== 'departmentname' ||
        prop !== 'position' ||
        prop !== 'description' ||
        prop !== 'markup' ||
        prop !== 'otmarkup' ||
        prop !== 'payRate' ||
        prop !== 'timeIn' ||
        prop !== 'timeOut' ||
        prop !== 'employeeContact' ||
        prop !== 'contactPhone'
      ) {
        reInitData[prop] = this.props.formValues[prop];
      }
    }
  };

  //Close Modal
  onClose = async () => {
    this.toggleModalOnOff(true);
    this.renderClientDepartmentsList({ repaint: true });
    this.props.savePositionsList([]);
    this.resetInitData();
    this.state.reduxFormDispatch(initialize('CreateNewClient', reInitData));
  };

  getDispatch = (dispatch) => {
    this.setState(() => ({
      reduxFormDispatch: dispatch
    }));
  };

  renderClientDepartmentsList = async (flag) => {
    let departmentList = [];
    let deptList = this.props.deptList;

    deptList.map((dept, index) => {
      let key = `departments-${index}`;
      let name = dept.name;
      let tableRows = deptList[index].positions.map((position, index) => {
        return (
          <tr>
            <td>{position.name}</td>
            <td>{position.markUp}</td>
            <td>{position.otMarkUp}</td>
          </tr>
        );
      });

      let block = (
        <React.Fragment>
          <div style={{ height: 10 }}></div>
          <div id={key} key={key}>
            <div className="btn-dept" style={{ marginTop: 0 }}>
              <a className="up-down-arrow pull-left" data-toggle="collapse" href={`#departments${index}`} role="button" aria-expanded="false" aria-controls={`departments${index}`}>
                <img src={downIcon} style={{ width: 14, height: 11, display: 'inline', marginLeft: 19 }} alt="downIcon" />
              </a>
              <span>{name}</span>
              <span className="pull-right">
                <img src={editIcon} className="client-dpt-btn-edit-delete" style={{ display: 'inline' }} onClick={() => this.departmentModalEdit(index)} alt="editIcon" />
                <img
                  src={deleteIcon}
                  className="client-dpt-btn-edit-delete"
                  style={{ marginLeft: 17, marginRight: 29, display: 'inline' }}
                  onClick={() => this.removeDepartment(index)}
                  alt="deleteIcon"
                />
              </span>
            </div>

            <div className="collapse multi-collapse show" id={`departments${index}`}>
              <div className="card card-body">
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th>Position</th>
                      <th>Markup</th>
                      <th>OT Markup</th>
                    </tr>
                  </thead>
                  <tbody>{tableRows}</tbody>
                </table>
              </div>
            </div>
          </div>
        </React.Fragment>
      );

      departmentList.push(block);
    });

    let addDeptBtn = (
      <span style={{ marginTop: '3.2rem' }} className="center-block pull-right add-fieldArray-btn" onClick={this.addDept}>
        <img src={addIcon} alt="addIcon" />
      </span>
    );

    if (!flag.repaint) {
      this.setState(() => ({
        departmentList: departmentList,
        addDeptBtn: addDeptBtn,
        renderAddBtnDirty: true
      }));
      this.resetInitData();
      this.props.saveToPositionsList('CLEAR');
    } else {
      this.setState(() => ({
        departmentList: deptList.length > 0 ? departmentList : [],
        addDeptBtn: addDeptBtn,
        renderAddBtnDirty: deptList.length > 0 ? true : false
      }));
    }
  };

  removeDepartment = async (index) => {
    await this.props.removeFromDepartmentList(index);
    this.renderClientDepartmentsList({ repaint: true });
  };

  departmentModalEdit = async (index) => {
    let departmentname = this.props.deptList[index].name;
    let positionList = this.props.deptList[index].positions;
    this.resetInitData();
    this.state.reduxFormDispatch(change('CreateNewClient', 'departmentname', departmentname));

    await this.setState(
      () => ({
        editMode: {
          index: index,
          edit: true
        }
      }),
      async () => {
        await this.props.savePositionsList(positionList);
        this.renderDepartmentModal();
      }
    );
  };

  renderAddBtn = () => {
    let addDtpBtn = (
      <React.Fragment>
        <div style={{ height: 10 }}></div>
        <p className="department-list-button center-block" onClick={() => this.renderDepartmentModal()}>
          Add Departments
        </p>
      </React.Fragment>
    );

    return addDtpBtn;
  };

  addDept = async () => {
    await this.props.savePositionsList([]);

    this.setState(
      () => ({
        editMode: {
          index: null,
          edit: false
        }
      }),
      () => {
        this.renderDepartmentModal();
        this.state.reduxFormDispatch(change('CreateNewClient', 'departmentname', ''));
      }
    );
  };

  renderDepartmentModal = async () => {
    await this.setState(() => ({
      departmentContent: (
        <Department
          editMode={this.state.editMode}
          closePanel={() => this.onClose()}
          renderClientDepartmentsList={this.renderClientDepartmentsList}
          resetInitData={this.resetInitData}
          reInitData={reInitData}
        />
      )
    }));

    this.toggleModalOnOff(); //Open Modal
  };

  render() {
    let { page, steps } = this.state;
    let modal = <ModalSimple content={this.state.departmentContent} open={this.state.showModal} onClose={() => this.onClose()} />;

    return (
      <div className="wizard-create-agency">
        <Stepper steps={steps} activeStep={page - 1} activeColor="#eb8d34" completeColor="#8cb544" defaultBarColor="#eb8d34" completeBarColor="#8cb544" barStyle="solid" circleFontSize={16} />
        <div className="wizard-wrapper">
          {page === 1 && (
            <WizardCreateNewClientFirstPage
              onSubmit={this.nextPage}
              resultBar={this.state.resultBar}
              renderAddBtn={this.renderAddBtn}
              renderAddBtnDirty={this.state.renderAddBtnDirty}
              departmentList={this.state.departmentList}
              addDeptBtn={this.state.addDeptBtn}
              getDispatch={(dispatch) => this.getDispatch(dispatch)}
              {...this.props}
            />
          )}
          {page === 2 && (
            <WizardCreateNewClientSecondPage
              previousPage={this.previousPage}
              onSubmit={this.nextPage}
              resultBar={this.state.resultBar}
              renderAddBtn={this.renderAddBtn}
              renderAddBtnDirty={this.state.renderAddBtnDirty}
              departmentList={this.state.departmentList}
              addDeptBtn={this.state.addDeptBtn}
              {...this.props}
            />
          )}
          {page === 3 && (
            <WizardCreateNewClientThirdPage
              previousPage={this.previousPage}
              onSubmit={this.onSubmit}
              resultBar={this.state.resultBar}
              renderAddBtn={this.renderAddBtn}
              renderAddBtnDirty={this.state.renderAddBtnDirty}
              departmentList={this.state.departmentList}
              addDeptBtn={this.state.addDeptBtn}
              {...this.props}
            />
          )}
          {modal}
        </div>
      </div>
    );
  }
}

CreateNewClient.propTypes = {
  getList: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
  saveDepartmentList: PropTypes.func.isRequired,
  savePositionsList: PropTypes.func.isRequired,
  saveToPositionsList: PropTypes.func.isRequired,
  removeFromDepartmentList: PropTypes.func.isRequired,
  tempedgeAPI: PropTypes.func.isRequired,
  clearTempedgeStoreProp: PropTypes.func.isRequired
};

let mapStateToProps = (state) => {
  let departmentname = '';
  let client = state.tempEdge.client;

  if (state.form.CreateNewClient !== undefined) {
    if (state.form.CreateNewClient.values !== undefined) {
      let formState = state.form.CreateNewClient.values;
      departmentname = formState.departmentname;
    }
  }

  return {
    deptList: typeof state.tempEdge.deptList !== 'undefined' ? state.tempEdge.deptList : [],
    deptPosList: typeof state.tempEdge.deptPosList !== 'undefined' ? state.tempEdge.deptPosList : [],
    departmentname: departmentname,
    formValues: typeof state.form.CreateNewClient !== 'undefined' ? state.form.CreateNewClient.values : '',
    billRate: typeof state.tempEdge.billRate !== 'undefined' ? state.tempEdge.billRate : 0,
    otBillRate: typeof state.tempEdge.otBillRate !== 'undefined' ? state.tempEdge.otBillRate : 0,
    client: client
  };
};

export default withLocalize(
  connect(mapStateToProps, { getList, reset, change, initialize, saveDepartmentList, savePositionsList, saveToPositionsList, removeFromDepartmentList, tempedgeAPI, clearTempedgeStoreProp })(
    CreateNewClient
  )
);
