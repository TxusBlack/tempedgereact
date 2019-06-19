import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Field, FieldArray, reduxForm } from 'redux-form';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import Dropdown from '../../../components/common/Dropdown/Dropdown.js';
import DropdownList from 'react-widgets/lib/DropdownList';      //DO NOT REMOVE or it will break
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Validate from '../../Validations/Validations';
import deleteIcon from "./assets/delete.png"; // Tell Webpack this JS file uses this image
import addIcon from "./assets/plus.png";

class WizardCreateNewUserFirstPage extends Component{
  constructor(props){
    super(props);

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  state= { mounted: false }

  componentDidMount(){
    this.setState(() => ({
      mounted: true
    }));
  }

  componentDidUpdate(prevProps, prevState){
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if(hasActiveLanguageChanged){
      this.props.push(`/createClient/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  renderError(formProps){
    let fieldId='';

    if(typeof formProps.input !== 'undefined'){
      if(formProps.index != null || typeof formProps.index != 'undefined' || formProps.index !== ''){
        if(formProps.input.name.indexOf("recruitmentofficesalespersons") !== -1){
           if(formProps.input.name.indexOf("salespersonfirstname") !== -1){
             fieldId = `com.tempedge.error.person.firstNamerequired`;
           }else if(formProps.input.name.indexOf("salespersonlastname") !== -1){
             fieldId = `com.tempedge.error.person.lastNamerequired`;
           }else if(formProps.input.name.indexOf("salespersongenre") !== -1){
             fieldId = `com.tempedge.error.person.genderrequired`;
           }else if(formProps.input.name.indexOf("salespersonphonenumber") !== -1){
             fieldId = `com.tempedge.error.phonenumberrequired`;
          }
        }
      }

      if(formProps.meta.touched && formProps.meta.error && typeof formProps.meta.error !== 'undefined'){
        return(
          <p style={{color: '#a94442'}}><Translate id={fieldId}>{formProps.meta.error}</Translate></p>
        );
      }
    }
  }

  renderClientDepartments = (formProps) => {
    let addDepartmentsBtn = (this.props.clientDepartments === undefined)? <span className="department-list-button center-block" onClick={() => formProps.fields.push({})}>Add Departments</span>: "";
    
    let block = formProps.fields.map((salesPerson, index) => (
      <div key={index}>
        <p>
          <a className="btn btn-primary btn-dept" data-toggle="collapse" href={`#departments${index}`} role="button" aria-expanded="false" aria-controls={`departments${index}`}>Department {index+1}</a>
        </p>

          <div className="collapse multi-collapse" id={`departments${index}`}>
            <div className="card card-body">
              Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
            </div>
          </div>

      </div>
    ));

    let deptsList  = (this.props.clientDepartments !== undefined)? block: "";
    let addDeptBtn = (this.props.clientDepartments !== undefined)? <span className="center-block pull-right add-fieldArray-btn" onClick={() => formProps.fields.push({})}><img src={addIcon} alt="addIcon" /></span>: "";

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

  render(){
    let salesmen = ["Paco", "Joaquin", "Alvaro", "Tom"];
    let payrollCycle = ["1", "2", "3", "4"];
    let departments = <FieldArray name="clientdepartments" type="text" component={this.renderClientDepartments} />;

    return(
      <div className="sign-up-wrapper" style={{margin: 0}} ref="createNewUser1">
        <h2 className="text-center page-title-new-client"><Translate id="com.tempedge.msg.label.createNewClient"></Translate></h2>
        <div className="row new-client-form">
          <form className="panel-body" onSubmit={this.props.handleSubmit} className="form-horizontal center-block" style={{paddingBottom: "0px"}}>
            <div className="col-lg-8 client-col">
              <div className="create-client">
                <div className="new-client-header">
                  <h2>Create Client</h2>
                </div>

                <div className="new-clients-contents">

                    <div className="client-contents">
                      <div className="form-group row">
                        <div className="col-md-4">
                          <label className="control-label"><Translate id="com.tempedge.msg.label.company"></Translate></label>
                          <Field name="company" type="text" placeholder="Enter Company" category="client" component={InputBox} />
                        </div>
                        <div className="col-md-4">
                          <label className="control-label"><Translate id="com.tempedge.msg.label.salesman"></Translate></label>
                          <Field name="salesman" data={salesmen} valueField="value" textField="salesman" category="client" component={Dropdown} />
                        </div>
                        <div className="col-md-4">
                          <label className="control-label"><Translate id="com.tempedge.msg.label.payrollCycle"></Translate></label>
                          <Field name="payrollCycle" data={payrollCycle} valueField="value" textField="payrollCycle" category="client" component={Dropdown} />
                        </div>
                      </div>

                      <div className="form-group row">
                        <div className="col-md-4">
                          <label className="control-label"><Translate id="com.tempedge.msg.label.workCompCode"></Translate></label>
                          <Field name="workCompCode" type="text" placeholder="Enter Work Comp Code" category="client" component={InputBox} />
                        </div>
                        <div className="col-md-4">
                          <label className="control-label"><Translate id="com.tempedge.msg.label.workCompRate"></Translate></label>
                          <Field name="workCompRate" type="text" placeholder="Enter Work Comp Rate" category="client" component={InputBox} />
                        </div>
                        <div className="col-md-4">
                          <label className="control-label"><Translate id="com.tempedge.msg.label.companyInitials"></Translate></label>
                          <Field name="companyInitials" type="text" placeholder="Enter Company Initials" category="client" component={InputBox} />
                        </div>
                      </div>

                      <div className="form-group row">
                        <div className="col-md-4">
                          <label className="control-label"><Translate id="com.tempedge.msg.label.attnTo"></Translate></label>
                          <Field name="attnTo" type="text" placeholder="Enter Attn to" category="client" component={InputBox} />
                        </div>
                        <div className="col-md-4">
                          <label className="control-label"><Translate id="com.tempedge.msg.label.email"></Translate></label>
                          <Field name="email" type="text" placeholder="Enter Email" category="person" component={InputBox} />
                        </div>
                        <div className="col-md-4">
                          <label className="control-label"><Translate id="com.tempedge.msg.label.comments"></Translate></label>
                          <Field name="comments" type="text" placeholder="Enter Comments" category="client" component={InputBox} />
                        </div>
                      </div>

                      <div className="form-group row bottom-row">
                        <div className="col-md-4">
                          <label className="control-label"><Translate id="com.tempedge.msg.label.markup"></Translate></label>
                          <Field name="markup" type="text" placeholder="Enter Markup" category="client" component={InputBox} />
                        </div>
                        <div className="col-md-4">
                          <label className="control-label"><Translate id="com.tempedge.msg.label.OtMarkup"></Translate></label>
                          <Field name="otMarkup" type="text" placeholder="Enter OT Markup" category="client" component={InputBox} />
                        </div>
                      </div>
                    </div>
                    <div className="new-clients-footer">
                      <div className="prev-next-btns-agency">
                        <div className="col-md-4 col-md-offset-2">
                          <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={this.props.previousPage}>Back</button>
                        </div>
                        <div className="col-md-4">
                          <button type="submit" className="btn btn-primary btn-block register-save-btn next" disabled={this.props.invalid || this.props.pristine}><Translate id="com.tempedge.msg.label.next">Next</Translate></button>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 dept-col">
              <div className="department-list">
                <div className="department-list-header">
                  <h2>Department List</h2>
                </div>

                <div className="department-list-contents">
                  <div style={{height: "2.9rem"}}></div>
                  { departments }
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

WizardCreateNewUserFirstPage = reduxForm({
  form: 'CreateNewClient', //                 <------ form name
  destroyOnUnmount: false, //        <------ preserve form data
  // forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate: Validate
})(WizardCreateNewUserFirstPage);

let mapStateToProps = (state) => {
  let clientdepartments = "";

  if(state.form.CreateNewClient !== undefined){
    clientdepartments = (state.form.CreateNewClient.values !== undefined)? state.form.CreateNewClient.values.clientdepartments: undefined
  }else{
    clientdepartments = undefined;
  }

  return({
    clientDepartments: clientdepartments
  });
}

export default withLocalize(connect(mapStateToProps, { push })(WizardCreateNewUserFirstPage));
