import React, { Component } from 'react';
import { withLocalize, Translate } from 'react-localize-redux';

class Login extends Component{
  constructor(props) {
    super(props);

    this.addTranslationsForActiveLanguage();
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

  render(){
    console.log("LOGIN!");
    return(
      <div className="container-fluid login-container">
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <div className="login-form">
              <form method="post">
                  <h2 className="text-center"><Translate id="com.tempedge.msg.label.login">Log In</Translate></h2>
                  <div className="form-group">
                      <input type="text" className="form-control" placeholder="Username" required="required" />
                  </div>
                  <div className="form-group">
                      <input type="password" className="form-control" placeholder="Password" required="required" />
                  </div>
                  <div className="form-group">
                      <button type="submit" className="btn btn-primary btn-block"><Translate id="com.tempedge.msg.label.login">Log In</Translate></button>
                  </div>
                  <div className="clearfix">
                      <label className="pull-left checkbox-inline"><input type="checkbox" /> <Translate id="com.tempedge.msg.label.remember_me">Remember me</Translate></label>
                      <a href="#" className="pull-right"><Translate id="com.tempedge.msg.label.password_retrieve">Forgot Password?</Translate></a>
                  </div>
              </form>
              <p className="text-center"><a href="#"><Translate id="com.tempedge.msg.label.create_account">Create an Account</Translate></a></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withLocalize(Login);
