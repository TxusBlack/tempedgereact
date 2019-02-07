import React, { Component } from 'react';
import { withLocalize, Translate } from 'react-localize-redux';

class CreateNewUser extends Component{
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
    return(
      <form className="form-horizontal center-block register-form" style={{width: "40%", padding: "30px 0"}}>
        <div className="form-group has-success">
            <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.firstname">First Name (Required)</Translate></label>
            <div className="col-xs-10">
                <input type="text" id="firstName" className="form-control" placeholder="Input with success" />
                <span className="help-block">Username is available</span>
            </div>
        </div>
        <div className="form-group has-success">
            <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.middlename">Middle Name</Translate></label>
            <div className="col-xs-10">
                <input type="text" id="middleName" className="form-control" placeholder="Input with success" />
                <span className="help-block">Username is available</span>
            </div>
        </div>
        <div className="form-group has-success">
            <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.lastname">Last Name (Required)</Translate></label>
            <div className="col-xs-10">
                <input type="text" id="lastName" className="form-control" placeholder="Input with success" />
                <span className="help-block">Username is available</span>
            </div>
        </div>
        <div className="form-group has-error">
            <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.email">Email</Translate></label>
            <div className="col-xs-10">
                <input type="email" id="email" className="form-control" placeholder="Input with error" />
                <span className="help-block">Please enter a valid email address</span>
            </div>
        </div>
        <div className="form-group has-success">
            <label className="col-xs-2 control-label"><Translate id="com.tempedge.msg.label.birthday">Birthday</Translate></label>
            <div className="col-xs-10">
                <input type="date" id="birthday" className="form-control" placeholder="Input with success" />
                <span className="help-block">Username is available</span>
            </div>
        </div>
        <div className="form-group">
            <div className="col-md-6 col-md-offset-3">
                <button type="submit" className="btn btn-primary btn-block register-save-btn"><Translate id="com.tempedge.msg.label.save">Save</Translate></button>
            </div>
        </div>
    </form>
    );
  }
}

export default withLocalize(CreateNewUser);
