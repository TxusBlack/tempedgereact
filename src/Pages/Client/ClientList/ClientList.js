import React, { Component } from 'react';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { tempedgeAPI } from '../../../Redux/actions/tempEdgeActions';
import PaginatedTable from '../../../components/common/Table/PaginatedTable.js';
import { notify } from 'reapop';

const api_url = '/api/client/list';

class ClientList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tablePage: 0,
      filterBy: {},
      data: [],
      error: false
    };

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage)
      .then(() => {
        this.setState({ error: false });
      })
      .catch((err) => {
        if (!this.state.error) {
          this.setState({ error: true });
          this.fireNotification(
            'Error',
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
      this.props.push(`/client/list/${this.props.activeLanguage.code}`);

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
  };

  render() {
    let data = this.props.employeeList;
    console.log(data);

    return <PaginatedTable title="com.tempedge.msg.label.clientList" apiUrl={api_url} />;
  }
}

ClientList.propTypes = {
  //Typechecking With PropTypes, will run on its own, no need to do anything else, separate library since React 16, wasn't the case before on 14 or 15
  //Action, does the Fetch part from the posts API
  tempedgeAPI: PropTypes.func.isRequired //Action, does the Fetch part from the posts API
};

export default withLocalize(connect(null, { push, tempedgeAPI, notify })(ClientList));
