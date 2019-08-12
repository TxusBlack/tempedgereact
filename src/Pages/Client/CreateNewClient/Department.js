import React from 'react';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import Validate from '../../Validations/Validations';
import addIcon from "./assets/plus.png";
import deleteIcon from "./assets/delete.png"; // Tell Webpack this JS file uses this image
import editIcon from "./assets/edit.png";
import upIcon from "./assets/up.png";
import downIcon from "./assets/down.png";

class Department extends React.Component{
  componentDidMount(){
    this.setState(() => ({
      mounted: true
    }));
  }

  render(){
    console.log("this.props.addDepartmentPositionsBtn: ", this.props.addDepartmentPositionsBtn);
    return(
      <div className="sign-up-wrapper" style={{margin: 0}}>
        <h2 className="text-center page-title-new-client" style={{padding: 0}}><Translate id="com.tempedge.msg.label.addDept"></Translate></h2>
        <div className="form-group row row-agency-name">
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-8" style={{paddingLeft: 15, paddingRight: 71}}>
                <label className="control-label"><Translate id="com.tempedge.msg.label.deptName"></Translate></label>
                <Field name="departmentname" type="text" placeholder="Department Name" component={InputBox} />
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
                            {this.props.addDepartmentPositionsBtn}
                          </div>
                          <div className="col-md-4">
                            <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={this.props.closePanel}><Translate id="com.tempedge.msg.label.cancel"></Translate></button>
                          </div>
                          <div className="col-md-4">
                            <button type="button" className="btn btn-primary btn-block register-save-btn next" disabled={this.props.invalid || this.props.pristine}><Translate id="com.tempedge.msg.label.addDept"></Translate></button>
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
                        { this.props.positionList }
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

Department = reduxForm({
  form: 'CreateNewClient', //                 <------ form name
  destroyOnUnmount: true, //        <------ preserve form data
  // forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate: Validate
})(Department);

export default withLocalize(connect(null, {})(Department));
