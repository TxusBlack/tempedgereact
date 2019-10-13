import { push } from 'connected-react-router';
import React from 'react';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import ActiveLanguageAddTranslation from '../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import InputBox from '../../components/common/InputBox/InputBox.js';
import Validate from '../Validations/Validations';

class GenericDashboard extends React.Component{
  constructor(props){
    super(props);
    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  componentDidUpdate(prevProps, prevState){
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/dashboard/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  render(){
    return(
      <React.Fragment>
        <form className="panel-body" onSubmit={this.props.handleSubmit} className="form-horizontal center-block main-panel" style={{paddingBottom: "0px", width: 1600}}>
          <div className="panel main-form-panel">
            <div className="panel-heading main-header">
              <h2 className="text-center">{this.props.title}</h2>
            </div>
            <div className="main-form-panel-inputs">
              <div className="panel-body" className="form-horizontal center-block main-form" style={{paddingBottom: "0px"}}>
                <div className="form-group main-form-group row">
                  {this.props.body}
                </div>
              </div>
            </div>
            <div className="panel-footer main-footer panel-footer-agency-height-override">

            </div>
          </div>
        </form>
      </React.Fragment>
    )
  }
}

GenericDashboard = reduxForm({
  form: 'genericDashboard', //                 <------ form name
  destroyOnUnmount: false, //        <------ preserve form data
  // forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate: Validate
})(GenericDashboard);

export default withLocalize(connect(null, { push })(GenericDashboard));
