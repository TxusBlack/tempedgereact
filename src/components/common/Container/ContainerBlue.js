import React, { Component } from 'react';
import { push } from 'connected-react-router';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import ActiveLanguageAddTranslation from '../ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';

class ContainerBlue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 'com.tempedge.msg.label.salesperson'
    };
    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }
  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/approveuser/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }
  render() {
    const { width, title, children, btns } = this.props;
    return (
      <div>
        <div className="panel main-form-panel" style={{ width: width }}>
          <div className="panel-heading register-header text-center">
            <h2>
              <Translate id={title} />
            </h2>
          </div>
          <div className="container-form-blue">{children}</div>
          <div className="container-footer-blue">{btns}</div>
        </div>
      </div>
    );
  }
}

ContainerBlue = reduxForm({
  form: 'containerBlue', //                 <------ form name
  destroyOnUnmount: false //        <------ preserve form data
  // forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  //validate: Validate
})(ContainerBlue);

export default withLocalize(connect(null, { push })(ContainerBlue));
