import React from 'react';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import ActiveLanguageAddTranslation from '../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';

class UserDashboard extends React.Component{
  constructor(props){
    super(props);

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  componentDidUpdate(prevProps, prevState){
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if(hasActiveLanguageChanged){
      push(`/protected/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  render(){
    return(
      <React.Fragment>
        <h1>Welcome</h1>
        <h2>{this.props.name}</h2>
        <h2>You have successfully logged in !</h2>
      </React.Fragment>
    );
  }
}

let mapStateToProps = (state) => {
  return{
    name: state.tempEdge.login.portalUserList[0].user.firstName + " " + state.tempEdge.login.portalUserList[0].user.lastName
  };
}

export default withLocalize(connect(mapStateToProps)(UserDashboard));
