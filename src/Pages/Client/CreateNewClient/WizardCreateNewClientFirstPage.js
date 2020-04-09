import React, { Component } from 'react';
import { Field, reduxForm, reset } from 'redux-form';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import DropdownList from '../../../components/common/Dropdown/DropdownList';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Validate from '../../Validations/Validations';
import { notify } from 'reapop';

class WizardCreateNewUserFirstPage extends Component {
  constructor(props) {
    super(props);

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  state = { mounted: false }

  componentDidMount() {
    this.setState(() => ({
      mounted: true,
    }));

    this.props.getDispatch(this.props.dispatch);
  }

  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/client/new/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  resetAllData = () => {
    this.props.dispatch(reset('CreateNewClient'));
  }

  renderError(formProps) {
    let fieldId = '';

    if (typeof formProps.input !== 'undefined') {
      if (formProps.index != null || typeof formProps.index != 'undefined' || formProps.index !== '') {
        if (formProps.input.name.indexOf("recruitmentofficesalespersons") !== -1) {
          if (formProps.input.name.indexOf("salespersonfirstname") !== -1) {
            fieldId = `com.tempedge.error.person.firstNamerequired`;
          } else if (formProps.input.name.indexOf("salespersonlastname") !== -1) {
            fieldId = `com.tempedge.error.person.lastNamerequired`;
          } else if (formProps.input.name.indexOf("salespersongenre") !== -1) {
            fieldId = `com.tempedge.error.person.genderrequired`;
          } else if (formProps.input.name.indexOf("salespersonphonenumber") !== -1) {
            fieldId = `com.tempedge.error.phonenumberrequired`;
          }
        }
      }

      if (formProps.meta.touched && formProps.meta.error && typeof formProps.meta.error !== 'undefined') {
        return (
          <p style={{ color: '#a94442' }}><Translate id={fieldId}>{formProps.meta.error}</Translate></p>
        );
      }
    }
  }

  render() {
    let salesman = this.props.salesmanList;
    let payrollCycle = [{ payrollCycle: this.props.translate('com.tempedge.msg.label.mon') + " - " + this.props.translate('com.tempedge.msg.label.sun'), payrollId: 1 }, { payrollCycle: this.props.translate('com.tempedge.msg.label.sun') + " - " + this.props.translate('com.tempedge.msg.label.sat'), payrollId: 0 }, { payrollCycle: this.props.translate('com.tempedge.msg.label.sat') + " - " + this.props.translate('com.tempedge.msg.label.fri'), payrollId: -1 }];
    return (
      <div className="sign-up-wrapper" style={{ margin: 0 }} ref="createNewUser1">
        <h2 className="text-center page-title-new-client"><Translate id="com.tempedge.msg.label.createNewClient"></Translate></h2>
        {this.props.resultBar}
        <form className="panel-body" onSubmit={this.props.handleSubmit} className="form-horizontal center-block" style={{ paddingBottom: "0px" }}>
          <div className="row new-client-form">
            <div className="col-lg-8 client-col">
              <div className="create-client">
                <div className="new-client-header">
                  <h2>
                    <Translate id="com.tempedge.msg.label.createNewClient" />
                  </h2>
                </div>

                <div className="new-clients-contents">
                  <div className="client-contents">
                    <div className="form-group row">
                      <div className="col-md-4">
                        <label className="control-label"><Translate id="com.tempedge.msg.label.company"></Translate></label>
                        <Field name="company" type="text" placeholder={this.props.translate('com.tempedge.error.agency.fundingCompanydropdownrequired')} category="client" component={InputBox} />
                      </div>
                      <div className="col-md-4">
                        <label className="control-label"><Translate id="com.tempedge.msg.label.salesman"></Translate></label>
                        <Field name="salesman" data={salesman} valueField="personId" textField='firstName' category="client" placeholder={this.props.translate('com.tempedge.msg.label.select')} component={DropdownList} />
                      </div>
                      <div className="col-md-4">
                        <label className="control-label"><Translate id="com.tempedge.msg.label.payrollCycle"></Translate></label>
                        <Field name="payrollCycle" data={payrollCycle} valueField="payrollId" textField="payrollCycle" category="client" placeholder={this.props.translate('com.tempedge.msg.label.select')} component={DropdownList} />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-md-4">
                        <label className="control-label"><Translate id="com.tempedge.msg.label.workCompCode"></Translate></label>
                        <Field name="workCompCode" type="text" placeholder={this.props.translate("com.tempedge.error.client.workCompCoderequired")} category="client" component={InputBox} />
                      </div>
                      <div className="col-md-4">
                        <label className="control-label"><Translate id="com.tempedge.msg.label.workCompRate"></Translate></label>
                        <Field name="workCompRate" type="text" placeholder={this.props.translate("com.tempedge.error.client.workCompRaterequired")} category="client" component={InputBox} />
                      </div>
                      <div className="col-md-4">
                        <label className="control-label"><Translate id="com.tempedge.msg.label.companyInitials"></Translate></label>
                        <Field name="companyInitials" type="text" placeholder={this.props.translate("com.tempedge.error.agency.fundingCompanydropdownrequired")} category="client" component={InputBox} />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-md-4">
                        <label className="control-label"><Translate id="com.tempedge.msg.label.attnTo"></Translate></label>
                        <Field name="attnTo" type="text" placeholder={this.props.translate("com.tempedge.error.client.attnTorequired")} category="client" component={InputBox} />
                      </div>
                      <div className="col-md-4">
                        <label className="control-label"><Translate id="com.tempedge.msg.label.email"></Translate></label>
                        <Field name="email" type="text" placeholder={this.props.translate("com.tempedge.error.person.emailrequired")} category="person" component={InputBox} />
                      </div>
                      <div className="col-md-4">
                        <label className="control-label"><Translate id="com.tempedge.msg.label.comments"></Translate></label>
                        <Field name="comments" type="textarea" placeholder={this.props.translate("com.tempedge.msg.label.comments")} category="client" component={InputBox} />
                      </div>
                    </div>

                    <div className="form-group row bottom-row">
                      <div className="col-md-4">
                        <label className="control-label"><Translate id="com.tempedge.msg.label.markupClient"></Translate></label>
                        <Field name="markupClient" type="text" placeholder={this.props.translate("com.tempedge.error.client.markupClientrequired")} category="client" component={InputBox} />
                      </div>
                      <div className="col-md-4">
                        <label className="control-label"><Translate id="com.tempedge.msg.label.otMarkupClient"></Translate></label>
                        <Field name="otMarkupClient" type="text" placeholder={this.props.translate("com.tempedge.error.client.otMarkupClientrequired")} category="client" component={InputBox} />
                      </div>
                    </div>
                  </div>
                  <div className="new-clients-footer">
                    <div className="prev-next-btns-agency row">
                      <div className="col-md-5 offset-md-1">
                        <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={this.props.previousPage}><Translate id="com.tempedge.msg.label.cancel"></Translate></button>
                      </div>
                      <div className="col-md-5">
                        <button type="submit" className="btn btn-primary btn-block register-save-btn next" disabled={this.props.invalid}><Translate id="com.tempedge.msg.label.next"></Translate></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 dept-col">
              <div className="department-list">
                <div className="department-list-header">
                  <h2>
                    <Translate id="com.tempedge.msg.label.departmentlist" />
                  </h2>
                </div>

                <div className="department-list-contents">
                  <div>
                    {(!this.props.renderAddBtnDirty) ? this.props.renderAddBtn() : <div>{this.props.departmentList}{this.props.addDeptBtn}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
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

  if (state.form.CreateNewClient !== undefined) {
    clientdepartments = (state.form.CreateNewClient.values !== undefined) ? state.form.CreateNewClient.values.clientdepartments : undefined
  } else {
    clientdepartments = undefined;
  }

  return ({
    clientDepartments: clientdepartments,
    salesmanList: (typeof state.tempEdge.salesmanList !== 'undefined' && state.tempEdge.salesmanList.content !== 'undefined') ? state.tempEdge.salesmanList.content : [],
  });
}

export default withLocalize(connect(mapStateToProps, { push, notify })(WizardCreateNewUserFirstPage));
