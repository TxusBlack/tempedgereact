import React from 'react';
import Tile from './Tile';
import Container from '../../../components/common/Container/Container.js';
import ReactTooltip from 'react-tooltip';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { withLocalize } from 'react-localize-redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

class OrgSelectList extends React.Component{
  constructor(props){
    super(props);

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  componentDidUpdate(prevProps, prevState){
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/organization-select/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  render(){
    let content = (
      <div style={{width: "100%", margin: 40}}>
        {this.props.login.portalUserList.map((agency, index) => {
            let orgName = agency.organizationEntity.organizationName;

            return (
              <React.Fragment>
                <a data-tip data-for={`orgName-${index}`}>
                  <Tile agency={agency} key={index} />
                </a>
                <ReactTooltip id={`orgName-${index}`}>
                  <span>{orgName}</span>
                </ReactTooltip>
              </React.Fragment>
            );
         })}
      </div>
    );

    return(
      <Container title="com.tempedge.msg.label.selectorg" children={content}/>
    );
  }
}

let mapStateToProps = (state) => {
  return({
    login: (state.tempEdge.login !== "" && typeof state.tempEdge.login !== "undefined")? state.tempEdge.login: null
  });
}

export default withLocalize(connect(mapStateToProps, {push})(OrgSelectList));
