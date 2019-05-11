import React from 'react';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import ActiveLanguageAddTranslation from '../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';

class AdminDashboard extends React.Component{
  constructor(props){
    super(props);
    console.log("props: ", props);
    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  componentDidUpdate(prevProps, prevState){
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/approveuser/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  render(){
    return(
      <React.Fragment>
        <form className="panel-body" onSubmit={this.props.handleSubmit} className="form-horizontal center-block main-panel" style={{paddingBottom: "0px"}}>

          <div className="panel main-form-panel">
            <div className="panel-heading register-header">
              <h2 className="text-center"><Translate id="com.tempedge.msg.label.salesperson">Salesmen</Translate></h2>
            </div>
            <div className="main-form-panel-inputs">

            </div>
            <div className="panel-footer main-footer panel-footer-agency-height-override">
              <div className="row prev-next-btns-agency">
                <div className="col-lg-4 offset-lg-2">
                  <button type="button" className="btn btn-default btn-block register-save-btn previous" onClick={this.props.previousPage}>Back</button>
                </div>
                <div className="col-lg-4">
                  <button type="submit" className="btn btn-primary btn-block register-save-btn next" disabled={this.props.invalid || this.props.submiting || this.props.pristine}><Translate id="com.tempedge.msg.label.next">Next</Translate></button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </React.Fragment>
    )
  }
}

export default withLocalize(connect(null, { push })(AdminDashboard));
