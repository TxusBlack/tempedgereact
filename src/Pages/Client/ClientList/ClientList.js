import React, { Component } from 'react';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { tempedgeAPI } from '../../../Redux/actions/tempEdgeActions';
import PaginatedTable from '../../../components/common/Table/PaginatedTable.js';

const api_url = '/api/client/list';

class ClientList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tablePage : 0,
            filterBy : {},
            data : []
        }
        
        ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }

    componentDidUpdate(prevProps, prevState) {
        const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

        if (hasActiveLanguageChanged) {
            this.props.push(`/client/${this.props.activeLanguage.code}`);

            ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
        }
    }

    render() {
        let data = this.props.employeeList;
        console.log(data);

        return (
            <PaginatedTable apiUrl = {api_url}/>
        )
    }
}

ClientList.propTypes = {     //Typechecking With PropTypes, will run on its own, no need to do anything else, separate library since React 16, wasn't the case before on 14 or 15
   //Action, does the Fetch part from the posts API
   tempedgeAPI: PropTypes.func.isRequired,     //Action, does the Fetch part from the posts API
}

export default withLocalize(connect(null, { push, tempedgeAPI })(ClientList));

