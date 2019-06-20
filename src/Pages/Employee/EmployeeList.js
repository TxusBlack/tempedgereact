import React, { Component } from 'react';
import { push } from 'connected-react-router';
import { GET_EMPLOYEE_LIST } from '../../Redux/actions/types.js'
import PropTypes from 'prop-types';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import ActiveLanguageAddTranslation from '../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import Container from '../../components/common/Container/Container';
import ContainerBlue from '../../components/common/Container/ContainerBlue';
import { tempedgeAPI } from '../../Redux/actions/tempEdgeActions';
import Table from '../../components/common/Table/Table.js';


class EmployeeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data : []
        }
        
        ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }

    componentDidMount (){
        this.props.tempedgeAPI('/api/person/list',{orgId : 1},  GET_EMPLOYEE_LIST);
        this.setState(() => ({data : this.props.employeeList}));
    }
    componentDidUpdate(prevProps, prevState) {
        const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

        if (hasActiveLanguageChanged) {
            this.props.push(`/employee/${this.props.activeLanguage.code}`);
            ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
        }
    }
    render() {
        console.log("props: ", this.props);
        let data = this.state.data;

        return (
            <React.Fragment>
                <Container title="com.tempedge.msg.lable.employeeList">
                { data ? 
                    <div >
                        <Table data={data} />
                    </div> :
                    "NO RECORDS FOUND"
                }
                    
                </Container>
                <ContainerBlue title="com.tempedge.msg.lable.employeeList">
                 { data ? 
                    <div >
                        <Table data={data} />
                    </div> : 
                    "NO RECORDS FOUND"
                 }

                </ContainerBlue>

            </React.Fragment>
        )
    }
}

EmployeeList.propTypes = {     //Typechecking With PropTypes, will run on its own, no need to do anything else, separate library since React 16, wasn't the case before on 14 or 15
   //Action, does the Fetch part from the posts API
   tempedgeAPI: PropTypes.func.isRequired,     //Action, does the Fetch part from the posts API
}
let mapStatetoProps = (state) => ({    //rootReducer calls 'postReducer' which returns an object with previous(current) state and new data(items) onto a prop called 'posts' as we specified below
    employeeList: state.tempEdge.employee_list,    //'posts', new prop in component 'Posts'. 'state.postReducer', the object where our reducer is saved in the redux state, must have same name as the reference

})

export default withLocalize(connect(mapStatetoProps, { push, tempedgeAPI })(EmployeeList));

