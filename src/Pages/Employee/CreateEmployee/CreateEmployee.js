import React, { Component } from 'react';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import { Translate, withLocalize } from 'react-localize-redux';
import { Field, reduxForm } from 'redux-form';
import InputBox from '../../../components/common/InputBox/InputBox.js';
import { connect } from 'react-redux';
import ActiveLanguageAddTranslation from '../../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { tempedgeAPI } from '../../../Redux/actions/tempEdgeActions';
import Container from '../../../components/common/Container/Container';
import Form from 'react-bootstrap/Form';
import Stepper from 'react-stepper-horizontal';

const styles = {
    fontFamily: "sans-serif",
    textAlign: "center"
  };

class CreateEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage :3,
            steps: [
                {title: ""},
                {title: ""},
                {title: ""},
                {title: ""},
                {title: ""},
                {title: ""}
               ]
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

        let key = this.state.key;
        return (
            <React.Fragment>
            <Stepper steps={ this.state.steps } activeStep={ key } activeColor="#eb8d34" completeColor="#8cb544" defaultBarColor="#eb8d34" completeBarColor="#8cb544" barStyle="solid" circleFontSize={16} />

            <Container>
            <div className="formPanel">
                <Form>
                <ul className="nav nav-panel">
                    <li className="nav-item first-panel " onClick={()=>this.setState({key:0})}>
                        <a className="nav-link active" data-toggle="tab" href="#tab1">Info</a>
                    </li>
                    <li className="nav-item panel" onClick={()=>this.setState({key:1})}>
                        <a className="nav-link" data-toggle="tab" href="#tab2">Contact</a>
                    </li>
                    <li className="nav-item panel" onClick={()=>this.setState({key:2})}>
                        <a className="nav-link" data-toggle="tab" href="#tab3">Tax</a>
                    </li>
                    <li className="nav-item panel" onClick={()=>this.setState({key:3})}>
                        <a className="nav-link" data-toggle="tab" href="#tab4">Skills</a>
                    </li>
                    <li className="nav-item panel" onClick={()=>this.setState({key:4})}>
                        <a className="nav-link" data-toggle="tab" href="#tab5">Obs</a>
                    </li>
                    <li className="nav-item last-panel" onClick={()=>this.setState({key:5})}>
                        <a className="nav-link" data-toggle="tab" href="#tab6">Misc</a>
                    </li>
                </ul>

                <div className="tab-content formPanelBody">
                    <div className="tab-pane fade show active" id="tab1" role="tabpanel">
                        <div className="row">
                            
                            <div className="col-10 col-md-5 col-lg-4">
                                <div className="row">
                                    <div className="col-12">
                                        <label className="control-label">Create temporal data for this employee</label>
                                    </div>
                                    <div className="col-11">
                                        <Field name="firstName" type="text" placeholder="First Name" category="person" component={InputBox} />
                                    </div>
                                </div>
                            </div>
                            <div className="col10 col-md-5 col-lg-4">
                                <div className="row">
                                    <div className="col-12">
                                        <label className="control-label">Pass</label>
                                    </div>
                                    <div className="col-11">
                                        <input type="text" name="FirstName" className="form-control tempEdge-input-box"/>
                                    </div>
                                </div>
                            </div>
                            <div className="col10 col-md-5 col-lg-4">
                                <div className="row">
                                    <div className="col-12">
                                        <label className="control-label">Pass</label>
                                    </div>
                                    <div className="col-1">
                                    </div>
                                    <div className="col-11">
                                    tab 1 content...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="tab2" role="tabpanel">tab 2 content..
                    
                    </div>
                    <div className="tab-pane fade" id="tab3" role="tabpanel">tab 3 content...</div>
                    <div className="tab-pane fade" id="tab4" role="tabpanel">tab 3 content...</div>
                    <div className="tab-pane fade" id="tab5" role="tabpanel">tab 3 content...</div>
                    <div className="tab-pane fade" id="tab6" role="tabpanel">tab 3 content...</div>
                </div>
                </Form>
            </div>
            </Container>
            </React.Fragment>
            
        )
    }
}

CreateEmployee.propTypes = {     //Typechecking With PropTypes, will run on its own, no need to do anything else, separate library since React 16, wasn't the case before on 14 or 15
   //Action, does the Fetch part from the posts API
   tempedgeAPI: PropTypes.func.isRequired,     //Action, does the Fetch part from the posts API
}

export default withLocalize(connect(null, { push, tempedgeAPI })(CreateEmployee));

