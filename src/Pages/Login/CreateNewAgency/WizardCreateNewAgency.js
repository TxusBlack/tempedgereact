import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WizardCreateNewAgencyFirstPage from './WizardCreateNewAgencyFirstPage';
import WizardCreateNewAgencySecondPage from './WizardCreateNewAgencySecondPage';
import WizardCreateNewAgencyThirdPage from './WizardCreateNewAgencyThirdPage';
import { connect } from 'react-redux';
import  { setActivePage } from '../../../Redux/actions/tempEdgeActions';
import countryList from '../../../country-region-data/data';

class CreateNewAgency extends Component {
  constructor(props) {
    super(props);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);

    this.state = {
      page: 1,
    };
  }

  componentWillMount(){
    this.props.setActivePage("registerAgency");
  }

  nextPage(){
    console.log("Next Page!");
    this.setState({ page: this.state.page + 1 });
  }

  previousPage(){
    console.log("Previous Page!");
    this.setState({ page: this.state.page - 1 });
  }

  onSubmit(formValues){
    console.log(formValues);
  }

  render() {
    let { page } = this.state;
    let countries = countryList();

    console.log("this.state.page: ",this.state.page);
    console.log("countryList: ", countries);

    return (
      <div>
        {page === 1 && <WizardCreateNewAgencyFirstPage onSubmit={this.nextPage} countryList={countries} params={this.props.match.params} {...this.props} />}
        {page === 2 &&
          <WizardCreateNewAgencySecondPage previousPage={this.previousPage} onSubmit={this.nextPage} countryList={countries} params={this.props.match.params} {...this.props} />}
        {page === 3 &&
          <WizardCreateNewAgencyThirdPage previousPage={this.previousPage} onSubmit={this.onSubmit} countryList={countries} params={this.props.match.params} {...this.props} />}
      </div>
    );
  }
}

CreateNewAgency.propTypes = {
  setActivePage: PropTypes.func.isRequired
};

let mapStateToProps = (state) => {
  return({
    activePage: state.tempEdge.active_page
  });
}

export default connect(mapStateToProps, { setActivePage })(CreateNewAgency);
