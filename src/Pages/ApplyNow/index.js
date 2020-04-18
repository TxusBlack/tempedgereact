import React, { Component } from 'react';
import { Translate, withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import ActiveLanguageAddTranslation from '../../components/common/ActiveLanguageAddTranslation/ActiveLanguageAddTranslation.js';
import ProgressBar from 'react-bootstrap/ProgressBar';
import ContainerBlue from '../../components/common/Container/ContainerBlue.js';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import Validate from '../Validations/Validations';

class ApplyNow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null
    }
    ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
  }

  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.props.history.push(`/applynow/${this.props.activeLanguage.code}`);
      ActiveLanguageAddTranslation(this.props.activeLanguage, this.props.addTranslationForLanguage);
    }
  }

  onSubmit = () => {

  }

  render() {
    // return (
    //   <div className="container-fluid login-container" style={{ width: '80vw' }}>
    //     ApplyNow
    //   </div>
    // )

    const { btnDisabled, now, resultBar } = this.state;
    const { handleSubmit } = this.props;

    const bodyContainer = (
      <form className="panel-body" onSubmit={handleSubmit(this.onSubmit)}>
        <div className="row">
          <div className="col-12">{resultBar}</div>
        </div>

        <div className="form-group row">
          <div className="col-12">
            <p className="text-left label-p">
              <Translate id="com.tempedge.msg.label.uploadEmployeeList" />
            </p>
            <div className="input-group">
              <label htmlFor="employeeListFile" className="input-group-btn">
                <span className="btn department-list-button">
                  <Translate id="com.tempedge.msg.label.choosefile" />
                  <input id="employeeListFile" type="file" onChange={(e) => this.onChange(e)} className="d-none" accept=".xlsx, .xls" />
                </span>
              </label>
              <br />
              <div className="w-100">
                <p className="text-left" ref={this.fileNameTextBox} />
              </div>
            </div>
          </div>
        </div>
        <ProgressBar animated now={now} label={`${now}%`} />
        <div className="form-group">
          <button type="submit" className="btn btn-primary btn-block" disabled={btnDisabled}>
            <Translate id="com.tempedge.msg.label.upload" />
          </button>
        </div>
      </form>
    );
    return <ContainerBlue title="com.tempedge.msg.label.uploadEmployeeList" children={bodyContainer} width="40%" />;
  }
}

ApplyNow.propTypes = {
  reset: PropTypes.func.isRequired,
  tempedgeAPI: PropTypes.func.isRequired,
  clearTempedgeStoreProp: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired
};

const mapStateToProps = ({ tempEdge }) => ({ saveEmployeeList: tempEdge.saveEmployeeList, countryRegionList: tempEdge.country_region_list });

const applyNow = reduxForm({
  form: 'applyNow',
  validate: Validate
})(ApplyNow);

// export default withLocalize(connect(null, null)(ApplyNow));

export default withLocalize(
  connect(mapStateToProps, 
    null
  )(applyNow)
);
