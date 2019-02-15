import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { initialize } from 'react-localize-redux';
import { addTranslation } from 'react-localize-redux';
import { withLocalize, Translate } from 'react-localize-redux';

class HomePage extends Component{
  constructor(props) {
    super(props);

    let { setActiveLanguage } = props;
    let defaultLanguage = this.props.lang;

    this.props.initialize({
      languages: props.languages,
      options: props.options
    });

    setActiveLanguage(defaultLanguage);
  }

  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
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

  render() {
    let loginRoute = `/login/${this.props.lang}`;
    let registerRoute = `/register/${this.props.lang}`;
    let registerAgencyRoute = `/registerAgency/${this.props.lang}`;

    return (
      <div className="container-fluid">
        HOMEPAGE!<br />
        <Link to={loginRoute}>Login</Link><br />
        <Link to={registerRoute}>Create New User</Link><br />
        <Link to={registerAgencyRoute}>Create New Agency</Link>
      </div>
    );
  }
};

// let mapStatetoProps = (state) => ({
//
// });

export default withLocalize(connect(null)(HomePage));
