import React, { Component } from 'react';
import { push } from 'connected-react-router';
import types from '../../../Redux/actions/types.js';
import PropTypes from 'prop-types';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import Container from '../../../components/common/Container/Container';
import ContainerBlue from '../../../components/common/Container/ContainerBlue';
import TPaginator from '../../../components/common/Table/TPaginator';
import { tempedgeAPI, clearTempedgeStoreProp } from '../../../Redux/actions/tempEdgeActions';
import Table from '../../../components/common/Table/Table.js';

class PaginatedTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tablePage: 0,
      filterBy: {},
      data: [],
      orgId: JSON.parse(sessionStorage.getItem('agency')).organizationEntity.orgId
    };

    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  componentWillMount() {
    this.props.clearTempedgeStoreProp('paginatorList');

    this.setState(() => ({
      filterBy: this.props.filterBy ? this.props.filterBy : {}
    }));

    let payload = { orgId: this.state.orgId, filterBy: this.props.filterBy ? this.props.filterBy : { personType: '1' } };

    if (typeof this.props.payload === 'undefined' && typeof this.props.apiUrl !== 'undefined') {
      payload.data = this.props.payload;
      this.props.tempedgeAPI(this.props.apiUrl, payload, types.TEMPEDGE_LIST);
    }
  }

  changePage = (myPage) => {
    this.setState({ tablePage: myPage });
    let payload = {
      orgId: this.state.orgId,
      page: myPage,
      filterBy: this.state.filterBy
    };

    this.props.tempedgeAPI(this.props.apiUrl, payload, types.TEMPEDGE_LIST);
  };

  applyFilter = (sortBy, filterValue) => {
    let filter = {
      ...this.state.filterBy,
      [sortBy]: filterValue
    };

    this.setState({ sortBy: sortBy, filterBy: filter });

    this.props.tempedgeAPI(
      this.props.apiUrl,
      {
        orgId: this.state.orgId,
        page: this.state.tablePage,
        filterBy: filter
      },
      types.TEMPEDGE_LIST
    );
  };

  render() {
    let data =
      typeof this.props.payload === 'undefined' &&
      typeof this.props.apiUrl !== 'undefined' &&
      typeof this.props.paginatorList !== 'undefined' &&
      this.props.paginatorList.data &&
      this.props.paginatorList.data.result
        ? this.props.paginatorList.data.result
        : this.props.payload;
    let title = this.props.title;
    const { onClickRows, multipleRows } = this.props;

    return (
      <React.Fragment>
        <Container title={title} btns={data && data.data ? <TPaginator changePage={this.changePage} /> : ''}>
          {data ? (
            <div className="col-12">
              <Table data={data} applyFilter={this.applyFilter} onClickRows={onClickRows} multipleRows={multipleRows} />
            </div>
          ) : (
            'NO RECORDS FOUND'
          )}
        </Container>
      </React.Fragment>
    );
  }
}

PaginatedTable.propTypes = {
  //Typechecking With PropTypes, will run on its own, no need to do anything else, separate library since React 16, wasn't the case before on 14 or 15
  //Action, does the Fetch part from the posts API
  tempedgeAPI: PropTypes.func.isRequired, //Action, does the Fetch part from the posts API
  clearTempedgeStoreProp: PropTypes.func.isRequired
};

let mapStatetoProps = (state) => ({
  //rootReducer calls 'postReducer' which returns an object with previous(current) state and new data(items) onto a prop called 'posts' as we specified below
  paginatorList: state.tempEdge.paginatorList //'posts', new prop in component 'Posts'. 'state.postReducer', the object where our reducer is saved in the redux state, must have same name as the reference
});

export default withLocalize(connect(mapStatetoProps, { push, tempedgeAPI, clearTempedgeStoreProp })(PaginatedTable));
