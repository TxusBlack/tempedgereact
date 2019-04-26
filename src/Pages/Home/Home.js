import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';

class HomePage extends Component{
  constructor(props) {
    super(props);

    let { setActiveLanguage } = props;
    let defaultLanguage = this.props.lang;

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
    let loginRoute = `/auth/${this.props.lang}`;
    let registerRoute = `/register/${this.props.lang}`;
    let registerAgencyRoute = `/registerAgency/${this.props.lang}`;
    let snapshotRouteMobile = `/snapshot-mobile/${this.props.lang}`;
    let snapshotRouteDesktop = `/snapshot-desktop/${this.props.lang}`;
    let inputFileRoute = `/upload/${this.props.lang}`;
    let protectedRoute = `/protected/${this.props.lang}`;

    return(
      <div className="container-fluid">
        HOMEPAGE!<br />
        <Link to={loginRoute}>Login</Link><br />
        <Link to={registerRoute}>Create New User</Link><br />
        <Link to={registerAgencyRoute}>Create New Agency</Link><br />
        <Link to={snapshotRouteMobile}>Capture Face Snapshot - Mobile View</Link><br />
        <Link to={snapshotRouteDesktop}>Capture Face Snapshot - Desktop View</Link><br />
        <Link to={inputFileRoute}>Upload File</Link><br />
        <Link to={protectedRoute}>Protected Route</Link>
      </div>
    );
  }
};

export default withLocalize(connect(null)(HomePage));
