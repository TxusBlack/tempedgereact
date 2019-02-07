import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { initialize } from 'react-localize-redux';
import { addTranslation } from 'react-localize-redux';
import { renderToStaticMarkup } from 'react-dom/server';
import { withLocalize, Translate } from 'react-localize-redux';

class HomePage extends Component{
  constructor(props) {
    super(props);

    this.props.initialize({
      languages: [
        { name: 'English', code: 'en' },
        { name: 'Spanish', code: 'es' }
      ],
      options: { renderToStaticMarkup }
    });
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
    console.log("APP!");
    return (
      <div className="container-fluid">
        HOMEPAGE!<br />
        <Link to="/login">Login</Link><br />
        <Link to="/register">Create New User</Link>
      </div>
    );
  }
};

export default withLocalize(HomePage);
