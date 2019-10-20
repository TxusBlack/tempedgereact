import React, { Component } from 'react';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import { Translate, withLocalize } from 'react-localize-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { date } from 'redux-form-validators';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import { connect } from 'react-redux';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import CountryRegionParser from '../../../components/common/CountryRegionParser/CountryRegionParser.js';
import { tempedgeAPI } from '../../../Redux/actions/tempEdgeActions';
import Container from '../../../components/common/Container/Container';
import Form from 'react-bootstrap/Form';
import Stepper from 'react-stepper-horizontal';
import Validate from '../../Validations/Validations';
import Dropdown from '../../../components/common/Dropdown/Dropdown.js';
import DateTime from '../../../components/common/DateTimePicker/DateTimePicker.js';


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
               ]
        }
        
        ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }

    componentDidUpdate(prevProps, prevState) {
        const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

        if (hasActiveLanguageChanged) {
            this.props.push(`/employee/create/${this.props.activeLanguage.code}`);
            ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
        }

    }
    componentDidMount = async() => {
        let list = await CountryRegionParser.getCountryList(this.props.country_region_list).country_list;
    
        this.setState({
          country_list: list
        });
    }
    render() {
        let btns = <div className="prev-next-btns-agency row">
        <div className="col-md-5 offset-md-1">
          <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={this.props.previousPage}>Cancel</button>
        </div>
        <div className="col-md-5">
          <button type="submit" className="btn btn-primary btn-block register-save-btn next" disabled={this.props.invalid || this.props.pristine}>Save</button>
        </div>
      </div>


        let key = this.state.key;
        return (
            <React.Fragment>
            <Stepper steps={ this.state.steps } activeStep={ key } activeColor="#eb8d34" completeColor="#8cb544" defaultBarColor="#eb8d34" completeBarColor="#8cb544" barStyle="solid" circleFontSize={16} />

            <Container btns={btns}>
            <div className="formPanel">
                <Form>
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

                <div className="tab-content formPanelBody">
                    <div className="tab-pane fade show active" id="tab1" role="tabpanel">
                        <div className="row">
                            <div className="col-10 col-md-5 col-lg-4">
                                <label className="control-label">Temporary Data</label>
                                <Field name="middleName" type="text" placeholder="Middle Name" category="person" component={InputBox} />

                            </div>
                            <div className="col-10 col-md-5 col-lg-4">
                            <label className="control-label">Office</label>
                                <Field name="middleName" type="text" placeholder="Middle Name" category="person" component={InputBox} />
                            </div>
                            <div className="col-10 col-md-5 col-lg-4">
                            <label className="control-label">Deparment</label>
                                <Field name="middleName" type="text" placeholder="Middle Name" category="person" component={InputBox} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-10 col-md-5 col-lg-4">
                                <label className="control-label">SSN</label>
                                <Field name="middleName" type="text" placeholder="Middle Name" category="person" component={InputBox} />
                            </div>
                            <div className="col-10 col-md-5 col-lg-4">
                                <label className="control-label">Employee ID</label>
                                <Field name="middleName" type="text" placeholder="Middle Name" category="person" component={InputBox} />
                            </div>
                            <div className="col-10 col-md-5 col-lg-4">
                                <label className="control-label">Hire Date</label>
                                <Field name="hireDate" type="text" placeholder="First Name" category="person" component={DateTime} validate={date()}/>
                            </div>
                        </div>
                        <div className="row">
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
                        
                        <div className="row">
                            <div className="col-10 col-md-5 col-lg-4">
                                <label className="control-label">D.O.B</label>
                                <Field name="dob" type="text"  placeholder="First Name" category="person" component={DateTime} validate={date()}/>
                            </div>
                            <div className="col-10 col-md-5 col-lg-4">
                                <label className="control-label">Age</label>
                                <label className="control-label">18</label>
                            </div>
                            <div className="col-10 col-md-5 col-lg-4">
                                <label className="control-label">Gender</label>
                                <Field name="lastName" type="text" placeholder="Last Name" category="person" component={InputBox} />
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="tab2" role="tabpanel">
                        <div className="row">
                            <div className="col-10 col-md-5 col-lg-4">
                                <label className="control-label">Phone</label>
                                <Field name="lastName" type="text" placeholder="Last Name" category="person" component={InputBox} />
                            </div>
                            <div className="col-10 col-md-8">
                                <label className="control-label">Email</label>
                                <Field name="lastName" type="text" placeholder="Last Name" category="person" component={InputBox} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <label className="control-label"></label>
                                <hr></hr>
                            </div>
                        </div>
                    
                        <div className="row">
                            <div className="col-10 col-md-5 col-lg-4">
                                <label className="control-label">Country</label>
                                <Field name="country" data={this.state.country_list} valueField="countryId" textField="name" category="agency" component={Dropdown} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-10 col-md-8">
                                <label className="control-label">Adress</label>
                                <Field name="middleName" type="text" placeholder="Middle Name" category="person" component={InputBox} />
                            </div>
                            <div className="col-10 col-md-5 col-lg-4">
                                <label className="control-label">Adress 2</label>
                                <Field name="middleName" type="text" placeholder="Middle Name" category="person" component={InputBox} />
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-10 col-md-5 col-lg-4">
                                <label className="control-label">cITY</label>
                                <Field name="middleName" type="text" placeholder="Middle Name" category="person" component={InputBox} />

                            </div>
                            <div className="col-10 col-md-5 col-lg-4">
                                <label className="control-label">State</label>
                                <Field name="middleName" type="text" placeholder="Middle Name" category="person" component={InputBox} />
                            </div>
                            <div className="col10 col-md-5 col-lg-4">
                                <label className="control-label">Zipcode</label>
                                <Field name="middleName" type="text" placeholder="Middle Name" category="person" component={InputBox} />
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="tab3" role="tabpanel">tab 3 content...</div>
                    <div className="tab-pane fade" id="tab4" role="tabpanel">tab 3 content...</div>
                    <div className="tab-pane fade" id="tab5" role="tabpanel">tab 3 content...</div>
                    <div className="tab-pane fade" id="tab6" role="tabpanel">tab 3 content...</div>
                </div>
                </Form>
            </div>
            </Container>
            </React.Fragment>
            
        )
    }
}

CreateEmployee.propTypes = {     //Typechecking With PropTypes, will run on its own, no need to do anything else, separate library since React 16, wasn't the case before on 14 or 15
   //Action, does the Fetch part from the posts API
   tempedgeAPI: PropTypes.func.isRequired, 
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

export default withLocalize(connect(mapStateToProps, { push, tempedgeAPI })(CreateEmployee));

