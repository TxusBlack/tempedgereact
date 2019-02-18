import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Field, reduxForm } from 'redux-form';
import DropdownList from 'react-widgets/lib/DropdownList';
import 'react-widgets/dist/css/react-widgets.css';
import PropTypes from 'prop-types';
import Validators from 'redux-form-validators';
import { required, date } from 'redux-form-validators';
import 'react-widgets/dist/css/react-widgets.css';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import  { setActivePage } from '../../Redux/actions/tempEdgeActions';

class CreateNewAgency extends Component{
  constructor(props){
    super(props);

    this.addTranslationsForActiveLanguage();
  }

  componentWillMount(){
    this.props.history.location.pathname = `/registerAgency/${this.props.activeLanguage.code}`;
    this.props.history.push(`/registerAgency/${this.props.activeLanguage.code}`);
    this.props.setActivePage("registerAgency");
  }

  componentDidUpdate(prevProps, prevState){
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.params.lang = this.props.activeLanguage.code;
      this.props.history.location.pathname = `/registerAgency/${this.props.activeLanguage.code}`;
      this.props.history.push(`/registerAgency/${this.props.activeLanguage.code}`);
      this.addTranslationsForActiveLanguage();
    }
  }

  addTranslationsForActiveLanguage(){
    const {activeLanguage} = this.props;

    if (!activeLanguage) {
      return;
    }

    import(`../../translations/${activeLanguage.code}.tempedge.json`)
      .then(translations => {
        this.props.addTranslationForLanguage(translations, activeLanguage.code)
      });
  }

  renderError(formProps){
    let fieldId='';
    let errMsg = '';

    if(typeof formProps.input !== 'undefined'){
      fieldId = `com.tempedge.error.agency.${formProps.input.name}required`;
      errMsg = formProps.meta.error;

      if(formProps.meta.touched && formProps.meta.error && typeof errMsg !== 'undefined'){
        return(
          <p style={{color: '#a94442'}}><Translate id={fieldId}>{errMsg}</Translate></p>
        );
      }
    }
  }

  renderDropdownList = (formProps) => {
    let errorClass = `col-xs-10 ${(formProps.meta.error && formProps.meta.touched)? 'has-error': ''}`;

    return(
      <div className={errorClass}>
        <DropdownList {...formProps.input} data={formProps.data} valueField={formProps.valueField} textField={formProps.textField} onChange={formProps.input.onChange} />
        {this.renderError(formProps)}
      </div>
    );
  }

  renderInput = (formProps) => {
    let errorClass = `col-xs-10 ${(formProps.meta.error && formProps.meta.touched)? 'has-error': ''}`;

    return(
      <div className={errorClass}>
        <input className="form-control" placeholder={formProps.placeholder} {...formProps.input} autoComplete="off" />      {/*<input onChange={formProps.input.onChange} value={formProps.input.value} />*/}
        {this.renderError(formProps)}
      </div>
    );
  }

  onSubmit(formValues){
    console.log(formValues);
  }

  render(){
    let country_list = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas"
                      	,"Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands"
                      	,"Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica"
                      	,"Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea"
                      	,"Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana"
                      	,"Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India"
                      	,"Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia"
                      	,"Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania"
                      	,"Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia"
                      	,"New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal"
                      	,"Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles"
                      	,"Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan"
                      	,"Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia"
                      	,"Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","United States Minor Outlying Islands","Uruguay"
                      	,"Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

    let option_list = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 2" ];

    return(
      <React.Fragment>
        <h2 className="text-center page-title"><Translate id="com.tempedge.msg.label.newagency">New Agency</Translate></h2>
        <form onSubmit={this.props.handleSubmit(this.onSubmit)} className="form-horizontal center-block register-form" style={{width: "40%", padding: "30px 0"}}>
          <div className="form-group">
            <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.country">Country</Translate>:</label>
            <Field  name="agencycountry" component={this.renderDropdownList} data={country_list} valueField="value" textField="country" />
          </div>
          <div className="form-group">
            <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.options">Options</Translate>:</label>
            <Field  name="agencydropdown" component={this.renderDropdownList} data={option_list} valueField="value" textField="option" />
          </div>
          <div className="form-group">
              <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.agencyname">Agency Name</Translate></label>
              <Field name="agencyname" type="text" placeholder="Agency Name" component={(formProps) => this.renderInput(formProps)} />
          </div>
          <div className="form-group">
              <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.agencyaddress">Address</Translate></label>
              <Field name="agencyaddress" type="text" placeholder="Address" component={(formProps) => this.renderInput(formProps)} />
          </div>
          <div className="form-group">
              <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.agencyappartment">Apartment (Required)</Translate></label>
              <Field name="agencyappartment" type="text" placeholder="Apartment" component={(formProps) => this.renderInput(formProps)} />
          </div>
          <div className="form-group">
              <div className="col-md-6 col-md-offset-3">
                <button type="submit" className="btn btn-primary btn-block register-save-btn" disabled={this.props.invalid || this.props.submiting || this.props.pristine}><Translate id="com.tempedge.msg.label.save">Save</Translate></button>
              </div>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

let validate = (formValues) => {
  let errors ={};

  if(!formValues.firstName){
    errors.firstName = 'Please enter your first name';
  }

  if(!formValues.middleName){
    errors.middleName = 'Please enter your middle name or initial';
  }

  if(!formValues.lastName){
    errors.lastName = 'Please enter your last name';
  }

  if (!formValues.email) {
      errors.email = 'Email field is required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.email)) {
      errors.email = 'Invalid email address'
  }

  return errors;
}

CreateNewAgency.propTypes = {
  setActivePage: PropTypes.func.isRequired
}

let mapStateToProps = (state) => {
  return({
    activePage: state.tempEdge.active_page
  });
}

CreateNewAgency = reduxForm({
  form: 'CreateNewAgency',
  validate: validate
})(CreateNewAgency);

export default withLocalize(connect(mapStateToProps, { setActivePage })(CreateNewAgency));
