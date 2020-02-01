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
import { saveDepartmentList, saveBillRates } from "../../../Redux/actions/tempEdgeActions";
import { SAVE_BILL_RATE, SAVE_OT_BILL_RATE } from '../../../Redux/actions/types.js';

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
	contactPhone:"",
	posList: [],
	billRate: 0,
	otBillRate: 0
}

class Department extends React.Component{
  state={
    mounted: false,
    posArray: []
  }

  componentDidMount = async () => {
		let positionsList = [];

		if(typeof this.props.deptPosList !== 'undefined' && this.props.deptPosList.length > 0){
			positionsList = await this.props.deptPosList.map((pos, index) => {
				return pos;
			});
		}else{
			this.props.change("CreateNewClient", "departmentname", "");
		}

    await this.setState(() => ({
      mounted: true,
			posList: positionsList
    }));

		this.renderPositions();
  }

	componentWillReceiveProps = (nextProps) => {
		if(!Number.isNaN(nextProps.markup) && !Number.isNaN(nextProps.otmarkup) && !Number.isNaN(nextProps.payRate)){
			let billRate = this.calculateBillRates(this.props.payRate, this.props.markup, 'billRate');
			let otBillRate = this.calculateBillRates(this.props.payRate, this.props.markup, 'otBillRate');

			this.props.saveBillRates(billRate, SAVE_BILL_RATE);
			this.props.saveBillRates(otBillRate, SAVE_OT_BILL_RATE);

			this.setState(() => ({
				billRate: billRate,
				otBillRate: otBillRate
			}));
		}
	}

  increaseListSize = async () => {
    let departmentname = this.props.departmentname;
    let newDeptPos = {
			bill: this.state.billRate.toFixed(2),
      name: this.props.position,
      description: this.props.description,
      pay: this.props.payRate,
      markUp: this.props.markup,
      otMarkUp: this.props.otmarkup,
      timeIn: this.props.timeIn,
      timeOut: this.props.timeOut,
      contactName: this.props.employeeContact,
      contactPhone: this.props.contactPhone,
    };

		let deptPosList = this.state.posList;

		deptPosList.push(newDeptPos);
		this.setState(() => ({
			posList: deptPosList
		}));

    let reboot = reInitData;
    reboot.departmentname = departmentname;
		let objSize = Object.keys(this.props.formValues).length;
		let counter = 0;

		for (let prop in this.props.formValues) {
			if(prop === "position" || prop === "description" || prop === "markup" || prop === "otmarkup" || prop === "payRate" || prop === "timeIn" || prop === "timeOut" || prop === "employeeContact" || prop === "contactPhone"){
				reboot[prop] = "";
			}else{
				reboot[prop] = this.props.formValues[prop];
			}

			if(counter === objSize-1){
				this.props.dispatch(initialize('CreateNewClient', reboot));
				this.renderPositions();
			}

			counter++;
		}
  }

