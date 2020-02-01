import React from 'react';
import { connect } from 'react-redux';
import { withLocalize, Translate } from 'react-localize-redux';

class OutcomeBar extends React.Component {
  render(){
    return <div className={this.props.classApplied}><p><Translate id={this.props.translateId} /></p></div>;
  }
}

export default withLocalize(connect(null, {})(OutcomeBar));
