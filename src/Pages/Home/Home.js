import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

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
    let snapshotRouteDesktop = `/snapshot-desktop/${this.props.lang}`;
    let inputFileRoute = `/upload/${this.props.lang}`;
    let protectedRoute = `/protected/${this.props.lang}`;
    let genericDashboard = `/dashboard/${this.props.lang}`;
    let employee = `/employee/${this.props.lang}`;
    let createNewClient = `/createClient/${this.props.lang}`;


    return(
      <div className="container-fluid">
        <h4>HOMEPAGE!</h4>
        <Link to={loginRoute}>Login</Link><br />
        <Link to={registerRoute}>Create New User</Link><br />
        <Link to={registerAgencyRoute}>Create New Agency</Link><br />
        <Link to={createNewClient}>Create New Client</Link><br />
        <Link to={snapshotRouteDesktop}>Capture Face Snapshot - Desktop View</Link><br />
        <Link to={inputFileRoute}>Upload File</Link><br />
        <Link to={protectedRoute}>Protected Route</Link><br />
        <Link to={employee}>Employee</Link><br />
        <Link to={genericDashboard}>Generic Dashboard</Link>
      </div>
    );
  }
};

export default withLocalize(connect(null)(HomePage));
