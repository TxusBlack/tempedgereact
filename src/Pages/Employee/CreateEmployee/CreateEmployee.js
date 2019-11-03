import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import { Translate, withLocalize } from 'react-localize-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { date } from 'redux-form-validators';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import Dropdown from '../../../components/common/Dropdown/Dropdown.js';
import DropdownList from 'react-widgets/lib/DropdownList';      //DO NOT REMOVE or it will break
import DateTime from '../../../components/common/DateTimePicker/DateTimePicker.js';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';  //DO NOT REMOVE or it will break
import moment from 'moment';
import momentLocaliser from 'react-widgets-moment';
import { connect } from 'react-redux';
import { getList, getListSafe, validatePerson } from '../../../Redux/actions/tempEdgeActions';
import { GET_COUNTRY_REGION_LIST, SKILLS_LIST } from '../../../Redux/actions/types.js';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import CountryRegionParser from '../../../components/common/CountryRegionParser/CountryRegionParser.js';
import PaginatedTable from '../../../components/common/Table/PaginatedTable.js';
import { tempedgeAPI } from '../../../Redux/actions/tempEdgeActions';
import Container from '../../../components/common/Container/Container';
import Form from 'react-bootstrap/Form';
import Stepper from 'react-stepper-horizontal';
import Validate from '../../Validations/Validations';

const $ = window.$;

momentLocaliser(moment);

class CreateEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage :3,
            country_list: [],
            regionsList: [],
            steps: [
                {title: ""},
                {title: ""},
                {title: ""},
                {title: ""}
              ],
            genders: [],
            mounted: false,
            getCountryList: false,
            countryListRendered: 0,
            drugTest: [],
            backgroundTest: [],
            documents: null,
            resume: null,
            maritalStatus: []
        }

        this.addTranslationsForActiveLanguage();
    }

    componentDidMount = async() => {
      await this.props.getList('/api/country/listAll', GET_COUNTRY_REGION_LIST);
      let parent = $(ReactDOM.findDOMNode(this.refs.createNewEmployee1));
      parent.closest(".tabs-stepper-wrapper").css("max-width", "1600px");

      await this.props.getListSafe("/api/person/skillList", { "orgId" : 1 },  SKILLS_LIST);

      this.setState(() => ({
        mounted: true
      }));
    }

    componentDidUpdate = async (prevProps, prevState) => {
      if(this.state.getCountryList === false){
        if(typeof this.props.country_region_list !== 'undefined'){
          this.setState(() => ({
            getCountryList: true
          }));
        }
      }

      if(this.state.getCountryList && this.state.countryListRendered < 1){
        let list = await CountryRegionParser.getCountryList(this.props.country_region_list).country_list;
        let regionsList = await CountryRegionParser.getRegionList(this.props.country_region_list, "United States");
        let states = await regionsList.map((state, index) => {
          return state.name;
        });

        this.setState(() => ({
          countryListRendered: this.state.countryListRendered+1,
          country_list: list,
          regionsList: states
        }));
      }

      let hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

      if(hasActiveLanguageChanged){
        this.props.push(`/employee/create/${this.props.activeLanguage.code}`);
        this.addTranslationsForActiveLanguage();
      }
    }

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

      if(this.state.mounted && gendersTranslate.length !== 0){
        await this.setState(() => ({
          genders: gendersTranslate,
          drugTest: drugTest,
          backgroundTest: backgroundTest,
          maritalStatus: maritalStatus
        }));
      }
    }

    onChange = (file, ref) => {
      let readOnlyTextBox = $(ReactDOM.findDOMNode(this.refs[ref]));
      let fileName = file.name.replace(/\\/g, '/').replace(/.*\//, '');

      readOnlyTextBox.text(fileName);

      let reader = new FileReader();

      reader.readAsBinaryString(file);    //Read Blob as binary

      //Event Listener for when a file is selected to be uploaded
      reader.onload = (event) => { //(on_file_select_event)
        let data = event.target.result;   //'result' if not 'null', contains the contents of the file as a binary string
        let stateName = (ref === "fileInputDocuments")? "documents": "resume";

        /* Update state */
        this.setState(() => ({
          [stateName]: data
        }));
      };
    }

    onSubmit = async (formValues) => {
      console.log("formValues: ", formValues);
      console.log("documents: ", this.state.documents);
      console.log("resume: ", this.state.resume);

      let data = {
              "orgId" : 1,
             "address" : "22",
             "address2" : "",
             "backgroundTestDate" : "2019-06-06",
             "backgroundtest" : true,
             "birthDay" : "1919-06-06",
             "cellPhone" : "12345678",
             "city" : "CITY",
             "country" : 19,
             "drugTest" : false,
             "drugTestDate" : "2019-01-01",
             "email" : "test1@test.com",
             "empDepartment" : 249,
             "firstName" : "LOREN",
             "gender" : "M",
             "hireDate" : "2019-01-02",
             "identification" : "123-30-2333",
             "lastName" : "WOODSON",
             "maritalStatus" : 0,
             "middleName" : "A",
             "phone" : "",
             "region" : "" ,
             "temporalInfo" : false,
             "usrCreatedBy" : 2,
             "zipcode" : "07095",
             "personType" : {
              "personTypeId" : 2
             }
           };

      let paginatedTable = <PaginatedTable apiUrl="/api/person/validate" payload={data} title="com.tempedge.msg.label.validatedpersonlist"/>

    }

    render() {
        let key = this.state.key;
        let sortedSkillList = undefined;

        if(typeof this.props.skillsList !== 'undefined' && Array.isArray(this.props.skillsList)){
          sortedSkillList = this.props.skillsList.sort((a, b) => {
            let x = a.skill;
            let y = b.skill;

            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
          });
        }

        let drugTestDate = (
          <div style={{width: "80%", margin: "auto"}}>
            <label className="control-label" style={{marginBottom: 5}}><Translate id="com.tempedge.msg.label.date" /></label>
            <Field name="drugTestDate" type="text" placeholder="Drug Test Date" category="person" component={DateTime} validate={date()}/>
          </div>
        );

        let backgroundTestDate = (
            <div style={{width: "80%", margin: "auto"}}>
              <label className="control-label" style={{marginBottom: 5}}><Translate id="com.tempedge.msg.label.date" /></label>
              <Field name="backgroundTestDate" type="text" placeholder="Background Test Date" category="person" component={DateTime} validate={date()}/>
            </div>
          );

        return (
            <React.Fragment>
              <Stepper steps={ this.state.steps } activeStep={ key } activeColor="#eb8d34" completeColor="#8cb544" defaultBarColor="#eb8d34" completeBarColor="#8cb544" barStyle="solid" circleFontSize={16} />

              <div className="tabs-stepper-wrapper register-form-panel-inputs" ref="createNewEmployee1" style={{margin: "auto"}}>
                <div className="formPanel">
                    <Form className="panel-body form-horizontal center-block" onSubmit={this.props.handleSubmit(this.onSubmit)}>
                      <ul className="nav nav-panel">
                          <li className="nav-item first-panel " onClick={()=>this.setState({key:0})}>
                              <a className="nav-link active" data-toggle="tab" href="#tab1">Info</a>
                          </li>
                          <li className="nav-item panel" onClick={()=>this.setState({key:1})}>
                              <a className="nav-link" data-toggle="tab" href="#tab2">Contact</a>
                          </li>
                          <li className="nav-item panel" onClick={()=>this.setState({key:2})}>
                              <a className="nav-link" data-toggle="tab" href="#tab4">Skills</a>
                          </li>
                          <li className="nav-item last-panel" onClick={()=>this.setState({key:3})}>
                              <a className="nav-link" data-toggle="tab" href="#tab6">Misc</a>
                          </li>
                      </ul>

                      <div className="tab-content formPanelBody" style={{background: "#ffff"}}>
                          <div className="tab-pane fade show active" id="tab1" role="tabpanel">
                              <div className="form-group row">
                                  <div className="col-10 col-md-5 col-lg-4">
                                    <label className="control-label"><Translate id="com.tempedge.msg.label.tempdata" /></label>
                                    <Field name="temporarydata" type="text" placeholder="Temporary Data" category="person" component={InputBox} />
                                  </div>
                                  <div className="col-10 col-md-5 col-lg-4">
                                    <label className="control-label"><Translate id="com.tempedge.msg.label.office" /></label>
                                    <Field name="office" type="text" placeholder="Office" category="person" component={InputBox} />
                                  </div>
                                  <div className="col-10 col-md-5 col-lg-4">
                                    <label className="control-label"><Translate id="com.tempedge.msg.label.department" /></label>
                                    <Field name="department" type="text" placeholder="Deparment" category="person" component={InputBox} />
                                  </div>
                              </div>
                              <div className="form-group row">
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label"><Translate id="com.tempedge.msg.label.ssnonly" /></label>
                                      <Field name="ssn" type="text" placeholder="SSN" category="person" component={InputBox} />
                                  </div>
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label"><Translate id="com.tempedge.msg.label.employeeid" /></label>
                                      <Field name="employeeid" type="text" placeholder="Employee ID" category="person" component={InputBox} />
                                  </div>
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label"><Translate id="com.tempedge.msg.label.hiredate" /></label>
                                      <Field name="hireDate_" type="text" placeholder="Hire Date" category="person" component={DateTime} validate={date()}/>
                                  </div>
                              </div>
                              <div className="form-group row">
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label"><Translate id="com.tempedge.msg.label.firstname"/></label>
                                      <Field name="firstName" type="text" placeholder="First Name" category="person" component={InputBox}/>
                                  </div>
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label"><Translate id="com.tempedge.msg.label.middlename"></Translate></label>
                                      <Field name="middleName_" type="text" placeholder="Middle Name" category="person" component={InputBox} />
                                  </div>
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label"><Translate id="com.tempedge.msg.label.lastname"></Translate></label>
                                      <Field name="lastName" type="text" placeholder="Last Name" category="person" component={InputBox} />
                                  </div>
                              </div>

                              <div className="form-group row">
                                  <div className="col-10 col-md-5 col-lg-4">
                                    <label className="control-label"><Translate id="com.tempedge.msg.label.birthday" /></label>
                                    <Field name="birthday_" type="text" category="person" component={DateTime} validate={date()} />
                                  </div>
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label">Age</label>
                                      <label className="control-label">{(this.props.birthday !== null)? Math.floor((new Date() - new Date(this.props.birthday).getTime()) / 3.15576e+10): ""}</label>
                                  </div>
                                  <div className="col-10 col-md-5 col-lg-4">
                                    <label className="control-label"><Translate id="com.tempedge.msg.label.gender" /></label>
                                    <span style={{display: "none"}} ref="maleOption"><Translate id="com.tempedge.msg.label.gender.male" /></span>
                                    <span style={{display: "none"}} ref="femaleOption"><Translate id="com.tempedge.msg.label.gender.female" /></span>
                                    <Field id="genderDropdown" name="gender" data={this.state.genders} valueField="value" textField="gender" category="person" component={Dropdown} />
                                  </div>
                              </div>
                          </div>
                          <div className="tab-pane fade" id="tab2" role="tabpanel">
                              <div className="form-group row">
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label"><Translate id="com.tempedge.msg.label.phone" /></label>
                                      <Field name="phone" type="text" placeholder="Phone" category="person" component={InputBox} />
                                  </div>
                                  <div className="col-10 col-md-8">
                                      <label className="control-label"><Translate id="com.tempedge.msg.label.email" /></label>
                                      <Field name="email_" type="text" placeholder="Email" category="person" component={InputBox} />
                                  </div>
                              </div>

                              <div className="form-group row">
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label"><Translate id="com.tempedge.msg.label.country" /></label>
                                      <Field name="country" data={this.state.country_list} valueField="countryId" textField="name" category="agency" component={Dropdown} />
                                  </div>
                              </div>
                              <div className="form-group row">
                                  <div className="col-10 col-md-8">
                                      <label className="control-label"><Translate id="com.tempedge.msg.label.address" /></label>
                                      <Field name="address" type="text" placeholder="Address" category="person" component={InputBox} />
                                  </div>
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label"><Translate id="com.tempedge.msg.label.agencyaddress2" /></label>
                                      <Field name="address2_" type="text" placeholder="Address 2" category="person" component={InputBox} />
                                  </div>
                              </div>
                              <div className="form-group row">
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label"><Translate id="com.tempedge.msg.label.city" /></label>
                                      <Field name="city" type="text" placeholder="City" category="person" component={InputBox} />
                                  </div>
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label"><Translate id="com.tempedge.msg.label.state" /></label>
                                      <Field name="state" type="text" placeholder="State" category="person" component={InputBox} />
                                  </div>
                                  <div className="col10 col-md-5 col-lg-4">
                                      <label className="control-label"><Translate id="com.tempedge.msg.label.agencyzipcode" /></label>
                                      <Field name="zip" type="text" placeholder="Zip Code" category="person" component={InputBox} />
                                  </div>
                              </div>
                          </div>
                          <div className="tab-pane fade" id="tab3" role="tabpanel">tab 3 content...</div>
                          <div className="tab-pane fade" id="tab4" role="tabpanel">
                            <div className="row">
                              <div className="col-md-6">
                                {(typeof sortedSkillList !== 'undefined')?
                                  sortedSkillList.map((item, index) => {
                                    let listLen = this.props.skillsList.length;

                                    if(index < ((listLen-1)/2)){
                                      return (
                                        <div style={{width: "60%", margin: "auto", marginBottom: 5}}>
                                          <Field name={`skill-left-col-${item.skillId}`} data-skill-id={item.skillId} component="input" type="checkbox" />
                                          <span style={{paddingLeft: 10}}>{item.skill}</span>
                                        </div>
                                      );
                                    }
                                  }): ""}
                              </div>
                              <div className="col-md-6">
                                {(typeof sortedSkillList !== 'undefined')?
                                  sortedSkillList.map((item, index) => {
                                    let listLen = this.props.skillsList.length;

                                    if(index > ((listLen-1)/2)){
                                      return (
                                        <div style={{width: "60%", margin: "auto", marginBottom: 5}}>
                                          <Field name={`skill-right-col-${item.skillId}`} data-skill-id={item.skillId} component="input" type="checkbox" />
                                          <span style={{paddingLeft: 10}}>{item.skill}</span>
                                        </div>
                                      );
                                    }
                                  }): ""}
                              </div>
                            </div>
                          </div>
                          <div className="tab-pane fade" id="tab5" role="tabpanel">tab 3 content...</div>
                          <div className="tab-pane fade" id="tab6" role="tabpanel">
                            <div className="row">
                              <div className="col-md-8" style={{borderRight: "1px solid #d7d7d7"}}>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div style={{width: "80%", margin: "auto", marginBottom: 10}}>
                                      <label className="control-label" style={{marginBottom: 5}}><Translate id="com.tempedge.msg.label.drugtest" /></label>
                                      <span style={{display: "none"}} ref="drugtestAffirmativeOption"><Translate id="com.tempedge.msg.label.affirmative" /></span>
                                      <span style={{display: "none"}} ref="drugtestNegativeOption"><Translate id="com.tempedge.msg.label.negative" /></span>
                                      <Field name="drugTestDropdown" data={this.state.drugTest} valueField="value" textField="Drug Test" category="person" component={Dropdown} />
                                    </div>
                                    {(typeof this.props.drugTestDropdown === 'string')? drugTestDate: ""}
                                  </div>

                                  <div className="col-md-6">
                                    <div style={{width: "80%", margin: "auto", marginBottom: 10}}>
                                      <label className="control-label" style={{marginBottom: 5}}><Translate id="com.tempedge.msg.label.backgroundtest" /></label>
                                      <span style={{display: "none"}} ref="backgroundtestAffirmativeOption"><Translate id="com.tempedge.msg.label.affirmative" /></span>
                                      <span style={{display: "none"}} ref="backgroundtestNegativeOption"><Translate id="com.tempedge.msg.label.negative" /></span>
                                      <Field name="backgroundTestDropdown" data={this.state.backgroundTest} valueField="value" textField="Background Test" category="person" component={Dropdown} />
                                    </div>
                                    {(typeof this.props.backgroundTestDropdown === 'string')? backgroundTestDate: ""}
                                  </div>
                                </div>

                                <div className="row" style={{marginTop: 20}}>
                                  <div className="col-md-6">
                                    <label className="control-label" style={{width: "fit-content", margin: "auto", marginBottom: 10}}><Translate id="com.tempedge.msg.label.documents" /></label>
                                    <div style={{width: "80%", margin: "auto"}}>
                                      <div className="input-group">
                                        <label className="input-group-btn" style={{width: "100%", textAlign: "center"}}>
                                          <span className="btn department-list-button">
                                            <Translate id="com.tempedge.msg.label.choosefile" /><input type="file" onChange={(e) => this.onChange(e.target.files[0], "fileInputDocuments")}  style={{display: "none"}} accept=".pdf" />
                                          </span>
                                        </label><br />
                                        <p ref="fileInputDocuments" style={{margin: "20px auto 0 auto", background: "#ffff", border: "none", textAlign: "center"}}></p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-md-6">
                                    <label className="control-label" style={{width: "fit-content", margin: "auto", marginBottom: 10}}><Translate id="com.tempedge.msg.label.resume" /></label>
                                    <div style={{width: "80%", margin: "auto"}}>
                                      <div className="input-group">
                                        <label className="input-group-btn" style={{width: "100%", textAlign: "center"}}>
                                          <span className="btn department-list-button">
                                            <Translate id="com.tempedge.msg.label.choosefile" /><input type="file" onChange={(e) => this.onChange(e.target.files[0], "fileInputResume")}  style={{display: "none"}} accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, .pdf" />
                                          </span>
                                        </label><br />
                                        <p ref="fileInputResume" style={{margin: "20px auto 0 auto", background: "#ffff", border: "none", textAlign: "center"}}></p>
                                      </div>
                                    </div>
                                  </div>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div style={{width: "60%", margin: "auto", marginBottom: 10}}>
                                    <label className="control-label" style={{marginBottom: 5}}><Translate id="com.tempedge.msg.label.joblocation" /></label>
                                    <Field name="joblocationDropdown" data={this.state.regionsList} valueField="value" textField="Job Location" category="person" component={Dropdown} />
                                  </div>

                                  <div style={{width: "60%", margin: "auto", marginBottom: 10}}>
                                    <label className="control-label" style={{marginBottom: 5}}><Translate id="com.tempedge.msg.label.maritalstatus" /></label>
                                    <span style={{display: "none"}} ref="maritalstatusAffirmativeOption"><Translate id="com.tempedge.msg.label.single" /></span>
                                    <span style={{display: "none"}} ref="maritalstatusNegativeOption"><Translate id="com.tempedge.msg.label.married" /></span>
                                    <Field name="maritalstatusDropdown" data={this.state.maritalStatus} valueField="value" textField="Marital Status" category="person" component={Dropdown} />
                                  </div>

                                  <div style={{width: "60%", margin: "auto"}}>
                                    <label className="control-label" style={{marginBottom: 5}}><Translate id="com.tempedge.msg.label.numberofallowances" /></label>
                                    <Field name="numberofallowances" type="text" placeholder="Number of allowances" category="person" component={InputBox} />
                                  </div>
                                </div>
                              </div>
                            </div>

                          <div style={{width: "100%", margin: "30px 0"}}></div>
                          <hr />
                          <div className="prev-next-btns-agency row" style={{marginTop: 30}}>
                            <div className="col-md-5 offset-md-1">
                              <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={this.props.previousPage}>Cancel</button>
                            </div>
                            <div className="col-md-5">
                              <button type="submit" className="btn btn-primary btn-block register-save-btn next" disabled={this.props.invalid || this.props.submiting || this.props.pristine}>Save</button>
                            </div>
                          </div>
                      </div>
                    </Form>
                </div>
              </div>
            </React.Fragment>

        )
    }
}

