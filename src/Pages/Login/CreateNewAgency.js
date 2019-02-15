import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import Validators from 'redux-form-validators';
import { required, date } from 'redux-form-validators';
import 'react-widgets/dist/css/react-widgets.css';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import  { setActivePage } from '../../Redux/actions/tempEdgeActions';

class CreateNewAgency extends Component{
  constructor(props) {
    super(props);

    this.addTranslationsForActiveLanguage();
  }

  componentWillMount(){
    this.props.history.location.pathname = `/registerAgency/${this.props.activeLanguage.code}`;
    this.props.history.push(`/registerAgency/${this.props.activeLanguage.code}`);
    this.props.setActivePage("registerAgency");
  }

  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;
    console.log("hasActiveLanguageChanged: ", hasActiveLanguageChanged);

    if (hasActiveLanguageChanged) {
      this.props.params.lang = this.props.activeLanguage.code;
      this.props.history.location.pathname = `/registerAgency/${this.props.activeLanguage.code}`;
      this.props.history.push(`/registerAgency/${this.props.activeLanguage.code}`);
      this.addTranslationsForActiveLanguage();
    }
  }

  addTranslationsForActiveLanguage() {
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
      fieldId = `com.tempedge.error.person.${formProps.input.name}required`;
      errMsg = formProps.meta.error;

      if(formProps.meta.touched && formProps.meta.error && typeof errMsg !== 'undefined'){
        return(
          <p style={{color: '#a94442'}}><Translate id={fieldId}>{errMsg}</Translate></p>
        );
      }
    }
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
    return(
      <React.Fragment>
        <h2 className="text-center page-title"><Translate id="com.tempedge.msg.label.newagency">New Agency</Translate></h2>
        <form onSubmit={this.props.handleSubmit(this.onSubmit)} className="form-horizontal center-block register-form" style={{width: "40%", padding: "30px 0"}}>
          <div className="form-group">
              <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.agencyname">Agency Name</Translate></label>
              <Field name="firstName" type="text" placeholder="Agency Name" component={(formProps) => this.renderInput(formProps)} />
          </div>
          <div className="form-group">
              <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.agencyaddress">Address</Translate></label>
              <Field name="middleName" type="text" placeholder="Address" component={(formProps) => this.renderInput(formProps)} />
          </div>
          <div className="form-group">
              <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.agencyappartment">Apartment (Required)</Translate></label>
              <Field name="lastName" type="text" placeholder="Apartment" component={(formProps) => this.renderInput(formProps)} />
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

let mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // dispatching plain actions
    init: (langCode) => {
      console.log("languages: ", ownProps.languages);
      let storeOp = dispatch(ownProps.initialize(ownProps.languages, { renderToStaticMarkup: true, defaultLanguage: langCode }));
      console.log("storeOp", storeOp);
      console.log("ownProps: ", ownProps);
    }
  }
}

CreateNewAgency = reduxForm({
  form: 'CreateNewAgency',
  validate: validate
})(CreateNewAgency);

export default withLocalize(connect(mapStateToProps, { setActivePage })(CreateNewAgency));
