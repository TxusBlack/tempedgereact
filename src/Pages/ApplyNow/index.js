import React, { Component } from 'react';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import ActiveLanguageAddTranslation from '../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';

class ApplyNow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null
    }
    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.history.push(`/applynow/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  render() {
    return (
      <div className="container-fluid login-container" style={{ width: '80vw' }}>
        ApplyNow
      </div>
    )
  }
}

export default withLocalize(connect(null, null)(ApplyNow));