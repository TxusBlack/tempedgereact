import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Stepper from 'react-stepper-horizontal';
import { connect } from 'react-redux';
import { notify } from 'reapop';
import { reset } from 'redux-form';
import { getList } from '../../../Redux/actions/tempEdgeActions';
import { withLocalize, Translate } from 'react-localize-redux';
import { GET_COUNTRY_REGION_LIST, GET_FUNDING_LIST } from '../../../Redux/actions/types.js';
import WizardCreateNewClientFirstPage from './WizardCreateNewClientFirstPage.js';
import WizardCreateNewClientSecondPage from './WizardCreateNewClientSecondPage.js';
import WizardCreateNewClientThirdPage  from './WizardCreateNewClientThirdPage';
import ModalSimple from '../../../Modals/ModalSimple/ModalSimple.js';
import Department from './Department.js'
import addIcon from "./assets/plus.png";
import deleteIcon from "./assets/delete.png"; // Tell Webpack this JS file uses this image
import editIcon from "./assets/edit.png";
import upIcon from "./assets/up.png";
import downIcon from "./assets/down.png";

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
      positionList: "",
      departmentContent: "",
      deptPosfields: null,
      addDepartmentPositionsBtn: <button type="button" style={{backgroundColor: "#8cb544", backgroundImage: "none", color: "white"}} className="btn btn-default btn-block register-save-btn" onClick={() => this.state.deptPosfields.push({})}><Translate id="com.tempedge.msg.label.addPos"></Translate></button>,
      showModal: false
    };
  }

  componentDidMount = () => {
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
  }

  // departmentModalEdit = async (deptIdx) => {
  //   console.log("departmentModalEdit");
  //
  //   let content = (
  //     <div>{deptIdx}</div>
  //   );
  //
  //   await this.setState(() => ({
  //     departmentContent: content
  //   }));
  //
  //   console.log("departmentContent: ", this.state.departmentContent);
  //
  //   this.toggleModalOnOff();   //Open Modal
  //
  //   console.log("showModal: ", this.state.showModal);
  // }

  renderClientDepartments = (formProps) => {
    let addDepartmentsBtn = (this.props.clientDepartments === undefined)? <p className="department-list-button center-block" onClick={() => formProps.fields.push({})}>Add Departments</p>: "";

    if(this.props.clientDepartments !== undefined && formProps.fields.length < 1){
      formProps.fields.push({});
    }

    let block = formProps.fields.map((salesPerson, index) => {
      let key = `department-${index}`;

      return(
        <div id={key} key={key}>
          <div className="btn-dept" style={(index > 0)? {marginTop: "1rem"}: {marginTop: 0}}>
            <a className="up-down-arrow pull-left" data-toggle="collapse" href={`#departments${index}`} role="button" aria-expanded="false" aria-controls={`departments${index}`}>
              <img src={downIcon} style={{width: 14, height: 11, display: "inline", marginLeft: 19}} alt="downIcon" />
            </a>
            <span>Department {index+1}</span>
            <span className="pull-right">
              <img src={editIcon} className="client-dpt-btn-edit-delete" style={{display: "inline"}} onClick={() => this.departmentModalEdit(index)} alt="editIcon" />
              <img src={deleteIcon} className="client-dpt-btn-edit-delete" style={{marginLeft:17 , marginRight: 29, display: "inline"}} onClick={() => formProps.fields.remove(index)} alt="deleteIcon" />
            </span>
          </div>

            <div className="collapse multi-collapse" id={`departments${index}`}>
              <div className="card card-body">
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
              </div>
            </div>
        </div>
      )
    });

    let deptsList  = (this.props.clientDepartments !== undefined)? block: "";
    let addDeptBtn = (this.props.clientDepartments !== undefined)? <span style={{marginTop: "3.2rem"}} className="center-block pull-right add-fieldArray-btn" onClick={() => formProps.fields.push({})}><img src={addIcon} alt="addIcon" /></span>: "";

    return(
      <React.Fragment>
        <div>
          { addDepartmentsBtn }
          { deptsList }
          { addDeptBtn }
        </div>
      </React.Fragment>
    );
  }

  renderDepartmentPositions = (formProps) => {
    this.setState(() => ({
      deptPosfields: formProps.fields
    }));

    if(this.props.departmentPositions !== undefined && formProps.fields.length < 1){
      formProps.fields.push({});
    }

    let block = formProps.fields.map((department, index) => {
      let key = `position-${index}`;

      return(
        <div id={key} key={key}>
          <div className="btn-dept" style={(index > 0)? {marginTop: "1rem"}: {marginTop: 0}}>
            <a className="up-down-arrow pull-left" data-toggle="collapse" href={`#departments${index}`} role="button" aria-expanded="false" aria-controls={`departments${index}`}>
              <img src={downIcon} style={{width: 14, height: 11, display: "inline", marginLeft: 19}} alt="downIcon" />
            </a>
            <span>Position {index+1}</span>
            <span className="pull-right">
              <img src={deleteIcon} className="client-dpt-btn-edit-delete" style={{marginLeft:17 , marginRight: 29, display: "inline"}} onClick={() => formProps.fields.remove(index)} alt="deleteIcon" />
            </span>
          </div>

            <div className="collapse multi-collapse" id={`departments${index}`}>
              <div className="card card-body">
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
              </div>
            </div>
        </div>
      )
    });

    let positionList  = (this.props.departmentPositions !== undefined)? block: "";

    return(
      <React.Fragment>
        <div>
          { positionList }
        </div>
      </React.Fragment>
    );
  }

  renderAddBtn = (formProps) => {
    let addDtpBtn = <p className="department-list-button center-block" onClick={() => this.renderDepartmentModal(formProps)}>Add Departments</p>;

    return addDtpBtn;
  }

  renderDepartmentModal = async () => {
    await this.setState(() => ({
      departmentContent: <Department positionList={this.state.positionList} setPositionList={this.setPositionList} addDepartmentPositionsBtn={this.state.addDepartmentPositionsBtn} closePanel={() => this.toggleModalOnOff()} />
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
          {page === 1 && <WizardCreateNewClientFirstPage  onSubmit={this.nextPage} renderAddBtn={this.renderAddBtn} renderClientDepartments={this.renderClientDepartments} renderDepartmentPositions={this.renderDepartmentPositions} setPositionList={this.setPositionList} setDepartmentList={this.setDepartmentList} departmentList={this.state.departmentList} {...this.props} />}
          {page === 2 && <WizardCreateNewClientSecondPage  previousPage={this.previousPage} onSubmit={this.nextPage} renderAddBtn={this.renderAddBtn} setDepartmentList={this.setDepartmentList} departmentList={this.state.departmentList} {...this.props} />}
          {page === 3 && <WizardCreateNewClientThirdPage   previousPage={this.previousPage} onSubmit={this.onSubmit} renderAddBtn={this.renderAddBtn} setDepartmentList={this.setDepartmentList} departmentList={this.state.departmentList} {...this.props} />}
          { modal }
        </div>
      </div>
    );
  }
}

CreateNewClient.propTypes = {
  getList: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired
}

let mapStateToProps = (state) => {
  console.log("state: ", state);
  let clientdepartments = "";
  let departmentpositions = "";

  if(state.form.CreateNewClient !== undefined){
    clientdepartments = (state.form.CreateNewClient.values !== undefined)? state.form.CreateNewClient.values.clientdepartments: undefined;
    departmentpositions = (state.form.CreateNewClient.values !== undefined)? state.form.CreateNewClient.values.departmentpositions: undefined;
  }else{
    clientdepartments = undefined;
    departmentpositions = undefined;
  }

  return({
    clientDepartments: clientdepartments,
    departmentPositions: departmentpositions
  });
}

export default withLocalize(connect(mapStateToProps, { notify, getList, reset  })(CreateNewClient));
