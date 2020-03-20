import { push } from 'connected-react-router';
import React from 'react';
import ContainerBlue from '../../components/common/Container/ContainerBlue';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import ActiveLanguageAddTranslation from '../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import InputBox from '../../components/common/InputBox/InputBox.js';
import Validate from '../Validations/Validations';
import { notify } from 'reapop';

class GenericDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false
    }
    
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

  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/dashboard/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage).then(() => this.setState({ error: false }));
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
    let body = (
      <div>
        <h4 style={{ textAlign: "center" }}>Dashboard Body</h4>
        <p style={{ textAlign: "center" }}>Content for Dashboard....</p>
      </div>
    );

    let footer = <p style={{ textAlign: "center" }}>Here you can add a footer ot buttons.</p>

    return (
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

export default withLocalize(connect(null, { push, notify })(GenericDashboard));
