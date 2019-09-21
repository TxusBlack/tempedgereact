import React, { Component } from 'react';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { tempedgeAPI } from '../../../Redux/actions/tempEdgeActions';
import ContainerBlue from '../../../components/common/Container/ContainerBlue';
import Form from 'react-bootstrap/Form'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

class CreateEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        
        ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }

    componentDidUpdate(prevProps, prevState) {
        const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

        if (hasActiveLanguageChanged) {
            this.props.push(`/employee/create/${this.props.activeLanguage.code}`);
            ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
        }
    }

    render() {

        return (
            <ContainerBlue title="Create Person">
                <Form>
                <Tabs defaultActiveKey="home" transition={false} id="noanim-tab-example">
                    <Tab eventKey="home" title="Home" className="btnClass">
`                        test4
                    </Tab>
                    <Tab eventKey="profile" title="Profile">
                        test2
                    </Tab>
                    <Tab eventKey="contact" title="Contact">
                        Test
                    </Tab>
                </Tabs>

                </Form>
            </ContainerBlue>
        )
    }
}

CreateEmployee.propTypes = {     //Typechecking With PropTypes, will run on its own, no need to do anything else, separate library since React 16, wasn't the case before on 14 or 15
   //Action, does the Fetch part from the posts API
   tempedgeAPI: PropTypes.func.isRequired,     //Action, does the Fetch part from the posts API
}

export default withLocalize(connect(null, { push, tempedgeAPI })(CreateEmployee));

