import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Stepper from 'react-stepper-horizontal';
import { connect } from 'react-redux';
import { notify } from 'reapop';
import { reset, reduxForm, change, initialize } from 'redux-form';
import { withLocalize, Translate } from 'react-localize-redux';
import Validate from '../../Validations/Validations';
import { GET_COUNTRY_REGION_LIST, GET_FUNDING_LIST, CREATE_CLIENT } from '../../../Redux/actions/types.js';
import WizardCreateNewClientFirstPage from './WizardCreateNewClientFirstPage.js';
import WizardCreateNewClientSecondPage from './WizardCreateNewClientSecondPage.js';
import WizardCreateNewClientThirdPage  from './WizardCreateNewClientThirdPage';
import ModalSimple from '../../../Modals/ModalSimple/ModalSimple.js';
import Department from './Department.js'
import { FieldArray } from 'redux-form';
import addIcon from "./assets/plus.png";
import deleteIcon from "./assets/delete.png"; // Tell Webpack this JS file uses this image
import editIcon from "./assets/edit.png";
import upIcon from "./assets/up.png";
import downIcon from "./assets/down.png";
import { getList, tempedgeAPI, saveDepartmentList, savePositionsList, saveToPositionsList, removeFromDepartmentList } from "../../../Redux/actions/tempEdgeActions";

//Department Modal re-init data
const reInitData = {
	departmentname:"",
	position:"",
	description:"",
	markup:"",
	otmarkup:"",
	payRate:"",
	timeIn:"",
	timeOut:"",
	employeeContact:"",
	contactPhone:""
}

class CreateNewClient extends Component {
  constructor(props) {
    super(props);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);

