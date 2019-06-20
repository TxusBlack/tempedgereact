import React, { Component } from 'react';
import { push } from 'connected-react-router';
import ActiveLanguageAddTranslation from '../ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

class Container extends Component {

    constructor(props) {
        super(props);
        
        ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
    componentDidUpdate(prevProps, prevState) {
        const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

        if (hasActiveLanguageChanged) {
            this.props.push(`/approveuser/${this.props.activeLanguage.code}`);
            ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
        }
    }
    render() {
        return (
            <div>
                <div className="panel main-form-panel">
                    <div className="container-form-title text-center">
                        <Translate id={this.props.title} />
                    </div>
                    <div className="">
                        {this.props.children} 
                    </div>
                    <div className="">
                        {this.props.btns}
                    </div>
                </div>

            </div>
        );
    }
}

Container = reduxForm({
    form: 'container', //                 <------ form name
    destroyOnUnmount: false, //        <------ preserve form data
    // forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
    //validate: Validate
})(Container);


export default withLocalize(connect(null, { push })(Container));