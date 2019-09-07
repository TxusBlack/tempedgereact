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
import { FieldArray } from 'redux-form';
import addIcon from "./assets/plus.png";
import deleteIcon from "./assets/delete.png"; // Tell Webpack this JS file uses this image
import editIcon from "./assets/edit.png";
import upIcon from "./assets/up.png";
import downIcon from "./assets/down.png";
import { removeFromPositionList } from "../../../Redux/actions/tempEdgeActions";

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
      deptsList: "",
      addDeptBtn: "",
      renderAddBtnDirty: false,
      positionList: "",
      departmentContent: "",
      deptPosfields: null,
      addDepartmentPositionsBtn: "",
      showModal: false
    };
  }

  componentDidMount = async() => {
    this.props.getList('/api/country/listAll', GET_COUNTRY_REGION_LIST);
    this.props.getList('/api/funding/listAll', GET_FUNDING_LIST);
    await this.setDepartmentList(<FieldArray name="clientdepartments" type="text" component={this.renderClientDepartments} />);
    //await this.setPositionList(<MyFieldArray name="departmentpositions" component={this.renderDepartmentPositions} />);
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

  renderClientDepartments_ = async (formProps) => {
    let addDepartmentsBtn = (this.props.clientDepartments === undefined)? <p className="department-list-button center-block" onClick={() => this.renderDepartmentModal(formProps) }>Add Departments</p>: "";
    let addDeptBtn = (this.props.clientDepartments !== undefined)? <span style={{marginTop: "3.2rem"}} className="center-block pull-right add-fieldArray-btn" onClick={() => formProps.fields.push({})}><img src={addIcon} alt="addIcon" /></span>: "";
    let deptList = this.props.departmentList;
    let list = await deptList.map((position, index) => {
      let key = `departments-${index}`;

      return(
        <div id={key} key={key}>
          <div className="btn-dept" style={(index > 0)? {marginTop: "1rem"}: {marginTop: 0}}>
            <a className="up-down-arrow pull-left" data-toggle="collapse" href={`#departments${index}`} role="button" aria-expanded="false" aria-controls={`departments${index}`}>
              <img src={downIcon} style={{width: 14, height: 11, display: "inline", marginLeft: 19}} alt="downIcon" />
            </a>
            <span>{this.props.departmentname}</span>
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

    this.setState(() => ({
      departmentList: list,
      addDepartmentsBtn: addDepartmentsBtn,
      addDeptBtn: addDeptBtn
    }));
  }

  renderClientDepartments = (formProps) => {
    console.log("IM ALIVE!")
    this.renderDepartmentModal();
    let block = (
      <div id={`afsf`} key={`dasdf`}>
        <div className="btn-dept" style={{marginTop: 0}}>
          <a className="up-down-arrow pull-left" data-toggle="collapse" href={`#departments${0}`} role="button" aria-expanded="false" aria-controls={`departments${0}`}>
            <img src={downIcon} style={{width: 14, height: 11, display: "inline", marginLeft: 19}} alt="downIcon" />
          </a>
          <span>Department {0+1}</span>
          <span className="pull-right">
            <img src={editIcon} className="client-dpt-btn-edit-delete" style={{display: "inline"}} onClick={() => this.departmentModalEdit(0)} alt="editIcon" />
            <img src={deleteIcon} className="client-dpt-btn-edit-delete" style={{marginLeft:17 , marginRight: 29, display: "inline"}} onClick={() => {}} alt="deleteIcon" />
          </span>
        </div>

          <div className="collapse multi-collapse" id={`departments${0}`}>
            <div className="card card-body">
              Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
            </div>
          </div>
      </div>
    )

    let deptsList  = block;
    let addDeptBtn = <span style={{marginTop: "3.2rem"}} className="center-block pull-right add-fieldArray-btn" onClick={() => {}}><img src={addIcon} alt="addIcon" /></span>;

    this.setState(() => ({
      deptsList: deptsList,
      addDeptBtn: addDeptBtn
    }));
  }

  addToDeptList = (formProps) => {
    formProps.fields.push({});
  }

  renderAddBtn = () => {
    let addDtpBtn = <p className="department-list-button center-block" onClick={() => this.renderClientDepartments()}>Add Departments</p>;

    return addDtpBtn;
  }

  renderDepartmentModal = async () => {
    console.log("OPEN MODAL!");
    await this.setState(() => ({
      departmentContent: <Department closePanel={() => this.toggleModalOnOff()} />,
      renderAddBtnDirty: true
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
          {page === 1 && <WizardCreateNewClientFirstPage  onSubmit={this.nextPage} renderAddBtn={this.renderAddBtn} renderAddBtnDirty={this.state.renderAddBtnDirty} deptsList={this.state.deptsList} addDeptBtn={this.state.addDeptBtn} {...this.props} />}
          {page === 2 && <WizardCreateNewClientSecondPage  previousPage={this.previousPage} onSubmit={this.nextPage} renderAddBtn={this.renderAddBtn} renderAddBtnDirty={this.state.renderAddBtnDirty} deptsList={this.state.deptsList} addDeptBtn={this.state.addDeptBtn} {...this.props} />}
          {page === 3 && <WizardCreateNewClientThirdPage   previousPage={this.previousPage} onSubmit={this.onSubmit} renderAddBtn={this.renderAddBtn} renderAddBtnDirty={this.state.renderAddBtnDirty} deptsList={this.state.deptsList} addDeptBtn={this.state.addDeptBtn} {...this.props} />}
          { modal }
        </div>
      </div>
    );
  }
}

CreateNewClient.propTypes = {
  getList: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  removeFromPositionList: PropTypes.func.isRequired
}

let mapStateToProps = (state) => {
  let departmentname = "";

  if(state.form.CreateNewClient !== undefined){
    if(state.form.CreateNewClient.values !== undefined){
      departmentname = (typeof state.tempEdge.deptPosList!== 'undefined')? state.tempEdge.deptPosList[0].departmentname: "";
    }
  }

  return({
    departmentname: departmentname
  });
}

export default withLocalize(connect(mapStateToProps, { notify, getList, reset, removeFromPositionList  })(CreateNewClient));