    this.state = {
      page: 1,
      steps: [
       {title: ""},
       {title: ""},
       {title: ""}
      ],
      departmentList: "",
      addDeptBtn: "",
      renderAddBtnDirty: false,
      positionList: "",
      departmentContent: "",
      deptPosfields: null,
      addDepartmentPositionsBtn: "",
      showModal: false,
      editMode: {
        index: null,
        edit: false
      },
			reduxFormDispatch: null
    };
  }

  componentDidMount = async() => {
    this.props.getList('/api/country/listAll', GET_COUNTRY_REGION_LIST);
    this.props.getList('/api/funding/listAll', GET_FUNDING_LIST);
  }

  componentWillUnmount = () => {
    this.props.saveDepartmentList([]);
    this.props.savePositionsList([]);
  }

  nextPage(){
    console.log("Next Page!");
    this.setState({ page: this.state.page + 1 });
  }

  previousPage(){
    console.log("Previous Page!");
    this.setState({ page: this.state.page - 1 });
  }

  onSubmit = async (formValues) => {
    let phone = (typeof formValues.clientcontactphone !== null)? formValues.clientcontactphone: formValues.clientcontactcellphone;
    let depList = this.props.deptList;
    let bill = this.props.billRate;

    let response = {
      orgId : 1,
      address: formValues.clientaddress,
      attn: formValues.attnTo,
      city: formValues.clientcity,
      clientInitials: formValues.companyInitials,
      clientName: formValues.company,
      commonMarkup: formValues.markupClient,
      commonOtMarkup: formValues.otMarkupClient,
      country: formValues.clientcountry.countryId,
      email: formValues.email,
      notes: formValues.comments,
      payrollSchedule: formValues.payrollCycle.payrollId,
      phone: phone,
      region: formValues.clientstate.regionId,
      wcCode: formValues.workCompCode,
      wcRate: formValues.workCompRate,
      zipcode: formValues.clientzipcode,
      contact : {
        firstName: formValues.clientfirstName,
        lastName: formValues.clientlastName,
        phone: phone,
        personType : {
         personTypeId : 2
        }
      },
      departments: depList,
      clientSellers: [
        {
           person : {
            personId : 1
           }
        },
        {
           person : {
            personId : 2
           }
         }
      ]
    }

    console.log("Client Form: ", response);

    this.props.tempedgeAPI('/api/client/save', response, CREATE_CLIENT);
  }

  fireNotification = () => {
    console.log("NOTIFY RAN!");
    let { notify } = this.props;

    notify({
      title: 'Client Creation Information Submitted',
      message: 'you clicked on the Submit button',
      status: 'success',
      position: 'br',
      dismissible: true,
      dismissAfter: 3000
    });
  }

  componentWillUnmount(){
    this.props.reset("CreateNewClient");    //Reset form fields all to empty
  }

  //Set Modal visible or not
  toggleModalOnOff = (destroy = null) => {
    this.setState({
      showModal: !this.state.showModal,
			departmentContent: (destroy === null)? this.state.departmentContent: ""
    });
  }

	resetInitData = () => {
		for (var prop in this.props.formValues) {
			if(prop !== "departmentname" || prop !== "position" || prop !== "description" || prop !== "markup" || prop !== "otmarkup" || prop !== "payRate" || prop !== "timeIn" || prop !== "timeOut" || prop !== "employeeContact" || prop !== "contactPhone"){
				reInitData[prop] = this.props.formValues[prop];
			}
		}
	}

  //Close Modal
  onClose = async () => {
    this.toggleModalOnOff(true);   //Close Modal
    this.renderClientDepartmentsList({repaint: true});
    this.props.savePositionsList([]);
		this.resetInitData();
    this.state.reduxFormDispatch(initialize('CreateNewClient', reInitData));
  }

	getDispatch = (dispatch) => {
		this.setState(() => ({
			reduxFormDispatch: dispatch
		}));
	}

  renderClientDepartmentsList = async (flag) => {
    let departmentList = [];
    let deptList = this.props.deptList;

    deptList.map((dept, index) => {
      let key = `departments-${index}`;
      let name = dept.name;
      let tableRows = deptList[index].positions.map((position, index) => {
        return(
          <tr>
            <td>{position.name}</td>
            <td>{position.markUp}</td>
            <td>{position.otMarkUp}</td>
          </tr>
        );
      });

      let block = (
        <React.Fragment>
          <div style={{height: 10}}></div>
          <div id={key} key={key}>
            <div className="btn-dept" style={{marginTop: 0}}>
              <a className="up-down-arrow pull-left" data-toggle="collapse" href={`#departments${index}`} role="button" aria-expanded="false" aria-controls={`departments${index}`}>
                <img src={downIcon} style={{width: 14, height: 11, display: "inline", marginLeft: 19}} alt="downIcon" />
              </a>
              <span>{name}</span>
              <span className="pull-right">
                <img src={editIcon} className="client-dpt-btn-edit-delete" style={{display: "inline"}} onClick={() => this.departmentModalEdit(index)} alt="editIcon" />
                <img src={deleteIcon} className="client-dpt-btn-edit-delete" style={{marginLeft:17 , marginRight: 29, display: "inline"}} onClick={() => this.removeDepartment(index)} alt="deleteIcon" />
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
                  <tbody>
                    {tableRows}
                  </tbody>
                </table>
                </div>
              </div>
          </div>
        </React.Fragment>
      )

      departmentList.push(block);
    });

    let addDeptBtn = <span style={{marginTop: "3.2rem"}} className="center-block pull-right add-fieldArray-btn" onClick={this.addDept}><img src={addIcon} alt="addIcon" /></span>;

    if(!flag.repaint){
      this.setState(() => ({
        departmentList: departmentList,
        addDeptBtn: addDeptBtn,
        renderAddBtnDirty: true
      }));
			this.resetInitData();
      this.state.reduxFormDispatch(initialize('CreateNewClient', {departmentname: ""}));
      this.props.saveToPositionsList("CLEAR");
    }else {
      this.setState(() => ({
        departmentList: (deptList.length > 0)? departmentList: [],
        addDeptBtn: addDeptBtn,
        renderAddBtnDirty: (deptList.length > 0)? true: false
      }));
    }
  }

  removeDepartment = async (index) => {
    await this.props.removeFromDepartmentList(index);
    this.renderClientDepartmentsList({repaint: true});
  }

  departmentModalEdit = async (index) => {
    let departmentname = this.props.deptList[index].departmentName;
    let positionList = this.props.deptList[index].positions;
		this.resetInitData();
    this.state.reduxFormDispatch(change('CreateNewClient', 'departmentname', departmentname));

    await this.setState(() => ({
      editMode: {
        index: index,
        edit: true
      }
    }),async () => {
      await this.props.savePositionsList(positionList);
      this.renderDepartmentModal();
    });
  }

  renderAddBtn = () => {
    let addDtpBtn = (
      <React.Fragment>
        <div style={{height: 10}}></div>
        <p className="department-list-button center-block" onClick={() => this.renderDepartmentModal()}>Add Departments</p>
      </React.Fragment>
    );

    return addDtpBtn;
  }

  addDept = async () => {
    await this.props.savePositionsList([]);

    this.setState(() => ({
      editMode: {
        index: null,
        edit: false
      }
    }), () => {
      this.renderDepartmentModal();
      this.state.reduxFormDispatch(change('CreateNewClient', 'departmentname', ''));
    });
  }

  renderDepartmentModal = async () => {
    await this.setState(() => ({
      departmentContent: <Department editMode={this.state.editMode} closePanel={() => this.onClose()} renderClientDepartmentsList={this.renderClientDepartmentsList} resetInitData={this.resetInitData} reInitData={reInitData} />
    }));

    this.toggleModalOnOff();   //Open Modal
  }

  render(){
    let { page, steps } = this.state;
    let modal = <ModalSimple content={this.state.departmentContent} open={this.state.showModal} onClose={() => this.onClose()} />;

    return(
      <div className="wizard-create-agency">
        <Stepper steps={ steps } activeStep={ page-1 } activeColor="#eb8d34" completeColor="#8cb544" defaultBarColor="#eb8d34" completeBarColor="#8cb544" barStyle="solid" circleFontSize={16} />
        <div className="wizard-wrapper">
          {page === 1 && <WizardCreateNewClientFirstPage  onSubmit={this.nextPage} renderAddBtn={this.renderAddBtn} renderAddBtnDirty={this.state.renderAddBtnDirty} departmentList={this.state.departmentList} addDeptBtn={this.state.addDeptBtn} getDispatch={(dispatch) => this.getDispatch(dispatch)} {...this.props} />}
          {page === 2 && <WizardCreateNewClientSecondPage  previousPage={this.previousPage} onSubmit={this.nextPage} renderAddBtn={this.renderAddBtn} renderAddBtnDirty={this.state.renderAddBtnDirty} departmentList={this.state.departmentList} addDeptBtn={this.state.addDeptBtn} {...this.props} />}
          {page === 3 && <WizardCreateNewClientThirdPage   previousPage={this.previousPage} onSubmit={this.onSubmit} renderAddBtn={this.renderAddBtn} renderAddBtnDirty={this.state.renderAddBtnDirty} departmentList={this.state.departmentList} addDeptBtn={this.state.addDeptBtn} {...this.props} />}
          { modal }
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
  tempedgeAPI: PropTypes.func.isRequired
}

let mapStateToProps = (state) => {
  let departmentname = "";

  if(state.form.CreateNewClient !== undefined){
    if(state.form.CreateNewClient.values !== undefined){
      let formState = state.form.CreateNewClient.values;
      departmentname = formState.departmentname;
    }
  }

  return({
    deptList: (typeof state.tempEdge.deptList !== 'undefined')? state.tempEdge.deptList: [],
    deptPosList: (typeof state.tempEdge.deptPosList !== 'undefined')? state.tempEdge.deptPosList: [],
    departmentname: departmentname,
		formValues: (typeof state.form.CreateNewClient !== 'undefined')? state.form.CreateNewClient.values: "",
    billRate: (typeof state.tempEdge.billRate !== 'undefined')? state.tempEdge.billRate: 0,
    otBillRate: (typeof state.tempEdge.otBillRate !== 'undefined')? state.tempEdge.otBillRate: 0,
  });
}

export default withLocalize(connect(mapStateToProps, { notify, getList, reset, change, initialize, saveDepartmentList, savePositionsList, saveToPositionsList, removeFromDepartmentList, tempedgeAPI })(CreateNewClient));
