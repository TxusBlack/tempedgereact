import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import Dropdown from '../../../components/common/Dropdown/Dropdown.js';
import CountryRegionParser from '../../../components/common/CountryRegionParser/CountryRegionParser.js';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import Validate from '../../Validations/Validations';
import { notify } from 'reapop';

class WizardCreateNewAgencySecondPage extends Component {
  constructor(props) {
    super(props);

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage).then(() => {
      this.setState({ error: false })
    }).catch(err => {
      if (!this.state.error) {
        this.setState({ error: true });
        this.fireNotification('Error',
          this.props.activeLanguage.code === 'en'
            ? 'It is not posible to proccess this transaction. Please try again later'
            : 'En este momento no podemos procesar esta transacción. Por favor intente mas tarde.',
          'error'
        );
      }
    });
  }

  state = {
    country_list: [],
    region_list: [],
    error: false
  }

  componentDidMount = async () => {
    let list = await CountryRegionParser.getCountryList(this.props.country_region_list).country_list;

    this.setState({
      country_list: list
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/registerAgency/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage).then(() => this.setState({ error: false }));
    }
  }

  componentWillReceiveProps = async (nextProps) => {
    if (typeof nextProps.country === 'undefined') {
      let regionsList = await CountryRegionParser.getRegionList(this.props.country_region_list, "United States");

      this.setState({
        region_list: regionsList
      });
    } else {
      let regionsList = await CountryRegionParser.getRegionList(this.props.country_region_list, nextProps.country.name);

      this.setState({
        region_list: regionsList
      });
    }
  }

  fireNotification = (title, message, status) => {
    let { notify } = this.props;

    notify({
      title,
      message,
      status,
      position: 'br',
      dismissible: true,
      dismissAfter: 3000
    });
  }

  render() {
    let { handleSubmit } = this.props;

    return (
      <React.Fragment>
        <h2 className="text-center page-title-agency"><Translate id="com.tempedge.msg.label.newagencyregistration"></Translate></h2>
        <form className="panel-body" onSubmit={handleSubmit} className="form-horizontal center-block register-form-agency" style={{ paddingBottom: "0px" }}>
          <div className="form-group row row-agency-name">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-2">
                  <label className="control-label pull-right agency-label"><Translate id="com.tempedge.msg.label.agencyname"></Translate></label>
                </div>
                <div className="col-md-8" style={{ paddingLeft: 0, paddingRight: 71 }}>
                  <Field name="agencyname" type="text" placeholder="Agency Name" category="agency" component={InputBox} />
                </div>
              </div>
            </div>
          </div>
          <div className="panel register-form-panel">
            <div className="panel-heading register-header">
              <h2 className="text-center"><Translate id="com.tempedge.msg.label.officeinformation"></Translate></h2>
            </div>
          </div>
          <div className="register-form-panel-inputs">
            <div className="form-group register-form wizard-register-agency-form row">
              <div className="register-agency-flex col-md-12">
                <div className="col-md-6 register-agency-input-left">
                  <label className="control-label top-label-agency-form"><Translate id="com.tempedge.msg.label.country"></Translate></label>
                  <Field name="agencycountry" data={this.state.country_list} valueField="countryId" textField="name" category="agency" component={Dropdown} />
                </div>
              </div>

              <div className="register-agency-flex col-md-12">
                <div className="col-md-12">
                  <label className="control-label"><Translate id="com.tempedge.msg.label.agencyaddress"></Translate></label>
                  <Field name="agencyaddress" type="textarea" placeholder="Enter Address" category="agency" component={InputBox} />
                </div>
              </div>

              <div className="register-agency-flex col-md-12">
                <div className="col-md-6 register-agency-input-left">
                  <label className="control-label"><Translate id="com.tempedge.msg.label.agencyaddress2"></Translate></label>
                  <Field name="agencyappartment" type="text" placeholder="Enter Apartment" category="agency" component={InputBox} />
                </div>

                <div className="col-md-6 register-agency-input-right">
                  <label className="control-label"><Translate id="com.tempedge.msg.label.city"></Translate></label>
                  <Field name="agencycity" type="text" placeholder="Enter City" category="agency" component={InputBox} />
                </div>
              </div>

              <div className="register-agency-flex col-md-12">
                <div className="col-md-6 register-agency-input-left">
                  <label className="control-label"><Translate id="com.tempedge.msg.label.agencyzipcode"></Translate></label>
                  <Field name="agencyzipcode" type="text" placeholder="Enter Zip Code" category="agency" component={InputBox} />
                </div>

                <div className="col-md-6 register-agency-input-right">
                  <label className="control-label"><Translate id="com.tempedge.msg.label.state"></Translate></label>
                  <Field name="agencystate" data={this.state.region_list} valueField="regionId" textField="name" category="agency" component={Dropdown} />
                </div>
              </div>
            </div>
          </div>

          <div className="panel-footer register-footer panel-footer-agency-height-override">
            <div className="prev-next-btns-agency row">
              <div className="col-md-4 offset-md-2">
                <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={this.props.previousPage}>Back</button>
              </div>
              <div className="col-md-4">
                <button type="submit" className="btn btn-primary btn-block register-save-btn next" disabled={this.props.invalid || this.props.pristine}><Translate id="com.tempedge.msg.label.next">Next</Translate></button>
              </div>
            </div>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

WizardCreateNewAgencySecondPage = reduxForm({
  form: 'CreateNewAgency', //                 <------ form name
  destroyOnUnmount: false, //        <------ preserve form data
  // forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate: Validate
})(WizardCreateNewAgencySecondPage);

let mapStateToProps = (state) => {
  let selector = formValueSelector('CreateNewAgency'); // <-- same as form name

  return ({
    country_region_list: state.tempEdge.country_region_list,
    country: selector(state, 'agencycountry')
  });
}

export default withLocalize(connect(mapStateToProps, { push, notify })(WizardCreateNewAgencySecondPage));
