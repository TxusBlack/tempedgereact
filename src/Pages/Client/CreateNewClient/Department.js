import React from 'react';
import PropTypes from 'prop-types';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import { Field, reduxForm, change, initialize } from 'redux-form';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import Validate from '../../Validations/Validations';
import addIcon from "./assets/plus.png";
import deleteIcon from "./assets/delete.png"; // Tell Webpack this JS file uses this image
import editIcon from "./assets/edit.png";
import upIcon from "./assets/up.png";
import downIcon from "./assets/down.png";
import { saveToPositionsList, savePositionsList, saveDepartmentList } from "../../../Redux/actions/tempEdgeActions";
import { removeFromPositionList } from "../../../Redux/actions/tempEdgeActions";

//Department Modal re-init data
const reInitData = {
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

class Department extends React.Component{
  state={
    mounted: false,
    posArray: []
  }

  componentDidMount(){
    this.setState(() => ({
      mounted: true
    }));

    this.props.passBackRenderPositions(this.renderPositions);
  }

  increaseListSize = async () => {
    let departmentname = this.props.departmentname;
    let newDeptPos = {
      position: this.props.position,
      description: this.props.description,
      payRate: this.props.payRate,
      markup: this.props.markup,
      otmarkup: this.props.otmarkup,
      timeIn: this.props.timeIn,
      timeOut: this.props.timeOut,
      employeeContact: this.props.employeeContact,
      contactPhone: this.props.contactPhone,
    };

    await this.props.saveToPositionsList(newDeptPos);
    let reboot = reInitData;
    reboot.departmentname = departmentname;
    this.props.dispatch(initialize('CreateNewClient', reboot));

    this.renderPositions();
  }

  renderPositions = async () => {
    let deptPosList = this.props.deptPosList;
    console.log("deptPosList: ", deptPosList);
    console.log("this.props.editMode: ", this.props.editMode);
    let list = await deptPosList.map((position, index) => {
      let key = `positions-${index}`;

      return(
        <div id={key} key={key}>
          <div className="btn-dept" style={(index > 0)? {marginTop: "1rem"}: {marginTop: 0}}>
            <a className="up-down-arrow pull-left" data-toggle="collapse" href={`#positions${index}`} role="button" aria-expanded="false" aria-controls={`positions${index}`}>
              <img src={downIcon} style={{width: 14, height: 11, display: "inline", marginLeft: 19}} alt="downIcon" />
            </a>
            <span>{deptPosList[index].position}</span>
            <span className="pull-right">
              <img src={deleteIcon} className="client-dpt-btn-edit-delete" style={{marginLeft:17 , marginRight: 29, display: "inline"}} onClick={() => this.removeFromPosList(index)} alt="deleteIcon" />
            </span>
          </div>

            <div className="collapse multi-collapse show" id={`positions${index}`}>
              <div className="card card-body">
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th>Pay Rate</th>
                      <th>Markup</th>
                      <th>OT Markup</th>
                      <th>Employee Contact</th>
                      <th>Contact Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{(deptPosList[index] !== undefined)? deptPosList[index].payRate: ""}</td>
                      <td>{(deptPosList[index] !== undefined)? deptPosList[index].markup: ""}</td>
                      <td>{(deptPosList[index] !== undefined)? deptPosList[index].otmarkup: ""}</td>
                      <td>{(deptPosList[index] !== undefined)? deptPosList[index].employeeContact: ""}</td>
                      <td>{(deptPosList[index] !== undefined)? deptPosList[index].contactPhone: ""}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      )
    });

    this.setState(() => ({
      posArray: list
    }));
  }

  removeFromPosList = async (index) => {
    await this.props.removeFromPositionList(index);
    this.renderPositions();
  }

  renderClientDepts = () => {
    this.props.dispatch(change('CreateNewClient', 'departmentname', this.props.departmentname));

    if(this.props.editMode.edit){
      let newList = this.props.deptList;

      newList[this.props.editMode.index].departmentName = this.props.departmentname;
      this.props.saveDepartmentList(newList);
      this.props.renderClientDepartmentsList({repaint: true});
    }else{
      this.props.renderClientDepartmentsList({repaint: false});
    }

    this.closePanel();
  }

  closePanel = () => {
    this.props.closePanel();
    this.props.dispatch(initialize('CreateNewClient', reInitData));
  }

  render(){
    let positionsList = this.state.posArray;

    return(
      <div className="sign-up-wrapper" style={{margin: 0}}>
        <h2 className="text-center page-title-new-client" style={{padding: 0}}><Translate id="com.tempedge.msg.label.addDept"></Translate></h2>
        <div className="form-group row row-agency-name">
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-8" style={{paddingLeft: 15, paddingRight: 71}}>
                <label className="control-label"><Translate id="com.tempedge.msg.label.deptName"></Translate></label>
                <Field name="departmentname" type="text" placeholder="Department Name" category="client" component={InputBox} />
              </div>
            </div>
          </div>
        </div>
          <div className="panel-body" className="form-horizontal center-block" style={{paddingBottom: "15px"}}>
            <div className="row new-client-form">
              <div className="col-lg-8 client-col">
                <div className="create-client" style={{paddingBottom: 0, marginBottom: 0}}>
                  <div className="new-client-header">
                    <h2>Department Information</h2>
                  </div>

                  <div className="new-clients-contents">
                      <div className="client-contents">
                        <div className="form-group row">
                          <div className="col-md-6">
                            <label className="control-label"><Translate id="com.tempedge.msg.label.position"></Translate></label>
                            <Field name="position" type="text" placeholder="Enter Position" category="client" component={InputBox} />
                          </div>
                          <div className="col-md-6">
                            <label className="control-label"><Translate id="com.tempedge.msg.label.description"></Translate></label>
                            <Field name="description" type="text" placeholder="Enter Description" category="client" component={InputBox} />
                          </div>
                        </div>

                        <div className="form-group row">
                          <div className="col-md-6">
                            <label className="control-label"><Translate id="com.tempedge.msg.label.markup"></Translate></label>
                            <Field name="markup" type="text" placeholder="Enter Markup" category="client" component={InputBox} />
                          </div>
                          <div className="col-md-6">
                            <label className="control-label"><Translate id="com.tempedge.msg.label.OtMarkup"></Translate></label>
                            <Field name="otmarkup" type="text" placeholder="Enter OT Markup" category="client" component={InputBox} />
                          </div>
                        </div>

                        <div className="form-group row">
                          <div className="col-md-4">
                            <label className="control-label"><Translate id="com.tempedge.msg.label.payRate"></Translate></label>
                            <Field name="payRate" type="text" placeholder="Enter Pay Rate" category="client" component={InputBox} />
                          </div>
                          <div className="col-md-4">
                            <label className="control-label"><Translate id="com.tempedge.msg.label.billRate"></Translate></label>
                            <p>30</p>
                          </div>
                          <div className="col-md-4">
                            <label className="control-label"><Translate id="com.tempedge.msg.label.otBillRate"></Translate></label>
                            <p>15</p>
                          </div>
                        </div>

                        <div className="form-group row">
                          <div className="col-md-6">
                            <label className="control-label"><Translate id="com.tempedge.msg.label.regularSchedule"></Translate></label>
                            <Field name="timeIn" type="text" placeholder="Time In" category="client" component={InputBox} />
                          </div>
                          <div className="col-md-6">
                            <label className="control-label">&nbsp;</label>
                            <Field name="timeOut" type="text" placeholder="Time Out" category="person" component={InputBox} />
                          </div>
                        </div>

                        <div className="form-group row">
                          <div className="col-md-6">
                            <label className="control-label"><Translate id="com.tempedge.msg.label.employeeContact"></Translate></label>
                            <Field name="employeeContact" type="text" placeholder="Enter Employee Contact" category="client" component={InputBox} />
                          </div>
                          <div className="col-md-6">
                            <label className="control-label"><Translate id="com.tempedge.msg.label.contactPhone"></Translate></label>
                            <Field name="contactPhone" type="text" placeholder="Enter Contact Phone" category="client" component={InputBox} />
                          </div>
                        </div>
                      </div>
                      <div className="new-clients-footer">
                        <div className="prev-next-btns-agency row">
                          <div className="col-md-4">
                            <button type="button" style={{backgroundColor: "#8cb544", backgroundImage: "none", color: "white"}} className="btn btn-default btn-block register-save-btn" onClick={this.increaseListSize} disabled={this.props.addPosDisabled}><Translate id="com.tempedge.msg.label.addPos"></Translate></button>
                          </div>
                          <div className="col-md-4">
                            <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={this.closePanel}><Translate id="com.tempedge.msg.label.cancel"></Translate></button>
                          </div>
                          <div className="col-md-4">
                            {(!this.props.editMode.edit)? <button type="button" className="btn btn-primary btn-block register-save-btn next" onClick={this.renderClientDepts}><Translate id="com.tempedge.msg.label.addDept"></Translate></button>: <button className="btn btn-primary btn-block register-save-btn next" onClick={this.renderClientDepts}><Translate id="com.tempedge.msg.label.save"></Translate></button>}
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 dept-col">
                <div className="department-list" style={{paddingBottom: 0, marginBottom: 0}}>
                  <div className="department-list-header">
                    <h2>Position List</h2>
                  </div>

                  <div className="department-list-contents">
                    <div>
                      <div style={{height: 10}}></div>
                      {positionsList.map((position, index) => {
                        return <div>{position}</div>
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }
}

Department.propTypes = {
  savePositionsList: PropTypes.func.isRequired,
  saveToPositionsList: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
  removeFromPositionList: PropTypes.func.isRequired,
  saveDepartmentList: PropTypes.func.isRequired
}

Department = reduxForm({
  form: 'CreateNewClient', //                 <------ form name
  destroyOnUnmount: false, //        <------ preserve form data
  // forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate: Validate
})(Department);

let mapStateToProps = (state) => {
  let departmentname = "";
  let position = "";
  let description = "";
  let payRate = "";
  let markup = "";
  let otmarkup = "";
  let timeIn = "";
  let timeOut = "";
  let employeeContact = "";
  let contactPhone = "";
  let addDeptDisabled = true;
  let addPosDisabled = true;

  if(state.form.CreateNewClient !== undefined){
    if(state.form.CreateNewClient.values !== undefined){
      let formState = state.form.CreateNewClient.values;
      addDeptDisabled = (formState.departmentname === "" || formState.payRate === "" || formState.markup === "" || formState.otmarkup === "" || formState.employeeContact === "" || formState.contactPhone === "")? true: false;
      addPosDisabled = (formState.departmentname === "" || formState.payRate === "" || formState.markup === "" || formState.otmarkup === "" || formState.employeeContact === "" || formState.contactPhone === "")? true: false;
      departmentname = formState.departmentname;
      position = formState.position;
      description = formState.description;
      payRate = formState.payRate;
      markup = formState.markup;
      otmarkup = formState.otmarkup;
      timeIn = formState.timeIn;
      timeOut = formState.timeOut;
      employeeContact = formState.employeeContact;
      contactPhone = formState.contactPhone;
    }
  }

  return({
    deptList: (state.tempEdge.deptList !== undefined)? state.tempEdge.deptList: [],
    deptPosList: state.tempEdge.deptPosList,
    departmentname: departmentname,
    position: position,
    description: description,
    payRate: payRate,
    markup: markup,
    otmarkup: otmarkup,
    timeIn: timeIn,
    timeOut: timeOut,
    employeeContact: employeeContact,
    contactPhone: contactPhone,
    addDeptDisabled: addDeptDisabled,
    addPosDisabled: addPosDisabled
  });
}

export default withLocalize(connect(mapStateToProps, { savePositionsList, saveToPositionsList, saveDepartmentList, change, initialize, removeFromPositionList })(Department));
