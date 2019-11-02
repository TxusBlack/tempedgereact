import React, { Component } from 'react';
import { push } from 'connected-react-router';
import { TEMPEDGE_LIST } from '../../../Redux/actions/types.js'
import PropTypes from 'prop-types';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import Container from '../../../components/common/Container/Container';
import ContainerBlue from '../../../components/common/Container/ContainerBlue';
import TPaginator from '../../../components/common/Table/TPaginator';
import { tempedgeAPI } from '../../../Redux/actions/tempEdgeActions';
import Table from '../../../components/common/Table/Table.js';


class PaginatedTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tablePage : 0,
            filterBy : {},
            data : []
        }
        
        ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }

    componentDidMount (){
        let payload = {orgId : 1, filterBy:{}};
        payload.data = this.props.payload;
        this.props.tempedgeAPI(this.props.apiUrl, payload,  TEMPEDGE_LIST);
    }
    changePage = (myPage) =>{
        console.log(myPage);
        this.setState({tablePage : myPage});
        let payload = {
            orgId : 1, 
            page : myPage, 
            filterBy: this.state.filterBy
        };

        this.props.tempedgeAPI(this.props.apiUrl,payload, TEMPEDGE_LIST);
    }
    applyFilter = (sortBy, filterValue) =>{
        let filter = {
            ...this.state.filterBy,
            [sortBy] : filterValue
        }
        
        this.setState({sortBy : sortBy, filterBy : filter});

        this.props.tempedgeAPI(this.props.apiUrl,
            {
                orgId : 1, 
                page : this.state.tablePage, 
                filterBy : filter 
            },  TEMPEDGE_LIST);
    }

    render() {
        let data = this.props.paginatorList;
        let title = this.props.title;
        
        console.log(data);

        return (
            <React.Fragment>
                <Container title={title} 
                        btns ={data && data.data ? (
                                <TPaginator changePage={this.changePage} />
                        ):""}>
                { data ? 
                    <div className='col-12'>
                        <Table data={data} applyFilter={this.applyFilter}/>
                    </div> :
                    "NO RECORDS FOUND"
                }

                </Container>
                <ContainerBlue title={title} 
                        btns ={data && data.data ? (
                                <TPaginator changePage={()=>this.changePage()}/>
                        ) :""}>
                 
                { data ? 
                    <div className='col-12'>
                        <Table data={data} applyFilter={this.applyFilter}/>
                    </div> : 
                    "NO RECORDS FOUND"
                 }

                </ContainerBlue>

            </React.Fragment>
        )
    }
}

PaginatedTable.propTypes = {     //Typechecking With PropTypes, will run on its own, no need to do anything else, separate library since React 16, wasn't the case before on 14 or 15
   //Action, does the Fetch part from the posts API
   tempedgeAPI: PropTypes.func.isRequired,     //Action, does the Fetch part from the posts API
}
let mapStatetoProps = (state) => ({    //rootReducer calls 'postReducer' which returns an object with previous(current) state and new data(items) onto a prop called 'posts' as we specified below
paginatorList: state.tempEdge.paginatorList,    //'posts', new prop in component 'Posts'. 'state.postReducer', the object where our reducer is saved in the redux state, must have same name as the reference

})

export default withLocalize(connect(mapStatetoProps, { push, tempedgeAPI })(PaginatedTable));

