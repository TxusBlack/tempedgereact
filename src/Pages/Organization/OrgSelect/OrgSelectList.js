import React from 'react';
import Tile from './Tile';
import Container from '../../../components/common/Container/Container.js';
import ReactTooltip from 'react-tooltip';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { withLocalize } from 'react-localize-redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { notify } from 'reapop';

class OrgSelectList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false
    }

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage).then(() => {
      this.setState({ error: false })
    }).catch(err => {
      if (!this.state.error) {
        this.setState({ error: true });
        this.fireNotification('Error',
          this.props.activeLanguage.code === 'en'
            ? 'It is not posible to proccess this transaction. Please try again later'
            : 'En este momento no podemos procesar esta transacción. Por favor intente mas tarde.',
          'error'
        );
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.push(`/organization-select/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage).then(() => this.setState({ error: false }));
    }
  }

  fireNotification = (title, message, status) => {
    let { notify } = this.props;

    notify({
      title,
      message,
      status,
      position: 'br',
      dismissible: true,
      dismissAfter: 3000
    });
  }

  render() {
    let content = (
      <div style={{ width: "100%", margin: 40 }}>
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

    return (
      <Container title="com.tempedge.msg.label.selectorg" children={content} />
    );
  }
}

let mapStateToProps = (state) => {
  return ({
    login: (state.tempEdge.login !== "" && typeof state.tempEdge.login !== "undefined") ? state.tempEdge.login : null
  });
}

export default withLocalize(connect(mapStateToProps, { push, notify })(OrgSelectList));
