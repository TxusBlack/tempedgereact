import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Field, reduxForm } from 'redux-form';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import Dropdown from '../../../components/common/Dropdown/Dropdown.js';
import DropdownList from 'react-widgets/lib/DropdownList';      //DO NOT REMOVE or it will break
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Validate from '../../Validations/Validations';

class WizardCreateNewUserThirdPage extends Component{
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

  render(){
    let salesmen = ["Paco", "Joaquin", "Alvaro", "Tom"];
    let payrollCycle = ["1", "2", "3", "4"];

    return(
      <div className="sign-up-wrapper" style={{margin: 0}} ref="createNewUser1">
        <h2 className="text-center page-title-new-client"><Translate id="com.tempedge.msg.label.createNewClient"></Translate></h2>
        <form className="panel-body" onSubmit={this.props.handleSubmit} className="form-horizontal center-block" style={{paddingBottom: "0px"}}>
          <div className="row new-client-form">
            <div className="col-lg-8 client-col">
              <div className="create-client">
                <div className="new-client-header">
                  <h2>Create Client</h2>
                </div>
                <div className="new-clients-contents">
                  <div className="client-contents">
                    <div className="form-group row">
                      <div className="col-md-4">
                        <label className="control-label"><Translate id="com.tempedge.msg.label.lastname"></Translate></label>
                        <Field name="clientlastName" type="text" placeholder="Enter Last Name" category="client" component={InputBox} />
                      </div>
                      <div className="col-md-4">
                        <label className="control-label"><Translate id="com.tempedge.msg.label.firstname"></Translate></label>
                        <Field name="clientfirstName" type="text" placeholder="Enter First Name" category="client" component={InputBox} />
                      </div>
                      <div className="col-md-4">
                        <label className="control-label"><Translate id="com.tempedge.msg.label.clientcontactphone"></Translate></label>
                        <Field name="clientcontactphone" type="text" placeholder="Enter Contact Phone" category="client" component={InputBox} />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-md-4">
                        <label className="control-label"><Translate id="com.tempedge.msg.label.clientcontactcellphone"></Translate></label>
                        <Field name="clientcontactcellphone" type="text" placeholder="Enter Contact Cell Phone" category="client" component={InputBox} />
                      </div>
                    </div>

                    <div className="new-clients-footer">
                      <div className="prev-next-btns-agency row">
                        <div className="col-md-5 offset-md-1">
                          <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={this.props.previousPage}>Back</button>
                        </div>
                        <div className="col-md-5">
                          <button type="submit" className="btn btn-primary btn-block register-save-btn next" disabled={this.props.invalid || this.props.pristine}><Translate id="com.tempedge.msg.label.submit"></Translate></button>
                        </div>
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
                    <p className="department-list-button center-block">Add Departments</p>
                  </div>
                </div>
              </div>
          </div>
        </form>
      </div>
    );
  }
}

WizardCreateNewUserThirdPage = reduxForm({
  form: 'CreateNewClient', //                 <------ form name
  destroyOnUnmount: false, //        <------ preserve form data
  // forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate: Validate
})(WizardCreateNewUserThirdPage);

export default withLocalize(connect(null, { push })(WizardCreateNewUserThirdPage));
