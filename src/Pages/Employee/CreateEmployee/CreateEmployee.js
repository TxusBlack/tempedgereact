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
import { getList } from '../../../Redux/actions/tempEdgeActions';
import { GET_COUNTRY_REGION_LIST } from '../../../Redux/actions/types.js';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import CountryRegionParser from '../../../components/common/CountryRegionParser/CountryRegionParser.js';
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
            steps: [
                {title: ""},
                {title: ""},
                {title: ""},
                {title: ""}
              ],
            genders: [],
            mounted: false,
            getCountryList: false,
            countryListRendered: 0
        }

        this.addTranslationsForActiveLanguage();
    }

    componentDidMount = async() => {
      await this.props.getList('/api/country/listAll', GET_COUNTRY_REGION_LIST);
      let parent = $(ReactDOM.findDOMNode(this.refs.createNewEmployee1));
      parent.closest(".tabs-stepper-wrapper").css("width", "1600px");

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

        this.setState(() => ({
          countryListRendered: this.state.countryListRendered+1,
          country_list: list
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

      gendersTranslate.push($(ReactDOM.findDOMNode(this.refs.maleOption)).text());
      gendersTranslate.push($(ReactDOM.findDOMNode(this.refs.femaleOption)).text());

      if(this.state.mounted && gendersTranslate.length !== 0){
        this.setState(() => ({
          genders: gendersTranslate
        }));
      }
    }

    onSubmit = async (formValues) => {
      console.log("formValues: ", formValues);
    }

    render() {
        let key = this.state.key;
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
                                    <label className="control-label">Temporary Data</label>
                                    <Field name="temporarydata" type="text" placeholder="Temporary Data" category="person" component={InputBox} />
                                  </div>
                                  <div className="col-10 col-md-5 col-lg-4">
                                  <label className="control-label">Office</label>
                                      <Field name="office" type="text" placeholder="Office" category="person" component={InputBox} />
                                  </div>
                                  <div className="col-10 col-md-5 col-lg-4">
                                  <label className="control-label">Deparment</label>
                                      <Field name="department" type="text" placeholder="Deparment" category="person" component={InputBox} />
                                  </div>
                              </div>
                              <div className="form-group row">
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label">SSN</label>
                                      <Field name="ssn" type="text" placeholder="SSN" category="person" component={InputBox} />
                                  </div>
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label">Employee ID</label>
                                      <Field name="employeeid" type="text" placeholder="Employee ID" category="person" component={InputBox} />
                                  </div>
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label">Hire Date</label>
                                      <Field name="hireDate" type="text" placeholder="Hire Date" category="person" component={DateTime} validate={date()}/>
                                  </div>
                              </div>
                              <div className="form-group row">
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label"><Translate id="com.tempedge.msg.label.firstname"/></label>
                                      <Field name="firstName" type="text" placeholder="First Name" category="person" component={InputBox}/>
                                  </div>
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label"><Translate id="com.tempedge.msg.label.middlename"></Translate></label>
                                      <Field name="middleName" type="text" placeholder="Middle Name" category="person" component={InputBox} />
                                  </div>
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label"><Translate id="com.tempedge.msg.label.lastname"></Translate></label>
                                      <Field name="lastName" type="text" placeholder="Last Name" category="person" component={InputBox} />
                                  </div>
                              </div>

                              <div className="form-group row">
                                  <div className="col-10 col-md-5 col-lg-4">
                                    <label className="control-label"><Translate id="com.tempedge.msg.label.birthday" /></label>
                                    <Field name="birthday" type="text" category="person" component={DateTime} validate={date()} />
                                  </div>
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label">Age</label>
                                      <label className="control-label">18</label>
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
                                      <label className="control-label">Phone</label>
                                      <Field name="phone" type="text" placeholder="Phone" category="person" component={InputBox} />
                                  </div>
                                  <div className="col-10 col-md-8">
                                      <label className="control-label">Email</label>
                                      <Field name="email" type="text" placeholder="Email" category="person" component={InputBox} />
                                  </div>
                              </div>
                              <div className="form-group row">
                                  <div className="col-12">
                                      <label className="control-label"></label>
                                      <hr></hr>
                                  </div>
                              </div>

                              <div className="form-group row">
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label">Country</label>
                                      <Field name="country" data={this.state.country_list} valueField="countryId" textField="name" category="agency" component={Dropdown} />
                                  </div>
                              </div>
                              <div className="form-group row">
                                  <div className="col-10 col-md-8">
                                      <label className="control-label">Address</label>
                                      <Field name="address" type="text" placeholder="Address" category="person" component={InputBox} />
                                  </div>
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label">Address 2</label>
                                      <Field name="address2" type="text" placeholder="Address 2" category="person" component={InputBox} />
                                  </div>

                              </div>
                              <div className="form-group row">
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label">City</label>
                                      <Field name="city" type="text" placeholder="City" category="person" component={InputBox} />

                                  </div>
                                  <div className="col-10 col-md-5 col-lg-4">
                                      <label className="control-label">State</label>
                                      <Field name="state" type="text" placeholder="State" category="person" component={InputBox} />
                                  </div>
                                  <div className="col10 col-md-5 col-lg-4">
                                      <label className="control-label">Zip Code</label>
                                      <Field name="zip" type="text" placeholder="Zip Code" category="person" component={InputBox} />
                                  </div>
                              </div>
                          </div>
                          <div className="tab-pane fade" id="tab3" role="tabpanel">tab 3 content...</div>
                          <div className="tab-pane fade" id="tab4" role="tabpanel">tab 3 content...</div>
                          <div className="tab-pane fade" id="tab5" role="tabpanel">tab 3 content...</div>
                          <div className="tab-pane fade" id="tab6" role="tabpanel">tab 3 content...</div>
                      </div>
                      <div className="prev-next-btns-agency row" style={{marginTop: 30}}>
                        <div className="col-md-5 offset-md-1">
                          <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={this.props.previousPage}>Cancel</button>
                        </div>
                        <div className="col-md-5">
                          <button type="submit" className="btn btn-primary btn-block register-save-btn next" disabled={this.props.invalid || this.props.submiting || this.props.pristine}>Save</button>
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
   getList: PropTypes.func.isRequired
       //Action, does the Fetch part from the posts API
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
      country_region_list: state.tempEdge.country_region_list,
      country: selector(state, 'country')
    });
}

export default withLocalize(connect(mapStateToProps, { push, getList, tempedgeAPI })(CreateEmployee));