  renderPositions = async () => {
    let deptPosList = this.state.posList;

    let list = await deptPosList.map((position, index) => {
      let key = `positions-${index}`;

      return(
        <div id={key} key={key}>
          <div className="btn-dept" style={(index > 0)? {marginTop: "1rem"}: {marginTop: 0}}>
            <a className="up-down-arrow pull-left" data-toggle="collapse" href={`#positions${index}`} role="button" aria-expanded="false" aria-controls={`positions${index}`}>
              <img src={downIcon} style={{width: 14, height: 11, display: "inline", marginLeft: 19}} alt="downIcon" />
            </a>
            <span>{deptPosList[index].name}</span>
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
                      <td>{(deptPosList[index] !== undefined)? deptPosList[index].pay: ""}</td>
                      <td>{(deptPosList[index] !== undefined)? deptPosList[index].markUp: ""}</td>
                      <td>{(deptPosList[index] !== undefined)? deptPosList[index].otMarkUp: ""}</td>
                      <td>{(deptPosList[index] !== undefined)? deptPosList[index].contactName: ""}</td>
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
		let deptPosList = this.state.posList;
		deptPosList.splice(index, 1);

		await this.setState(() => ({
			posList: deptPosList
		}));

    this.renderPositions();
  }

  renderClientDepts = async () => {
		this.props.resetInitData();
    this.props.dispatch(change('CreateNewClient', this.props.reInitData));
		let departmentname = this.props.departmentname;
		let newPosList = this.state.posList;
		let newDeptList = this.props.deptList;

    if(this.props.editMode.edit){
      newDeptList[this.props.editMode.index].departmentName = this.props.departmentname;
			newDeptList[this.props.editMode.index].positions = newPosList

      await this.props.saveDepartmentList(newDeptList);
      this.props.renderClientDepartmentsList({repaint: true});
    }else{
      newDeptList.push({
        name: departmentname,
				orgId: 1,
        positions: newPosList
      });

      await this.props.saveDepartmentList(newDeptList);

      this.props.renderClientDepartmentsList({repaint: false});
    }

    this.closePanel();
  }

  closePanel = () => {
    this.props.closePanel();
		this.props.resetInitData();
    this.props.dispatch(initialize('CreateNewClient', this.props.reInitData));
  }

	calculateBillRates = (payRate, markup, op) => {
		if(op === 'billRate'){
			return (payRate*((markup/100) + 1));
		}else{
			return ((payRate*((markup/100) + 1)) * 1.5);
		}
	}

  render(){
    let positionsList = this.state.posArray;
		let billRate = this.calculateBillRates(this.props.payRate, this.props.markup, 'billRate');
		let otBillRate = this.calculateBillRates(this.props.payRate, this.props.markup, 'otBillRate');
		let addPosBtnDisabled = (this.props.payRate === '' || this.props.markup === '' || this.props.otmarkup === '')? true: false;
		let addDeptDisabled = (positionsList.length > 0 && this.props.departmentname !== '')? false: true;

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
                            <p style={{fontSize: 13}}>{(Number.isNaN(billRate))? "": billRate.toFixed(2)}</p>
                          </div>
                          <div className="col-md-4">
                            <label className="control-label"><Translate id="com.tempedge.msg.label.otBillRate"></Translate></label>
                            <p style={{fontSize: 13}}>{(Number.isNaN(otBillRate))? "": otBillRate.toFixed(2)}</p>
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
                            <button type="button" style={{backgroundColor: "#8cb544", backgroundImage: "none", color: "white"}} className="btn btn-default btn-block register-save-btn" onClick={this.increaseListSize} disabled={addPosBtnDisabled}><Translate id="com.tempedge.msg.label.addPos"></Translate></button>
                          </div>
                          <div className="col-md-4">
                            <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={this.closePanel}><Translate id="com.tempedge.msg.label.cancel"></Translate></button>
                          </div>
                          <div className="col-md-4">
                            {(!this.props.editMode.edit)? <button type="button" className="btn btn-primary btn-block register-save-btn next" onClick={this.renderClientDepts} disabled={addDeptDisabled}><Translate id="com.tempedge.msg.label.addDept"></Translate></button>: <button className="btn btn-primary btn-block register-save-btn next" onClick={this.renderClientDepts} disabled={addDeptDisabled}><Translate id="com.tempedge.msg.label.save"></Translate></button>}
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

                  <div className="position-list-contents">
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
  change: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
  saveDepartmentList: PropTypes.func.isRequired,
	saveBillRates: PropTypes.func.isRequired
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
      departmentname = (typeof formState.departmentname === 'undefined')? "":  formState.departmentname;
      position = (typeof formState.position === 'undefined')? "": formState.position;
      description = (typeof formState.description === 'undefined')? "": formState.description;
      payRate = (typeof formState.payRate === 'undefined')? "": formState.payRate;
      markup = (typeof formState.markup === 'undefined')? "": formState.markup;
      otmarkup = (typeof formState.otmarkup === 'undefined')? "": formState.otmarkup;
      timeIn = (typeof formState.timeIn === 'undefined')? "" : formState.timeIn;
      timeOut = (typeof formState.timeOut === 'undefined')? "": formState.timeOut;
      employeeContact = (typeof formState.employeeContact === 'undefined')? "": formState.employeeContact;
      contactPhone = (typeof formState.contactPhone === 'undefined')? "": formState.contactPhone;
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
    addPosDisabled: addPosDisabled,
		formValues: (typeof state.form.CreateNewClient !== 'undefined')? state.form.CreateNewClient.values: ""
  });
}

export default withLocalize(connect(mapStateToProps, { saveDepartmentList, change, initialize, saveBillRates })(Department));
