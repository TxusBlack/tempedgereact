import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import Dropdown from '../../../components/common/Dropdown/Dropdown.js';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Validate from '../../Validations/Validations';

class WizardCreateNewAgencySixthPage extends Component{
  constructor(props){
    super(props);

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  state= { mounted: false }

  componentDidMount = async() => {
    this.setState({
      mounted: true
    });
  }

  componentDidUpdate(prevProps, prevState){
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/registerAgency/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  render(){
    let weekdays = [
      { day: "Monday", value: "1" },
      { day: "Tuesday", value: "2" },
      { day: "Wednesday", value: "3" },
      { day: "Thursday", value: "4" },
      { day: "Friday", value: "5" },
      { day: "Saturday", value: "6" },
      { day: "Sunday", value: "0" }
    ];

    return(
      <React.Fragment>
        <h2 className="text-center page-title-agency"><Translate id="com.tempedge.msg.label.newagencyregistration"></Translate></h2>
        <form className="panel-body" onSubmit={this.props.handleSubmit} className="form-horizontal center-block register-form-agency" style={{paddingBottom: "0px"}}>
          <div className="form-group row row-agency-name">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-2">
                  <label className="control-label pull-right" style={{paddingTop: 8}}><Translate id="com.tempedge.msg.label.agencyname"></Translate></label>
                </div>
                <div className="col-md-8" style={{paddingLeft: 0, paddingRight: 71}}>
                  <Field name="agencyname" type="text" placeholder="Agency Name" category="agency" component={InputBox} />
                </div>
              </div>
            </div>
          </div>
          <div className="panel register-form-panel">
            <div className="panel-heading register-header">
              <h2 className="text-center"><Translate id="com.tempedge.msg.label.information"></Translate></h2>
            </div>
          </div>
          <div className="register-form-panel-inputs">
            <div className="form-group register-form wizard-register-agency-form payroll-hours-validation row">
              <div className="col-md-4">
                <label className="control-label top-label-agency-form"><Translate id="com.tempedge.msg.label.payrollhours"></Translate></label>
                <Field name="weekdaysdropdown1" data={weekdays} valueField="value" textField="day" category="agency" component={Dropdown} />
              </div>

              <div className="col-md-4">
                <label className="control-label top-label-agency-form"><Translate id="com.tempedge.msg.label.payrollvalidation"></Translate></label>
                <Field name="weekdaysdropdown2" data={weekdays} valueField="value" textField="day" category="agency" component={Dropdown} />
              </div>

              <div className="col-md-4">
                <label className="control-label top-label-agency-form"><Translate id="com.tempedge.msg.label.fundingcompany"></Translate></label>
                <Field name="fundingCompanydropdown" data={this.props.funding_list} valueField="fundingId" textField="name" category="agency" component={Dropdown} />
              </div>
            </div>
          </div>

          <div className="panel-footer register-footer panel-footer-agency-height-override">
            <div className="prev-next-btns-agency row">
              <div className="col-md-4 offset-md-2">
                <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={this.props.previousPage}>Back</button>
              </div>
              <div className="col-md-4">
                <button type="submit" className="btn btn-primary btn-block register-save-btn next" disabled={this.props.invalid || this.props.submiting || this.props.pristine}><Translate id="com.tempedge.msg.label.next"></Translate></button>
              </div>
            </div>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

WizardCreateNewAgencySixthPage = reduxForm({
  form: 'CreateNewAgency',
  destroyOnUnmount: false,
  validate: Validate
})(WizardCreateNewAgencySixthPage);

let mapStateToProps = (state) => {
  return{
    funding_list: state.tempEdge.funding_list,
  };
}

export default withLocalize(connect(mapStateToProps, { push })(WizardCreateNewAgencySixthPage));
