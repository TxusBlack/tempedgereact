import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Stepper from 'react-stepper-horizontal';
import { connect } from 'react-redux';
import { notify } from 'reapop';
import { reset, reduxForm, change, initialize } from 'redux-form';
import { withLocalize, Translate } from 'react-localize-redux';
import { GET_COUNTRY_REGION_LIST, GET_FUNDING_LIST } from '../../../Redux/actions/types.js';
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
import { getList, saveDepartmentList, saveToDepartmentList, savePositionsList, saveToPositionsList, removeFromPositionList, removeFromDepartmentList } from "../../../Redux/actions/tempEdgeActions";

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
      }
    };
  }

  componentDidMount = async() => {
    this.props.getList('/api/country/listAll', GET_COUNTRY_REGION_LIST);
    this.props.getList('/api/funding/listAll', GET_FUNDING_LIST);
  }

  nextPage(){
    console.log("Next Page!");
    this.setState({ page: this.state.page + 1 });
  }

  previousPage(){
    console.log("Previous Page!");
    this.setState({ page: this.state.page - 1 });
  }

  setDepartmentList = (departments) => {
    this.setState(() => ({
      departmentList: departments
    }));
  }

  setPositionList = (positions) => {
    this.setState(() => ({
      positionList: positions
    }));
  }

  onSubmit = async (formValues) => {
    console.log("Client Form: ", formValues);
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
  toggleModalOnOff = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  }

  //Close Modal
  onClose = () => {
    this.toggleModalOnOff();   //Close Modal
    this.renderClientDepartmentsList({repaint: true});
    this.props.savePositionsList([]);
    this.props.dispatch(initialize('CreateNewClient', reInitData));
  }

  renderClientDepartmentsList = async (flag) => {
    if(!flag.repaint){
      console.log("repaint: ", flag.repaint);
      let departmentname = this.props.departmentname;
      let positionList = this.props.deptPosList;

      await this.props.saveToDepartmentList({
        departmentName: departmentname,
        positions: positionList
      });
    }

    let departmentList = [];
    let deptList = this.props.deptList;

    deptList.map((dept, index) => {
      let key = `departments-${index}`;
      let name = dept.departmentName;
      let tableRows = deptList[index].positions.map((position, index) => {
        return(
          <tr>
            <td>{position.position}</td>
            <td>{position.markup}</td>
            <td>{position.otmarkup}</td>
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

      this.props.dispatch(initialize('CreateNewClient', {departmentname: ""}));
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

  departmentModalEdit= async (index) => {
    let departmentname = this.props.deptList[index].departmentName;
    let positionList = this.props.deptList[index].positions;

    this.props.dispatch(change('CreateNewClient', 'departmentname', departmentname));

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
      this.props.dispatch(change('CreateNewClient', 'departmentname', ''));
    });
  }

  renderDepartmentModal = async () => {
    await this.setState(() => ({
      departmentContent: <Department editMode={this.state.editMode} closePanel={() => this.toggleModalOnOff()} renderClientDepartmentsList={this.renderClientDepartmentsList} passBackRenderPositions={passBackFunc => this.childRenderPositions = passBackFunc} />
    }));

    this.toggleModalOnOff();   //Open Modal

    if(this.state.editMode.edit){
      this.childRenderPositions();
    }
  }

  render(){
    let { page, steps } = this.state;
    let modal = <ModalSimple content={this.state.departmentContent} open={this.state.showModal} onClose={() => this.onClose()} />;

    return(
      <div className="wizard-create-agency">
        <Stepper steps={ steps } activeStep={ page-1 } activeColor="#eb8d34" completeColor="#8cb544" defaultBarColor="#eb8d34" completeBarColor="#8cb544" barStyle="solid" circleFontSize={16} />
        <div className="wizard-wrapper">
          {page === 1 && <WizardCreateNewClientFirstPage  onSubmit={this.nextPage} renderAddBtn={this.renderAddBtn} renderAddBtnDirty={this.state.renderAddBtnDirty} departmentList={this.state.departmentList} addDeptBtn={this.state.addDeptBtn} {...this.props} />}
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
  saveToDepartmentList: PropTypes.func.isRequired,
  savePositionsList: PropTypes.func.isRequired,
  saveToPositionsList: PropTypes.func.isRequired,
  removeFromPositionList: PropTypes.func.isRequired,
  removeFromDepartmentList: PropTypes.func.isRequired
}

CreateNewClient = reduxForm({
  form: 'CreateNewClient', //                 <------ form name
  destroyOnUnmount: false, //        <------ preserve form data
  // forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(CreateNewClient);

let mapStateToProps = (state) => {
  let departmentname = "";

  if(state.form.CreateNewClient !== undefined){
    if(state.form.CreateNewClient.values !== undefined){
      let formState = state.form.CreateNewClient.values;
      departmentname = formState.departmentname;
    }
  }

  return({
    deptList: (state.tempEdge.deptList !== undefined)? state.tempEdge.deptList: [],
    deptPosList: (state.tempEdge.deptPosList !== undefined)? state.tempEdge.deptPosList: [],
    departmentname: departmentname
  });
}

export default withLocalize(connect(mapStateToProps, { notify, getList, reset, change, initialize, saveDepartmentList, saveToDepartmentList, savePositionsList, saveToPositionsList, removeFromPositionList, removeFromDepartmentList  })(CreateNewClient));