CreateEmployee.propTypes = {     //Typechecking With PropTypes, will run on its own, no need to do anything else, separate library since React 16, wasn't the case before on 14 or 15
   //Action, does the Fetch part from the posts API
   tempedgeAPI: PropTypes.func.isRequired,
   getList: PropTypes.func.isRequired,
   getListSafe: PropTypes.func.isRequired,
   validatePerson: PropTypes.func.isRequired
}


CreateEmployee = reduxForm({
    form: 'NewEmployee', //                 <------ form name
    destroyOnUnmount: false, //        <------ preserve form data
    // forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
    validate: Validate
})(CreateEmployee);

let mapStateToProps = (state) => {
    let selector = formValueSelector('NewEmployee'); // <-- same as form name

    return({
      skillsList: state.tempEdge.skillList,
      country_region_list: state.tempEdge.country_region_list,
      country: selector(state, 'country'),
      skillsList: state.tempEdge.skillsList,
      backgroundTestDropdown: (typeof state.form.NewEmployee !== 'undefined' && typeof state.form.NewEmployee.values !== 'undefined')? state.form.NewEmployee.values.backgroundTestDropdown: null,
      drugTestDropdown: (typeof state.form.NewEmployee !== 'undefined' && typeof state.form.NewEmployee.values !== 'undefined')? state.form.NewEmployee.values.drugTestDropdown: null,
      birthday: (typeof state.form.NewEmployee !== 'undefined' && typeof state.form.NewEmployee.values !== 'undefined')? state.form.NewEmployee.values.birthday_: null
    });
}

export default withLocalize(connect(mapStateToProps, { push, getList, tempedgeAPI, getListSafe, validatePerson })(CreateEmployee));
