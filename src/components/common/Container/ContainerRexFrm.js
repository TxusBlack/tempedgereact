import React, { Component } from 'react';
import { push } from 'connected-react-router';
import ActiveLanguageAddTranslation from '../ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

class ContainerRexFrm extends Component {

    constructor(props) {
        super(props);

        ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }

    componentDidUpdate(prevProps, prevState) {
        const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

        if (hasActiveLanguageChanged) {
            this.props.push(`/auth/${this.props.activeLanguage.code}`);
            ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
        }
    }

    onSubmit = async (formValues) => {
      this.props.onSubmit(formValues);
    }

    render() {
        return (
            <div>
                <div className="panel main-form-panel">
                    <div className="container-form-title text-center">
                        <Translate id={this.props.title} />
                    </div>
                    <div className="row container-form">
                      <Form className="panel-body form-horizontal center-block" onSubmit={this.props.handleSubmit(this.onSubmit)}>
                        {this.props.children}

                        <div className="">
                          {this.props.btns}
                        </div>
                      </Form>
                    </div>
                </div>

            </div>
        );
    }
}

ContainerRexFrm = reduxForm({
    form: 'containerRexFrm', //                 <------ form name
    destroyOnUnmount: false, //        <------ preserve form data
    // forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
    //validate: Validate
})(ContainerRexFrm);


export default withLocalize(connect(null, { push })(ContainerRexFrm));
