import React, { Component } from 'react';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation';
import PaginatedTable from '../../../components/common/Table/PaginatedTable';

const apiUrl = '/api/orgdepartment/findAll';

class DepartmentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orgId: 1,
      filterBy: {}
    };
    const { activeLanguage, addTranslationForLanguage } = this.props;

    ActiveLanguageAddTranslation(activeLanguage, addTranslationForLanguage);
  }

  componentDidUpdate(prevProps) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      const { activeLanguage, addTranslationForLanguage, push } = this.props;
      push(`/employee/list/${activeLanguage.code}`);
      ActiveLanguageAddTranslation(activeLanguage, addTranslationForLanguage);
    }
  }

  render() {
    const { onClickRows, multipleRows } = this.props;
    return <PaginatedTable apiUrl={apiUrl} title="com.tempedge.msg.label.departmentlist" onClickRows={onClickRows} multipleRows={multipleRows} />;
  }
}

DepartmentList.propTypes = {};

export default withLocalize(connect(null, { push })(DepartmentList));
