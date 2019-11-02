import { push } from 'connected-react-router';
import React from 'react';
import ContainerBlue from '../../components/common/Container/ContainerBlue';
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
    let body =(
      <div>
        <h4 style={{textAlign: "center"}}>Dashboard Body</h4>
        <p style={{textAlign: "center"}}>Content for Dashboard....</p>
      </div>
    );

    let footer = <p style={{textAlign: "center"}}>Here you can add a footer ot buttons.</p>

    return(
      <ContainerBlue title="com.tempedge.msg.label.dashboard" children={body} btns={footer} />
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
